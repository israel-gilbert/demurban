import { prisma } from "./db"; 
import { ProductCollection } from "@prisma/client";

export type CreateProductInput = {
  title: string;
  slug: string;
  description?: string;
  collection: ProductCollection;
  price_kobo: number;
  compare_at_kobo?: number;
  currency?: string;
  inventory_qty?: number;
  active?: boolean;
  tags?: string[];
  images?: string[];
  variants?: {
    size: string;
    inventory_qty: number;
    price_kobo?: number;
    active?: boolean;
  }[];
};

/**
 * Fetch all active products grouped/filtered by collection
 */
export async function getActiveProducts(collection?: ProductCollection) {
  try {
    return await prisma.product.findMany({
      where: {
        active: true,
        ...(collection ? { collection } : {}),
      },
      include: {
        variants: {
          where: { active: true },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching active products:", error);
    throw new Error("Failed to retrieve products.");
  }
}

/**
 * Fetch a single product by its unique slug
 */
// In src/lib/products.ts
export async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({
    where: { 
      // Force the slug lookup to match how you save them
      slug: slug.toLowerCase() 
    },
    include: {
      variants: {
        where: { active: true },
      },
    },
  });
}

/**
 * Create a new product along with its variations atomically
 */
export async function createProduct(data: CreateProductInput) {
  try {
    return await prisma.product.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        collection: data.collection,
        price_kobo: data.price_kobo,
        compare_at_kobo: data.compare_at_kobo,
        currency: data.currency || "NGN",
        inventory_qty: data.inventory_qty || 0,
        active: data.active ?? true,
        tags: data.tags || [],
        images: data.images || [],
        variants: {
          create: data.variants?.map((v) => ({
            size: v.size,
            inventory_qty: v.inventory_qty,
            price_kobo: v.price_kobo,
            active: v.active ?? true,
          })) || [],
        },
      },
      include: {
        variants: true,
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product.");
  }
}

/**
 * Hard delete a product. 
 * Note: Our schema update handles cascading the deletion of child variants automatically,
 * and sets associated OrderItems' product_id/variant_id to null to safeguard purchase history.
 */
export async function deleteProduct(id: string) {
  try {
    return await prisma.product.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error hard deleting product (${id}):`, error);
    throw new Error("Failed to delete product database entry safely.");
  }
}