"use server";

import { prisma, sql } from "@/lib/db";
import type { Product, ProductCategory } from "@/lib/types";

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

  // Build WHERE clauses
  const conditions: string[] = ['active = true'];
  const params: (string | number)[] = [];
  let paramIndex = 1;

  if (category) {
    conditions.push(`category = $${paramIndex}`);
    params.push(category);
    paramIndex++;
  }

  if (tag) {
    conditions.push(`$${paramIndex} = ANY(tags)`);
    params.push(tag);
    paramIndex++;
  }

  if (minPrice !== undefined) {
    conditions.push(`price_kobo >= $${paramIndex}`);
    params.push(minPrice);
    paramIndex++;
  }

  if (maxPrice !== undefined) {
    conditions.push(`price_kobo <= $${paramIndex}`);
    params.push(maxPrice);
    paramIndex++;
  }

  if (query) {
    conditions.push(`(
      LOWER(title) LIKE $${paramIndex} 
      OR LOWER(description) LIKE $${paramIndex}
      OR EXISTS (SELECT 1 FROM unnest(tags) AS t WHERE LOWER(t) LIKE $${paramIndex})
    )`);
    params.push(`%${query.toLowerCase()}%`);
    paramIndex++;
  }

  // Build ORDER BY
  let orderBy = 'created_at DESC';
  switch (sort) {
    case 'price-asc':
      orderBy = 'price_kobo ASC';
      break;
    case 'price-desc':
      orderBy = 'price_kobo DESC';
      break;
    case 'name-asc':
      orderBy = 'title ASC';
      break;
    case 'name-desc':
      orderBy = 'title DESC';
      break;
    default:
      orderBy = 'created_at DESC';
  }

  const whereClause = conditions.join(' AND ');
  const queryString = `
    SELECT * FROM "Product"
    WHERE ${whereClause}
    ORDER BY ${orderBy}
  `;

  const products = await sql(queryString, params);
  return products as unknown as Product[];
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = `%${query.toLowerCase()}%`;
  
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
  const result = await sql`
    SELECT DISTINCT unnest(tags) as tag
    FROM "Product"
    WHERE active = true
    ORDER BY tag
  `;
  return result.map((r: { tag: string }) => r.tag);
}

export async function getPriceRange(): Promise<{ min: number; max: number }> {
  const result = await sql`
    SELECT MIN(price_kobo) as min, MAX(price_kobo) as max
    FROM "Product"
    WHERE active = true
  `;
  return {
    min: result[0]?.min ?? 0,
    max: result[0]?.max ?? 10000000,
  };
}
