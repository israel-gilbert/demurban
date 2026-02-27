import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const Schema = z.object({
  orderId: z.string().min(1),
});

export async function POST(req: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const appUrl = process.env.APP_URL;

  if (!secretKey) return NextResponse.json({ error: "Missing PAYSTACK_SECRET_KEY" }, { status: 500 });
  if (!appUrl) return NextResponse.json({ error: "Missing APP_URL" }, { status: 500 });

  try {
    const body = await req.json();
    const { orderId } = Schema.parse(body);

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.status !== "PENDING") {
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
          payload_json: json,
        },
      });
      return NextResponse.json({ error: json?.message ?? "Paystack init failed" }, { status: 400 });
    }

    await prisma.paymentEvent.create({
      data: {
        order_id: order.id,
        reference: order.paystack_reference,
        event_type: "PAYSTACK_INIT_OK",
        payload_json: json,
      },
    });

    return NextResponse.json({ authorizationUrl: json.data.authorization_url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Failed to initialize payment" }, { status: 400 });
  }
}
