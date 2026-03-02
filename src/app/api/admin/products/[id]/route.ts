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
  collection: z.enum(["LATEST_DROP","ARCHIVE"]).optional(),
  price_kobo: z.number().int().positive().optional(),
  compare_at_kobo: z.number().int().positive().optional().nullable(),
  inventory_qty: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
  tags: z.array(z.string().min(1).max(30)).optional(),
  images: z.array(z.string().url()).min(1).optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = UpdateInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...("title" in data ? { title: data.title } : {}),
      ...("slug" in data ? { slug: data.slug } : {}),
      ...("description" in data ? { description: data.description ?? undefined } : {}),
      ...("collection" in data ? { collection: data.collection } : {}),
      ...("price_kobo" in data ? { price_kobo: data.price_kobo } : {}),
      ...("compare_at_kobo" in data ? { compare_at_kobo: data.compare_at_kobo ?? undefined } : {}),
      ...("inventory_qty" in data ? { inventory_qty: data.inventory_qty } : {}),
      ...("active" in data ? { active: data.active } : {}),
      ...("tags" in data ? { tags: data.tags ?? [] } : {}),
      ...("images" in data ? { images: data.images } : {}),
    },
  });

  return NextResponse.json({ product });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
