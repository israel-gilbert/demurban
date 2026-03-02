import { Suspense } from "react";
import { motion } from "framer-motion";
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
import { pageVariants, sectionVariants, itemVariants } from "@/lib/motion";

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
    <motion.div variants={sectionVariants} initial="hidden" animate="visible">
      <div className="mb-8 flex items-center justify-between">
        <motion.p variants={itemVariants} className="text-sm font-medium uppercase tracking-wider text-accent">
          {products.length} product{products.length !== 1 ? "s" : ""} available
        </motion.p>
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <motion.div variants={itemVariants} className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-lg font-semibold text-foreground">No products found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your filters or search query.
          </p>
        </motion.div>
      )}
    </motion.div>
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
    <motion.div
      className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Header */}
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="mb-12">
        <motion.div variants={itemVariants}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3">
            Premium Collection
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-[var(--font-oswald)] uppercase mb-3">
            DEM Shop
          </h1>
        </motion.div>
        <motion.p variants={itemVariants} className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          Explore our curated collection of premium streetwear. Where style meets substance—bold pieces designed without compromise.
        </motion.p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Filters */}
        <motion.aside 
          className="lg:sticky lg:top-24 lg:self-start"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Suspense fallback={<FiltersSkeleton />}>
            <FiltersSection />
          </Suspense>
        </motion.aside>

        {/* Products Grid */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Suspense fallback={<ProductGridSkeleton />}>
            <ShopContent filters={filters} />
          </Suspense>
        </motion.main>
      </div>
    </motion.div>
  );
}
