import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) return NextResponse.json({ ok: false }, { status: 500 });

  // Paystack signs the raw request body with HMAC SHA512
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature") ?? "";

  const hash = crypto.createHmac("sha512", secretKey).update(body).digest("hex");
  if (!signature || hash !== signature) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const event = JSON.parse(body);
  const eventType = event?.event;
  const data = event?.data;
  const reference: string | undefined = data?.reference;

  if (!reference) return NextResponse.json({ ok: true });

  const order = await prisma.order.findUnique({ where: { paystack_reference: reference } });
  if (!order) return NextResponse.json({ ok: true });

  await prisma.paymentEvent.create({
    data: {
      order_id: order.id,
      reference,
      event_type: `PAYSTACK_WEBHOOK_${String(eventType ?? "UNKNOWN")}`,
      payload_json: event,
    },
  });

  // Handle successful payment events
  const success = eventType === "charge.success" || eventType === "transaction.success";
  const amountOk = Number(data?.amount) === order.total_kobo;
  const currencyOk = (data?.currency ?? "NGN") === order.currency;

  if (success && amountOk && currencyOk) {
    if (order.status !== "PAID") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          paystack_transaction_id: String(data?.id ?? ""),
          paid_at: new Date(),
        },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
