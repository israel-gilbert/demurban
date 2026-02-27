import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const collection = searchParams.get("collection") ?? "all";

  const where: any = { active: true };
  if (collection !== "all") {
    const map: Record<string, string> = { men: "MEN", women: "WOMEN", kids: "KIDS" };
    if (map[collection]) where.category = map[collection];
    else where.tags = { has: collection };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json(
    { products },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
