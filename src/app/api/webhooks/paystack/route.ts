import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logSecurityEvent } from "@/lib/security";
import { sendOrderConfirmationEmail } from "@/lib/email";
import crypto from "crypto";

/**
 * Paystack Webhook Handler
 * 
 * This is the PRIMARY payment processing endpoint.
 * Webhooks are more reliable than callbacks because:
 * 1. They work even if the user closes their browser
 * 2. They are server-to-server, reducing tampering risk
 * 3. Paystack retries failed webhook deliveries
 * 
 * CRITICAL: Always verify the webhook signature to ensure it's from Paystack
 */

export const dynamic = "force-dynamic";

function verifyWebhookSignature(payload: string, signature: string | null): boolean {
  if (!signature) return false;
  
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return false;

  const hash = crypto
    .createHmac("sha512", secret)
    .update(payload, "utf8")
    .digest("hex");

  return hash === signature;
}

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get("x-forwarded-for") || "unknown";
  
  const signature = request.headers.get("x-paystack-signature");
  const rawBody = await request.text();
  
  // Verify webhook signature
  if (!verifyWebhookSignature(rawBody, signature)) {
    logSecurityEvent("webhook_invalid_signature", {
      signature: signature ? "present" : "missing",
      ip: clientIp,
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: { event: string; data: any };
  try {
    body = JSON.parse(rawBody);
  } catch {
    logSecurityEvent("webhook_invalid_json", { ip: clientIp });
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event, data } = body;

  logSecurityEvent("webhook_received", {
    event,
    reference: data?.reference,
    ip: clientIp,
  });

  try {
    if (event === "charge.success" || event === "successful") {
      await handleSuccessfulPayment(data);
    } else if (event === "charge.failed" || event === "failed") {
      await handleFailedPayment(data);
    } else {
      logSecurityEvent("webhook_unhandled_event", { event, reference: data?.reference });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logSecurityEvent("webhook_processing_error", {
      event,
      reference: data?.reference,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    
    return NextResponse.json({ received: true });
  }
}

async function handleSuccessfulPayment(data: any) {
  const reference = data?.reference;
  if (!reference) {
    logSecurityEvent("webhook_missing_reference", { event: "charge.success" });
    return;
  }

  // Find the order by Paystack reference
  const order = await prisma.order.findUnique({
    where: { paystack_reference: reference },
    include: {
      items: {
        include: {
          product: {
            select: { title: true, slug: true, images: true },
          },
        },
      },
    },
  });

  if (!order) {
    logSecurityEvent("webhook_order_not_found", { reference });
    return;
  }

  // Only update if still PENDING (idempotency)
  if (order.status !== "PENDING") {
    logSecurityEvent("webhook_order_already_processed", {
      orderId: order.id,
      reference,
      currentStatus: order.status,
    });
    return;
  }

  // Validate amount and currency
  const amountOk = Number(data?.amount) === order.total_kobo;
  const currencyOk = (data?.currency ?? "NGN") === order.currency;

  if (!amountOk || !currencyOk) {
    logSecurityEvent("webhook_amount_mismatch", {
      orderId: order.id,
      reference,
      expectedAmount: order.total_kobo,
      receivedAmount: data?.amount,
      expectedCurrency: order.currency,
      receivedCurrency: data?.currency,
    });
    return;
  }

  // ATOMIC UPDATE: Only update if still PENDING
  const updated = await prisma.order.updateMany({
    where: { id: order.id, status: "PENDING" },
    data: {
      status: "PAID",
      paystack_transaction_id: String(data?.id ?? ""),
      paid_at: new Date(),
    },
  });

  if (updated.count === 0) {
    logSecurityEvent("webhook_race_condition_prevented", { orderId: order.id, reference });
    return;
  }

  // Record payment event
  await prisma.paymentEvent.create({
    data: {
      order_id: order.id,
      reference,
      event_type: "PAYSTACK_WEBHOOK_SUCCESS",
      payload_json: data,
    },
  });

  logSecurityEvent("order_marked_paid_via_webhook", {
    orderId: order.id,
    reference,
    amount: order.total_kobo,
  });

  // Send confirmation email
  try {
    const shippingAddress = order.shipping_address_json as any;
    await sendOrderConfirmationEmail({
      orderNumber: order.order_number,
      customerEmail: order.customer_email,
      customerName: shippingAddress?.fullName || "Customer",
      items: order.items.map((item) => ({
        title: item.title_snapshot,
        size: item.size_snapshot || (item.variant_json as any)?.size || undefined,
        quantity: item.quantity,
        unitPrice: item.unit_price_kobo,
        lineTotal: item.line_total_kobo,
      })),
      subtotal: order.subtotal_kobo,
      shipping: order.shipping_kobo,
      total: order.total_kobo,
      currency: order.currency,
      shippingAddress: {
        fullName: shippingAddress?.fullName || "",
        address1: shippingAddress?.address1 || "",
        address2: shippingAddress?.address2,
        city: shippingAddress?.city || "",
        state: shippingAddress?.state || "",
        country: shippingAddress?.country || "",
        postalCode: shippingAddress?.postalCode,
      },
    });
    logSecurityEvent("webhook_email_sent", { orderId: order.id });
  } catch (emailError) {
    logSecurityEvent("webhook_email_failed", {
      orderId: order.id,
      error: emailError instanceof Error ? emailError.message : "Unknown",
    });
  }
}

async function handleFailedPayment(data: any) {
  const reference = data?.reference;
  if (!reference) {
    logSecurityEvent("webhook_missing_reference", { event: "charge.failed" });
    return;
  }

  const order = await prisma.order.findUnique({
    where: { paystack_reference: reference },
  });

  if (!order) {
    logSecurityEvent("webhook_order_not_found", { reference });
    return;
  }

  if (order.status !== "PENDING") {
    logSecurityEvent("webhook_order_already_processed", {
      orderId: order.id,
      reference,
      currentStatus: order.status,
    });
    return;
  }

  const updated = await prisma.order.updateMany({
    where: { id: order.id, status: "PENDING" },
    data: { status: "FAILED" },
  });

  if (updated.count === 0) {
    logSecurityEvent("webhook_failed_race_condition", { orderId: order.id, reference });
    return;
  }

  await prisma.paymentEvent.create({
    data: {
      order_id: order.id,
      reference,
      event_type: "PAYSTACK_WEBHOOK_FAILED",
      payload_json: data,
    },
  });

  logSecurityEvent("order_marked_failed_via_webhook", { orderId: order.id, reference });
}