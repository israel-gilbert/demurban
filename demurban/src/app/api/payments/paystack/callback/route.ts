import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limiter";
import { logSecurityEvent, safeErrorResponse } from "@/lib/security";

/**
 * Callback handler for Paystack payment verification
 * CRITICAL: Calls Paystack verify API to confirm payment before marking order as PAID
 * Never trusts frontend redirect alone - amount, currency, and status must be validated server-side
 */
export async function GET(request: NextRequest) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const appUrl = process.env.APP_URL;
  const clientIp = getClientIp(request);

  if (!secretKey) {
    logSecurityEvent("missing_env_var", { var: "PAYSTACK_SECRET_KEY" });
    return NextResponse.redirect(new URL("/order/failed", appUrl || "http://localhost:3000"));
  }

  if (!appUrl) {
    logSecurityEvent("missing_env_var", { var: "APP_URL" });
    return NextResponse.redirect(new URL("/order/failed", "http://localhost:3000"));
  }

  // Rate limiting: 20 callback requests per minute per IP (generous for normal flow)
  const rateLimitKey = `paystack_callback:${clientIp}`;
  const rateLimitResult = await rateLimit(rateLimitKey, {
    requests: 20,
    window: 60000,
  });

  if (!rateLimitResult.success) {
    logSecurityEvent("rate_limit_exceeded_callback", {
      ip: clientIp,
      retryAfter: rateLimitResult.retryAfter,
    });
    return NextResponse.redirect(new URL("/order/failed", appUrl));
  }

  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference || typeof reference !== "string" || reference.length > 100) {
      logSecurityEvent("callback_invalid_reference", {
        ip: clientIp,
        referenceLength: reference?.length,
      });
      return NextResponse.redirect(new URL("/order/failed", appUrl));
    }

    const order = await prisma.order.findUnique({
      where: { paystack_reference: reference },
    });

    if (!order) {
      logSecurityEvent("callback_order_not_found", {
        reference,
        ip: clientIp,
      });
      return NextResponse.redirect(new URL("/order/failed", appUrl));
    }

    // CRITICAL: Call Paystack verify API - never trust frontend redirect alone
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secretKey}` },
      }
    );

    const json = await verifyRes.json();

    // Create audit trail
    await prisma.paymentEvent.create({
      data: {
        order_id: order.id,
        reference,
        event_type: "PAYSTACK_VERIFY_CALLBACK",
        payload_json: {
          ...json,
          _metadata: {
            timestamp: new Date().toISOString(),
            ip: clientIp,
            statusCode: verifyRes.status,
          },
        },
      },
    });

    // Strict validation: API success AND correct amount AND correct currency AND success status
    const apiOk = verifyRes.ok && json?.status === true;
    const statusOk = json?.data?.status === "success";
    const amountOk = Number(json?.data?.amount) === order.total_kobo;
    const currencyOk = (json?.data?.currency ?? "NGN") === order.currency;
    const allValid = apiOk && statusOk && amountOk && currencyOk;

    if (allValid) {
      // Atomic update - only if still PENDING (idempotency)
      const updated = await prisma.order.update({
        where: { id: order.id, status: "PENDING" },
        data: {
          status: "PAID",
          paystack_transaction_id: String(json.data.id ?? ""),
          paid_at: new Date(),
        },
      });

      logSecurityEvent("order_marked_paid_via_callback", {
        orderId: order.id,
        reference,
        amount: order.total_kobo,
        ip: clientIp,
      });

      return NextResponse.redirect(new URL("/order/success", appUrl));
    } else {
      // Validation failed - log all details for fraud investigation
      logSecurityEvent("callback_validation_failed", {
        orderId: order.id,
        reference,
        apiOk,
        statusOk,
        amountOk,
        currencyOk,
        expectedAmount: order.total_kobo,
        providedAmount: json?.data?.amount,
        expectedCurrency: order.currency,
        providedCurrency: json?.data?.currency,
        ip: clientIp,
      });

      // Mark as FAILED only if still PENDING (atomic update to avoid race conditions)
      if (order.status === "PENDING") {
        await prisma.order.update({
          where: { id: order.id, status: "PENDING" },
          data: { status: "FAILED" },
        });
      }

      return NextResponse.redirect(new URL("/order/failed", appUrl));
    }
  } catch (err: any) {
    logSecurityEvent("callback_error", {
      error: err?.message,
      ip: clientIp,
    });

    return NextResponse.redirect(new URL("/order/failed", appUrl));
  }
}
