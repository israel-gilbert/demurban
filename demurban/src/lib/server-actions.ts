"use server";

import { prisma } from "@/lib/db";
import type { Product, ProductCategory } from "@/lib/types";

export async function fetchProducts(opts?: { limit?: number }): Promise<Product[]> {
  const limit = opts?.limit ?? 12;
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { created_at: "desc" },
    take: limit,
  });
  return products as unknown as Product[];
}

export async function fetchProductsByCollection(collection: string): Promise<Product[]> {
  const where: any = { active: true };
  const key = (collection ?? "all").toLowerCase();

  if (key !== "all") {
    const map: Record<string, ProductCategory> = {
      men: "MEN",
      women: "WOMEN",
      kids: "KIDS",
    };

    if (map[key]) {
      where.category = map[key];
    } else {
      // Treat as tag match (e.g., "new", "best-seller", "limited").
      where.tags = { has: key };
    }
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { created_at: "desc" },
  });

  return products as unknown as Product[];
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findFirst({
    where: { slug, active: true },
  });
  return (product as unknown as Product) ?? null;
}
