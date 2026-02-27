import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

const CreateOrderSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
        variant: z.record(z.unknown()).optional(),
      })
    )
    .min(1),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    address1: z.string().min(3),
    address2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    country: z.string().min(2),
    postalCode: z.string().optional(),
  }),
});

function orderNumber() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `DU-${y}${m}${day}-${nanoid(6).toUpperCase()}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateOrderSchema.parse(body);

    // Fetch products and compute totals server-side (do not trust client totals).
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
        variant_json: i.variant ?? undefined,
        line_total_kobo: lineTotal,
      };
    });

    // Shipping logic: start simple. You can replace with zone-based rates later.
    const shipping = 0;
    const total = subtotal + shipping;

    const reference = `DU_${nanoid(18)}`;

    const created = await prisma.order.create({
      data: {
        order_number: orderNumber(),
        status: "PENDING",
        currency: "NGN",
        subtotal_kobo: subtotal,
        shipping_kobo: shipping,
        total_kobo: total,
        customer_email: parsed.email,
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
            payload_json: { source: "checkout/create-order" },
          },
        },
      },
    });

    return NextResponse.json({ orderId: created.id });
  } catch (err: any) {
    const message = err?.message ?? "Failed to create order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
