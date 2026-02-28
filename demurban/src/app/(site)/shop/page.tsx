import { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import ShopFilters from "@/components/ShopFilters";
import {
  fetchProductsWithFilters,
  getAvailableTags,
  getPriceRange,
  type FilterOptions,
  type SortOption,
} from "@/lib/server-actions";
import type { ProductCategory } from "@/lib/types";

export const revalidate = 3600;

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
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
      <div className="h-8 w-24 rounded bg-muted animate-pulse" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-20 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
      <div className="h-8 w-20 rounded bg-muted animate-pulse" />
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-16 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card h-96 animate-pulse"
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
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {products.length} product{products.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-lg font-semibold text-foreground">No products found</p>
          <p className="mt-2 text-sm text-muted-foreground">
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
    category: params.category as ProductCategory | undefined,
    tag: params.tag,
    sort: (params.sort as SortOption) || "newest",
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    query: params.q,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-[var(--font-oswald)] uppercase">
          Shop
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Unisex streetwear for everyone. Bold pieces designed without limits.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Filters */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Suspense fallback={<FiltersSkeleton />}>
            <FiltersSection />
          </Suspense>
        </aside>

        {/* Products Grid */}
        <main>
          <Suspense fallback={<ProductGridSkeleton />}>
            <ShopContent filters={filters} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
