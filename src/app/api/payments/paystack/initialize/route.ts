import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limiter";
import { safeErrorResponse, logSecurityEvent } from "@/lib/security";

const Schema = z.object({
  orderId: z.string().min(1).max(50).cuid(),
});

export async function POST(request: NextRequest) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const appUrl = process.env.APP_URL;
  const clientIp = getClientIp(request);

  if (!secretKey) {
    logSecurityEvent("missing_env_var", { var: "PAYSTACK_SECRET_KEY" });
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  if (!appUrl) {
    logSecurityEvent("missing_env_var", { var: "APP_URL" });
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    // Rate limiting: IP-based (10 requests per 60 seconds)
    const rateLimitKey = `paystack_init:${clientIp}`;
    const rateLimitResult = await rateLimit(rateLimitKey, {
      requests: parseInt(process.env.RATE_LIMIT_REQUESTS || "10"),
      window: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000"),
    });

    if (!rateLimitResult.success) {
      logSecurityEvent("rate_limit_exceeded_paystack_init", {
        ip: clientIp,
        retryAfter: rateLimitResult.retryAfter,
      });

      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.retryAfter || 60),
          },
        }
      );
    }

    const body = await request.json();
    const { orderId } = Schema.parse(body);

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      logSecurityEvent("order_not_found", { orderId, ip: clientIp });
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "PENDING") {
      logSecurityEvent("order_not_pending", {
        orderId,
        status: order.status,
        ip: clientIp,
      });
      return NextResponse.json({ error: "Order is not payable" }, { status: 400 });
    }

    const callback_url = `${appUrl}/api/payments/paystack/callback`;

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: order.customer_email,
        amount: order.total_kobo,
        reference: order.paystack_reference,
        callback_url,
        metadata: {
          orderId: order.id,
          orderNumber: order.order_number,
        },
      }),
    });

    const json = await res.json();
    if (!res.ok || !json?.status) {
      await prisma.paymentEvent.create({
        data: {
          order_id: order.id,
          reference: order.paystack_reference,
          event_type: "PAYSTACK_INIT_FAILED",
          payload_json: {
            ...json,
            _metadata: { ip: clientIp, timestamp: new Date().toISOString() },
          },
        },
      });

      logSecurityEvent("paystack_init_failed", {
        orderId: order.id,
        error: json?.message,
        ip: clientIp,
      });

      return NextResponse.json(
        { error: json?.message ?? "Paystack init failed" },
        { status: 400 }
      );
    }

    await prisma.paymentEvent.create({
      data: {
        order_id: order.id,
        reference: order.paystack_reference,
        event_type: "PAYSTACK_INIT_OK",
        payload_json: json,
      },
    });

    logSecurityEvent("paystack_init_success", {
      orderId: order.id,
      total: order.total_kobo,
      ip: clientIp,
    });

    return NextResponse.json({ authorizationUrl: json.data.authorization_url });
  } catch (err: any) {
    logSecurityEvent("paystack_init_error", {
      error: err?.message,
      ip: clientIp,
    });

    return NextResponse.json(
      safeErrorResponse(err),
      { status: 400 }
    );
  }
}
