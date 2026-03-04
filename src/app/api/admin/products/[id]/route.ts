import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

const UpdateInput = z.object({
  title: z.string().min(2).max(120).optional(),
  slug: z
    .string()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase and hyphen-separated")
    .optional(),
  description: z.string().max(2000).optional().nullable(),
  collection: z.enum(["LATEST_DROP", "ARCHIVE"]).optional(),
  price_kobo: z.number().int().positive().optional(),
  compare_at_kobo: z.number().int().positive().optional().nullable(),
  inventory_qty: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
  tags: z.array(z.string().min(1).max(30)).optional(),
  images: z.array(z.string().url()).min(1).optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = UpdateInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Build update payload safely
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.description !== undefined) updateData.description = data.description ?? null;
  if (data.collection !== undefined) updateData.collection = data.collection;
  if (data.price_kobo !== undefined) updateData.price_kobo = data.price_kobo;
  if (data.compare_at_kobo !== undefined) updateData.compare_at_kobo = data.compare_at_kobo ?? null;
  if (data.inventory_qty !== undefined) updateData.inventory_qty = data.inventory_qty;
  if (data.active !== undefined) updateData.active = data.active;
  if (data.tags !== undefined) updateData.tags = data.tags ?? [];
  if (data.images !== undefined) updateData.images = data.images;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id: params.id },
    data: updateData,
  });

  return NextResponse.json({ product });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}