import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      slug,
      description,
      collection,
      price_kobo,
      compare_at_kobo,
      currency,
      inventory_qty,
      active,
      tags,
      images,
    } = body;

    if (!title || !slug || price_kobo === undefined) {
      return NextResponse.json(
        { error: "Title, slug, and price are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        collection: collection || "LATEST_DROP",
        price_kobo: Number(price_kobo),
        compare_at_kobo: compare_at_kobo ? Number(compare_at_kobo) : null,
        currency: currency || "NGN",
        inventory_qty: Number(inventory_qty) || 0,
        active: active !== undefined ? active : true,
        tags: tags || [],
        images: images || [],
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}