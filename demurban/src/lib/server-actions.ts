"use server";

import { prisma, getSql } from "@/lib/db";
import type { Product, ProductCategory } from "@/lib/types";
import { Prisma } from "@prisma/client";

export type SortOption = "newest" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

export interface FilterOptions {
  category?: ProductCategory;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  query?: string;
}

export async function fetchProducts(opts?: { limit?: number }): Promise<Product[]> {
  const limit = opts?.limit ?? 12;
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { created_at: "desc" },
    take: limit,
  });
  return products as unknown as Product[];
}

export async function fetchProductsWithFilters(filters: FilterOptions): Promise<Product[]> {
  const { category, tag, minPrice, maxPrice, sort = "newest", query } = filters;

  // Build Prisma where clause
  const where: Prisma.ProductWhereInput = { active: true };

  if (category) {
    where.category = category;
  }

  if (tag) {
    where.tags = { has: tag };
  }

  if (minPrice !== undefined) {
    where.price_kobo = { ...where.price_kobo as object, gte: minPrice };
  }

  if (maxPrice !== undefined) {
    where.price_kobo = { ...where.price_kobo as object, lte: maxPrice };
  }

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { tags: { hasSome: [query.toLowerCase()] } },
    ];
  }

  // Build orderBy
  let orderBy: Prisma.ProductOrderByWithRelationInput = { created_at: "desc" };
  switch (sort) {
    case "price-asc":
      orderBy = { price_kobo: "asc" };
      break;
    case "price-desc":
      orderBy = { price_kobo: "desc" };
      break;
    case "name-asc":
      orderBy = { title: "asc" };
      break;
    case "name-desc":
      orderBy = { title: "desc" };
      break;
    default:
      orderBy = { created_at: "desc" };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
  });

  return products as unknown as Product[];
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = `%${query.toLowerCase()}%`;
  const sql = getSql();
  
  const products = await sql`
    SELECT * FROM "Product"
    WHERE active = true
    AND (
      LOWER(title) LIKE ${searchTerm}
      OR LOWER(description) LIKE ${searchTerm}
      OR EXISTS (SELECT 1 FROM unnest(tags) AS t WHERE LOWER(t) LIKE ${searchTerm})
    )
    ORDER BY 
      CASE WHEN LOWER(title) LIKE ${searchTerm} THEN 0 ELSE 1 END,
      created_at DESC
    LIMIT 20
  `;

  return products as unknown as Product[];
}

export async function fetchProductsByCollection(collection: string): Promise<Product[]> {
  const where: Record<string, unknown> = { active: true };
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

export async function getAvailableTags(): Promise<string[]> {
  const sql = getSql();
  const result = await sql`
    SELECT DISTINCT unnest(tags) as tag
    FROM "Product"
    WHERE active = true
    ORDER BY tag
  `;
  return (result as { tag: string }[]).map((r) => r.tag);
}

export async function getPriceRange(): Promise<{ min: number; max: number }> {
  const sql = getSql();
  const result = await sql`
    SELECT MIN(price_kobo) as min, MAX(price_kobo) as max
    FROM "Product"
    WHERE active = true
  `;
  const row = (result as { min: number | null; max: number | null }[])?.[0];
  return {
    min: row?.min ?? 0,
    max: row?.max ?? 10000000,
  };
}
