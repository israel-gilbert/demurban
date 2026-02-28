"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import type { SortOption } from "@/lib/server-actions";
import type { ProductCategory } from "@/lib/types";
import { formatMoney } from "@/lib/format";

interface ShopFiltersProps {
  availableTags: string[];
  priceRange: { min: number; max: number };
}

const CATEGORIES: { label: string; value: ProductCategory | "ALL" }[] = [
  { label: "All", value: "ALL" },
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A-Z", value: "name-asc" },
  { label: "Name: Z-A", value: "name-desc" },
];

export default function ShopFilters({ availableTags, priceRange }: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Get current filter values from URL
  const currentCategory = (searchParams.get("category") as ProductCategory | "ALL") || "ALL";
  const currentTag = searchParams.get("tag") || "";
  const currentSort = (searchParams.get("sort") as SortOption) || "newest";
  const currentMinPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : priceRange.min;
  const currentMaxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : priceRange.max;
  const currentQuery = searchParams.get("q") || "";

  const updateFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "ALL" || value === "newest") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Remove default price range values
      if (params.get("minPrice") === String(priceRange.min)) {
        params.delete("minPrice");
      }
      if (params.get("maxPrice") === String(priceRange.max)) {
        params.delete("maxPrice");
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams, priceRange]
  );

  const clearAllFilters = useCallback(() => {
    startTransition(() => {
      router.push(pathname);
    });
  }, [router, pathname]);

  const hasActiveFilters =
    currentCategory !== "ALL" ||
    currentTag !== "" ||
    currentSort !== "newest" ||
    currentMinPrice !== priceRange.min ||
    currentMaxPrice !== priceRange.max ||
    currentQuery !== "";

  const FilterContent = () => (
    <div className="flex flex-col gap-6">
      {/* Category Filter */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => updateFilters({ category: cat.value })}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                currentCategory === cat.value
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:border-accent hover:text-accent"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      {availableTags.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateFilters({ tag: null })}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                currentTag === ""
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:border-accent hover:text-accent"
              }`}
            >
              All
            </button>
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => updateFilters({ tag })}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                  currentTag === tag
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Price Range
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="sr-only">Minimum price</label>
            <input
              type="number"
              value={currentMinPrice / 100}
              onChange={(e) =>
                updateFilters({ minPrice: String(Number(e.target.value) * 100) })
              }
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              placeholder="Min"
              min={priceRange.min / 100}
              max={priceRange.max / 100}
            />
          </div>
          <span className="text-muted-foreground">-</span>
          <div className="flex-1">
            <label className="sr-only">Maximum price</label>
            <input
              type="number"
              value={currentMaxPrice / 100}
              onChange={(e) =>
                updateFilters({ maxPrice: String(Number(e.target.value) * 100) })
              }
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              placeholder="Max"
              min={priceRange.min / 100}
              max={priceRange.max / 100}
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Range: {formatMoney(priceRange.min, "NGN")} - {formatMoney(priceRange.max, "NGN")}
        </p>
      </div>

      {/* Sort */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Sort By
        </p>
        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="w-full appearance-none rounded-lg border border-border bg-input px-3 py-2 pr-10 text-sm text-foreground focus:border-accent focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:border-accent hover:text-accent"
        >
          <X className="h-4 w-4" />
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">
              !
            </span>
          )}
        </button>
        
        {/* Mobile Sort */}
        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="appearance-none rounded-lg border border-border bg-input px-3 py-2 pr-8 text-sm text-foreground focus:border-accent focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl border-t border-border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterContent />
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        {isPending && (
          <div className="mb-4 rounded-lg border border-accent/20 bg-accent/10 px-4 py-2 text-sm text-accent">
            Updating...
          </div>
        )}
        <FilterContent />
      </div>

      {/* Search Query Display */}
      {currentQuery && (
        <div className="mt-4 lg:mt-0">
          <div className="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/10 px-4 py-2">
            <span className="text-sm text-foreground">
              Searching for: <strong>&quot;{currentQuery}&quot;</strong>
            </span>
            <button
              type="button"
              onClick={() => updateFilters({ q: null })}
              className="ml-auto rounded-lg p-1 text-accent hover:bg-accent/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
