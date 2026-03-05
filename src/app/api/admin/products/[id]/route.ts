import { NextRequest, NextResponse } from "next/server";
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

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const data = UpdateInput.parse(body);

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json({ product });
  } catch (err: any) {
    const message =
      err?.name === "ZodError"
        ? err.errors?.[0]?.message ?? "Invalid input"
        : err?.message ?? "Something went wrong";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}