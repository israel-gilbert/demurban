import { NextResponse } from "next/server";
import { getShippingFeeKobo } from "@/lib/settings";

// Public: lets the cart/checkout show the current shipping fee.
// The authoritative fee is still applied server-side in create-order.
export async function GET() {
  const shipping_fee_kobo = await getShippingFeeKobo();
  return NextResponse.json({ shipping_fee_kobo });
}
