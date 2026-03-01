import crypto from "crypto";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { logSecurityEvent } from "@/lib/security";

/**
 * Webhook handler with signature verification and idempotency
 * Rate limiting is handled by Paystack (they have reasonable retry logic)
 */
export async function POST(request: NextRequest) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    logSecurityEvent("missing_webhook_secret");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  // Paystack signs the raw request body with HMAC SHA512
  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";

  // Verify signature
  const hash = crypto.createHmac("sha512", secretKey).update(body).digest("hex");
  if (!signature || hash !== signature) {
    logSecurityEvent("webhook_signature_invalid", {
      provided: signature.substring(0, 20) + "***",
      clientIp: request.headers.get("x-forwarded-for") || "unknown",
    });
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(body);
  } catch (e) {
    logSecurityEvent("webhook_parse_error");
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const eventType = event?.event;
  const data = event?.data;
  const reference: string | undefined = data?.reference;

  // Accept webhook gracefully even if reference is missing (Paystack requirement)
  if (!reference) {
    logSecurityEvent("webhook_no_reference", { eventType });
    return NextResponse.json({ ok: true });
  }

  try {
    // Find order by reference
    const order = await prisma.order.findUnique({
      where: { paystack_reference: reference },
    });

    if (!order) {
      logSecurityEvent("webhook_order_not_found", { reference });
      // Accept the webhook but don't process (idempotency)
      return NextResponse.json({ ok: true });
    }

    // Create payment event record first (audit trail)
    await prisma.paymentEvent.create({
      data: {
        order_id: order.id,
        reference,
        event_type: `PAYSTACK_WEBHOOK_${String(eventType ?? "UNKNOWN")}`,
        payload_json: {
          ...event,
          _metadata: {
            timestamp: new Date().toISOString(),
            ip: request.headers.get("x-forwarded-for") || "unknown",
          },
        },
      },
    });

    // Handle successful payment events with strict validation
    const success = eventType === "charge.success" || eventType === "transaction.success";
    const amountOk = Number(data?.amount) === order.total_kobo;
    const currencyOk = (data?.currency ?? "NGN") === order.currency;
    const statusOk = data?.status === "success";

    if (success && amountOk && currencyOk && statusOk) {
      // Idempotency: only update if still PENDING (prevent double-marking)
      const updated = await prisma.order.update({
        where: { id: order.id, status: "PENDING" }, // Atomic check
        data: {
          status: "PAID",
          paystack_transaction_id: String(data?.id ?? ""),
          paid_at: new Date(),
        },
      });

      logSecurityEvent("order_marked_paid_via_webhook", {
        orderId: order.id,
        reference,
        amount: order.total_kobo,
      });

      return NextResponse.json({ ok: true });
    } else if (success) {
      // Payment claims to be successful but amount/currency mismatch
      logSecurityEvent("webhook_validation_failed", {
        orderId: order.id,
        reference,
        amountOk,
        currencyOk,
        statusOk,
        expectedAmount: order.total_kobo,
        providedAmount: data?.amount,
      });

      // Don't update order status - log for manual review
      return NextResponse.json({ ok: true });
    } else {
      // Payment failed event
      logSecurityEvent("payment_failed_webhook", {
        orderId: order.id,
        reference,
        eventType,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    // Check if it's a unique constraint violation (already marked paid)
    if (err?.code === "P2025") {
      // Record not found with the status filter - order already PAID
      logSecurityEvent("webhook_idempotency_duplicate", { reference });
      return NextResponse.json({ ok: true });
    }

    logSecurityEvent("webhook_processing_error", {
      error: err?.message,
      reference,
    });

    // Always return 200 to acknowledge receipt (Paystack requirement)
    return NextResponse.json({ ok: true });
  }
}
