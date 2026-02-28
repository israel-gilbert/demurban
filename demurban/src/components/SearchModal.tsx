"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import { searchProducts } from "@/lib/server-actions";
import { formatMoney } from "@/lib/format";
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

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
      setSearched(false);
    }
  }, [open]);

  // Handle escape key
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

  // Debounced search
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
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4 rounded-xl border border-border bg-card shadow-2xl">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-border p-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {!searched && query.length < 2 && (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Start typing to search products...
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {["tees", "hoodies", "jackets", "new"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:border-accent hover:text-accent"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {searched && results.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No products found for &quot;{query}&quot;
              </p>
            </div>
          )}

          {results.length > 0 && (
            <>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </p>
                <button
                  type="button"
                  onClick={handleViewAll}
                  className="text-xs font-medium text-accent hover:underline"
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
                    className="flex items-center gap-4 rounded-lg border border-border p-3 text-left transition-colors hover:border-accent/50 hover:bg-muted"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={product.images?.[0] ?? "/images/placeholder.jpg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-accent">
                        {product.category}
                      </p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-card-foreground">
                        {product.title}
                      </p>
                      <p className="mt-1 text-sm font-medium text-muted-foreground">
                        {formatMoney(product.price_kobo, product.currency)}
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
