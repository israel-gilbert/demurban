"use server";

import { prisma, getSql } from "@/lib/db";
import type { Product, ProductCollection } from "@/lib/types";
import { Prisma } from "@prisma/client";

export type SortOption = "newest" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

export interface FilterOptions {
  collection?: ProductCollection;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  query?: string;
}

/**
 * Fetch products and safely include variants to resolve size options
 */
export async function fetchProducts(opts?: { limit?: number }): Promise<Product[]> {
  const limit = opts?.limit ?? 12;
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { variants: true }, // Added variants relation
    orderBy: { created_at: "desc" },
    take: limit,
  });
  return products as unknown as Product[];
}

/**
 * Fetch filtered products with dynamic criteria
 */
export async function fetchProductsWithFilters(filters: FilterOptions): Promise<Product[]> {
  const { collection, tag, minPrice, maxPrice, sort = "newest", query } = filters;

  const where: Prisma.ProductWhereInput = { active: true };

  if (collection) {
    where.collection = collection;
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
    include: { variants: true }, // Ensure variants carry over for filters
    orderBy,
  });

  return products as unknown as Product[];
}

/**
 * Search products via direct SQL matches
 */
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

/**
 * Fetch products by specific collection or fallback tags
 */
export async function fetchProductsByCollection(collection: string): Promise<Product[]> {
  const where: Record<string, unknown> = { active: true };
  const key = (collection ?? "all").toLowerCase();

  if (key === "latest" || key === "latest-drop" || key === "drop") {
    where.collection = "LATEST_DROP";
  } else if (key === "archive" || key === "archived") {
    where.collection = "ARCHIVE";
  } else if (key !== "all") {
    where.tags = { has: key };
  }

  const products = await prisma.product.findMany({
    where,
    include: { variants: true }, // Ensures page collections have size/quantity access
    orderBy: { created_at: "desc" },
  });

  return products as unknown as Product[];
}

/**
 * Safe, case-insensitive fetch product by slug
 */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findFirst({
    where: {
      slug: {
        equals: slug,
        mode: "insensitive", // Prevents case-mismatches in URL paths from causing 404s
      },
      active: true,
    },
    include: {
      variants: {
        where: { active: true },
      },
    },
  });
  return (product as unknown as Product) ?? null;
}

/**
 * Extract active filter tags
 */
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

/**
 * Determine dynamic price ranges for UI sliders
 */
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