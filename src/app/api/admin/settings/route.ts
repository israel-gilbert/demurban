import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { getShippingFeeKobo, setShippingFeeKobo } from "@/lib/settings";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const shipping_fee_kobo = await getShippingFeeKobo();
  return NextResponse.json({ shipping_fee_kobo });
}

const Schema = z.object({
  shipping_fee_kobo: z.number().int().min(0).max(100000000),
});

export async function PUT(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { shipping_fee_kobo } = Schema.parse(body);
    await setShippingFeeKobo(shipping_fee_kobo);
    return NextResponse.json({ shipping_fee_kobo });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 400 }
    );
  }
}
