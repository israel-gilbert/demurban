import { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import ShopFilters from "@/components/ShopFilters";
import ShopLayout from "@/components/ShopLayout";
import ShopHeader from "@/components/ShopHeader";
import {
  fetchProductsWithFilters,
  getAvailableTags,
  getPriceRange,
  type FilterOptions,
  type SortOption,
} from "@/lib/server-actions";
import type { ProductCollection } from "@/lib/types";

export const revalidate = 3600;

interface ShopPageProps {
  searchParams: Promise<{
    collection?: string;
    tag?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    q?: string;
  }>;
}

function FiltersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-24 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-20 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        ))}
      </div>
      <div className="h-8 w-20 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-16 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border border-black/5 dark:border-white/10 bg-neutral-100 dark:bg-neutral-900 h-96 animate-pulse"
        />
      ))}
    </div>
  );
}

async function FiltersSection() {
  const [availableTags, priceRange] = await Promise.all([
    getAvailableTags(),
    getPriceRange(),
  ]);

  return <ShopFilters availableTags={availableTags} priceRange={priceRange} />;
}

async function ShopContent({ filters }: { filters: FilterOptions }) {
  const products = await fetchProductsWithFilters(filters);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
          {products.length} product{products.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-neutral-100 dark:bg-neutral-900 p-16 text-center">
          <p className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            No products found
          </p>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}
    </div>
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const filters: FilterOptions = {
    collection:
      params.collection === "archive"
        ? "ARCHIVE"
        : params.collection === "latest"
        ? "LATEST_DROP"
        : undefined,
    tag: params.tag,
    sort: (params.sort as SortOption) || "newest",
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    query: params.q,
  };

  return (
    <ShopLayout
      header={<ShopHeader />}
      filters={
        <Suspense fallback={<FiltersSkeleton />}>
          <FiltersSection />
        </Suspense>
      }
      content={
        <Suspense fallback={<ProductGridSkeleton />}>
          <ShopContent filters={filters} />
        </Suspense>
      }
    />
  );
}