import { prisma } from "@/lib/db";

export const SHIPPING_FEE_KEY = "shipping_fee_kobo";

/** Read the admin-configured flat shipping fee (kobo). Defaults to 0 (free). */
export async function getShippingFeeKobo(): Promise<number> {
  try {
    const setting = await prisma.storeSetting.findUnique({
      where: { key: SHIPPING_FEE_KEY },
    });
    const parsed = setting ? parseInt(setting.value, 10) : 0;
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

export async function setShippingFeeKobo(value: number): Promise<void> {
  await prisma.storeSetting.upsert({
    where: { key: SHIPPING_FEE_KEY },
    update: { value: String(value) },
    create: { key: SHIPPING_FEE_KEY, value: String(value) },
  });
}
