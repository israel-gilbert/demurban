import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
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
      variants,
    } = body;

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(collection !== undefined && { collection }),
        ...(price_kobo !== undefined && { price_kobo: Number(price_kobo) }),
        ...(compare_at_kobo !== undefined && {
          compare_at_kobo: compare_at_kobo ? Number(compare_at_kobo) : null,
        }),
        ...(currency !== undefined && { currency }),
        ...(inventory_qty !== undefined && {
          inventory_qty: Number(inventory_qty),
        }),
        ...(active !== undefined && { active }),
        ...(tags !== undefined && { tags }),
        ...(images !== undefined && { images }),
      },
    });

    // Update variants if provided
    if (variants && Array.isArray(variants)) {
      // Delete existing variants
      await prisma.productVariant.deleteMany({
        where: { product_id: id },
      });

      // Create new variants
      if (variants.length > 0) {
        await prisma.productVariant.createMany({
          data: variants.map((v: any) => ({
            product_id: id,
            size: v.size,
            inventory_qty: Number(v.inventory_qty) || 0,
            price_kobo: v.price_kobo ? Number(v.price_kobo) : null,
            active: v.active !== undefined ? v.active : true,
          })),
        });
      }
    }

    // Return updated product with variants
    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}