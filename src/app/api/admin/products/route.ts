import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

const ProductInput = z.object({
  title: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase and hyphen-separated"),
  description: z.string().max(2000).optional().nullable(),
  collection: z.enum(["LATEST_DROP","ARCHIVE"]).default("LATEST_DROP"),
  price_kobo: z.number().int().positive(),
  compare_at_kobo: z.number().int().positive().optional().nullable(),
  inventory_qty: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
  tags: z.array(z.string().min(1).max(30)).optional(),
  images: z.array(z.string().url()).min(1),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await prisma.product.findMany({
    orderBy: { updated_at: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = ProductInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;

  const product = await prisma.product.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description ?? undefined,
      collection: data.collection,
      price_kobo: data.price_kobo,
      compare_at_kobo: data.compare_at_kobo ?? undefined,
      inventory_qty: data.inventory_qty ?? 0,
      active: data.active ?? true,
      tags: data.tags ?? [],
      images: data.images,
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
