import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const appUrl = process.env.APP_URL;

  if (!secretKey || !appUrl) {
    return NextResponse.redirect(new URL("/order/failed", appUrl));
  }

  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  if (!reference) return NextResponse.redirect(new URL("/order/failed", appUrl));

  const order = await prisma.order.findUnique({ where: { paystack_reference: reference } });
  if (!order) return NextResponse.redirect(new URL("/order/failed", appUrl));

  // Verify transaction
  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });

  const json = await res.json();

  await prisma.paymentEvent.create({
    data: {
      order_id: order.id,
      reference,
      event_type: "PAYSTACK_VERIFY_CALLBACK",
      payload_json: json,
    },
  });

  const ok = res.ok && json?.status === true && json?.data?.status === "success";
  const amountOk = Number(json?.data?.amount) === order.total_kobo;
  const currencyOk = (json?.data?.currency ?? "NGN") === order.currency;

  if (ok && amountOk && currencyOk) {
    if (order.status !== "PAID") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          paystack_transaction_id: String(json.data.id ?? ""),
          paid_at: new Date(),
        },
      });
    }

    return NextResponse.redirect(new URL("/order/success", appUrl));
  }

  // Mark failed only if still pending
  if (order.status === "PENDING") {
    await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
  }

  return NextResponse.redirect(new URL("/order/failed", appUrl));
}
