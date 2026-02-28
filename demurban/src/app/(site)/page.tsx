import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import { fetchProducts } from "@/lib/server-actions";
import type { Product } from "@/lib/types";

export const revalidate = 3600;

export default async function HomePage() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    products = await fetchProducts({ limit: 12 });
  } catch (err) {
    console.error("[v0] Failed to fetch products:", err);
    error = "Unable to load products at the moment";
  }

  const featured = products.slice(0, 8);
  const newArrivals = products.filter((p) => p.tags?.includes("new")).slice(0, 4);
  const heroProducts = products.slice(0, 7);

  return (
    <div className="space-y-0">
      {/* Hero Section - Full Width with Image Background */}
      <section className="relative flex h-[600px] md:h-[700px] lg:h-[800px] flex-col items-center justify-center overflow-hidden bg-black">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/placeholder.jpg"
            alt="DEM Urban Hero"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"></div>
        </div>

        {/* Hero Content - Centered Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-2xl">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <span className="inline-block rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white border border-white/30">
              Bold
            </span>
            <span className="inline-block rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white border border-white/30">
              Unapologetic
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 font-[var(--font-oswald)] uppercase tracking-tight">
            Where Taste Meets Identity
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-white/90 mb-8 leading-relaxed max-w-xl">
            Discover unisex streetwear designed for those who refuse to blend in. Premium pieces that celebrate culture, creativity, and self-expression.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-white text-black font-bold text-sm hover:bg-white/90 transition-all"
            >
              Shop All Items
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-transparent border-2 border-white text-white font-bold text-sm hover:bg-white/10 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Product Carousel Strip - Bottom of Hero */}
        {heroProducts.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-6">
            <div className="flex gap-2 px-4 overflow-x-auto justify-center pb-4 md:pb-0">
              {heroProducts.map((product, idx) => (
                <Link
                  key={`${product.id}-${idx}`}
                  href={`/shop/${product.slug}`}
                  className="group relative shrink-0 h-20 w-20 md:h-24 md:w-24 rounded-lg overflow-hidden border-2 border-transparent hover:border-accent transition-all"
                >
                  <img
                    src={product.images?.[0] ?? "/images/placeholder.jpg"}
                    alt={product.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Curated Selection</p>
            <h2 className="mt-2 text-2xl font-bold uppercase tracking-wider font-[var(--font-oswald)]">
              Featured Pieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        {error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : featured.length > 0 ? (
          <ProductGrid products={featured} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available</p>
          </div>
        )}
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Latest Drop</p>
              <h2 className="mt-2 text-2xl font-bold uppercase tracking-wider font-[var(--font-oswald)]">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/shop?tag=new"
              className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent"
            >
              View all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <ProductGrid products={newArrivals} />
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:px-8">
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Stay Connected</p>
              <h3 className="mt-2 text-2xl font-bold uppercase tracking-wider font-[var(--font-oswald)]">
                Join the Movement
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Be the first to know about new drops and exclusive offers.
              </p>
            </div>
            <form className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-12 w-full rounded-lg border border-border bg-input px-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                required
              />
              <button
                type="submit"
                className="h-12 shrink-0 rounded-lg bg-accent px-6 text-sm font-bold uppercase text-background hover:bg-accent/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
