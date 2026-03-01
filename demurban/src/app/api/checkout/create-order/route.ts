import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";
import { rateLimit, getClientIp } from "@/lib/rate-limiter";
import {
  safeErrorResponse,
  logSecurityEvent,
  checkFraudSignals,
  recordPaymentAttempt,
} from "@/lib/security";

const CreateOrderSchema = z.object({
  email: z.string().email().max(255),
  phone: z.string().max(20).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(50),
        quantity: z.number().int().min(1).max(20),
        variant: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .min(1)
    .max(50),
  shippingAddress: z.object({
    fullName: z.string().min(2).max(255),
    address1: z.string().min(3).max(255),
    address2: z.string().max(255).optional(),
    city: z.string().min(2).max(100),
    state: z.string().min(2).max(100),
    country: z.string().min(2).max(100),
    postalCode: z.string().max(20).optional(),
  }),
});

function orderNumber() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `DU-${y}${m}${day}-${nanoid(6).toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);

  try {
    // Rate limiting: IP-based (10 requests per 60 seconds)
    const rateLimitKey = `checkout:${clientIp}`;
    const rateLimitResult = await rateLimit(rateLimitKey, {
      requests: parseInt(process.env.RATE_LIMIT_REQUESTS || "10"),
      window: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000"),
    });

    if (!rateLimitResult.success) {
      logSecurityEvent("rate_limit_exceeded_checkout", {
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
    const parsed = CreateOrderSchema.parse(body);

    // Fraud detection: email velocity
    const fraudSignals = checkFraudSignals(clientIp, parsed.email);
    recordPaymentAttempt(clientIp, parsed.email);

    if (fraudSignals.isHighRisk) {
      logSecurityEvent("fraud_risk_detected_checkout", {
        ip: clientIp,
        email: parsed.email.substring(0, 5) + "***",
        ipVelocity: fraudSignals.ipVelocity,
        emailVelocity: fraudSignals.emailVelocity,
      });

      return NextResponse.json(
        { error: "This action was blocked due to suspicious activity. Please contact support." },
        { status: 403 }
      );
    }

    // Fetch products and compute totals server-side (do not trust client totals)
    const productIds = parsed.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
    });

    const productMap = new Map<string, typeof products[number]>(
      products.map((p: typeof products[number]) => [p.id, p])
    );

    let subtotal = 0;
    const orderItems = parsed.items.map((i) => {
      const p = productMap.get(i.productId);
      if (!p) throw new Error(`Invalid product: ${i.productId}`);
      if (p.inventory_qty <= 0) throw new Error(`Sold out: ${p.title}`);

      const qty = i.quantity;
      const lineTotal = p.price_kobo * qty;
      subtotal += lineTotal;

      return {
        product_id: p.id,
        title_snapshot: p.title,
        unit_price_kobo: p.price_kobo,
        quantity: qty,
        variant_json: i.variant ? (i.variant as any) : null,
        line_total_kobo: lineTotal,
        product: {
          connect: { id: p.id },
        },
      };
    });

    // Shipping logic: start simple
    const shipping = 0;
    const total = subtotal + shipping;

    if (total < 0 || total > 10000000) {
      // Prevent extreme values (max ~NGN 10M)
      throw new Error("Invalid total amount");
    }

    const reference = `DU_${nanoid(18)}`;

    const created = await prisma.order.create({
      data: {
        order_number: orderNumber(),
        status: "PENDING",
        currency: "NGN",
        subtotal_kobo: subtotal,
        shipping_kobo: shipping,
        total_kobo: total,
        customer_email: parsed.email.toLowerCase(),
        customer_phone: parsed.phone ?? null,
        shipping_address_json: parsed.shippingAddress,
        paystack_reference: reference,
        items: {
          create: orderItems,
        },
        payment_events: {
          create: {
            reference,
            event_type: "INITIALIZED_ORDER",
            payload_json: { source: "checkout/create-order", ip: clientIp },
          },
        },
      },
    });

    logSecurityEvent("order_created", {
      orderId: created.id,
      total: total,
      itemCount: orderItems.length,
      ip: clientIp,
    });

    return NextResponse.json({ orderId: created.id });
  } catch (err: any) {
    logSecurityEvent("checkout_error", {
      error: err?.message,
      ip: clientIp,
    });

    return NextResponse.json(
      safeErrorResponse(err),
      { status: 400 }
    );
  }
}
