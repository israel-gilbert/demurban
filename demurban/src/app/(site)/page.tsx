import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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

  const featured = products.slice(0, 4);
  const newArrivals = products.filter((p) => p.tags?.includes("new")).slice(0, 4);

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 h-96 w-96 rounded-full bg-accent/20 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center">
          <Image
            src="/images/logo.png"
            alt="DEM Urban Logo"
            width={120}
            height={120}
            className="mx-auto mb-8 drop-shadow-lg"
            priority
          />
          <h1 className="text-balance font-[var(--font-oswald)] text-5xl font-bold uppercase tracking-wider text-white md:text-6xl lg:text-7xl">
            Where Taste Meets Identity
          </h1>
          <p className="mt-6 text-balance font-mono text-lg uppercase tracking-widest text-muted-foreground md:text-xl">
            Home of the DEM Lifestyle
          </p>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 font-bold uppercase tracking-wider text-background transition-all hover:shadow-lg hover:shadow-accent/50"
            >
              Shop Now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border-2 border-accent px-8 py-4 font-bold uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-background"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Men", href: "/shop?category=MEN", desc: "Bold pieces for the modern man" },
            { label: "Women", href: "/shop?category=WOMEN", desc: "Fierce styles that empower" },
            { label: "Kids", href: "/shop?category=KIDS", desc: "Start them young in DEM" },
          ].map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-8 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Shop</p>
              <h3 className="mt-2 text-2xl font-bold uppercase tracking-wider font-[var(--font-oswald)]">
                {cat.label}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{cat.desc}</p>
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-accent">
                Explore
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
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
