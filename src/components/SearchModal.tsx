"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import { searchProducts } from "@/lib/server-actions";
import { formatNGNFromKobo } from "@/lib/money";
import type { Product } from "@/lib/types";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
      setSearched(false);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const search = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    try {
      const data = await searchProducts(searchQuery.trim());
      setResults(data);
      setSearched(true);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleProductClick = (slug: string) => {
    onClose();
    router.push(`/shop/${slug}`);
  };

  const handleViewAll = () => {
    onClose();
    router.push(`/shop?q=${encodeURIComponent(query)}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 md:pt-32">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4 rounded-3xl border border-black/5 dark:border-white/10 bg-neutral-100 dark:bg-neutral-900 shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/10 p-4">
          <Search className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-lg text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none"
          />
          {loading && <Loader2 className="h-5 w-5 animate-spin text-neutral-500 dark:text-neutral-400" />}
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-600 dark:text-neutral-300 hover:bg-white/70 dark:hover:bg-neutral-950/40 transition"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {!searched && query.length < 2 && (
            <div className="py-8 text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Start typing to search products...
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {["tees", "hoodies", "jackets", "new"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-950/40 px-3 py-1.5 text-xs font-medium tracking-wide text-neutral-700 dark:text-neutral-200 hover:opacity-90 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {searched && results.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                No products found for &quot;{query}&quot;
              </p>
            </div>
          )}

          {results.length > 0 && (
            <>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </p>
                <button
                  type="button"
                  onClick={handleViewAll}
                  className="text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-50 transition"
                >
                  View all in shop
                </button>
              </div>

              <div className="grid gap-2">
                {results.slice(0, 6).map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleProductClick(product.slug)}
                    className="flex items-center gap-4 rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-neutral-950/30 p-3 text-left transition hover:opacity-95"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-800">
                      <Image
                        src={product.images?.[0] ?? "/images/placeholder.jpg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                        {product.collection === "ARCHIVE" ? "Archive" : "Latest Drop"}
                      </p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                        {product.title}
                      </p>
                      <p className="mt-1 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        {formatNGNFromKobo(product.price_kobo)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}