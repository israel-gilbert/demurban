import Link from "next/link";
import Image from "next/image";
import ProductGrid from "@/components/ProductGrid";
import { fetchProducts } from "@/lib/server-actions";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600;

export default async function HomePage() {
  let products = [];
  let error: string | null = null;
  
  try {
    products = await fetchProducts({ limit: 8 });
  } catch (err) {
    console.error("[v0] Failed to fetch products:", err);
    error = "Unable to load products";
  }
  
  const newArrivals = products.filter((p) => p.tags?.includes("new")).slice(0, 4);
  const featured = products.slice(0, 4);

  return (
    <div className="py-10 md:py-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="p-8 md:p-12 lg:p-16">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="DEMURBAN"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
                DEMURBAN
              </span>
            </div>
            
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl font-[var(--font-oswald)] uppercase">
              Where Taste
              <br />
              <span className="text-accent">Meets Identity</span>
            </h1>
            
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Home of the DEM Lifestyle. Premium urban streetwear for those who dare to stand out.
            </p>
            
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/shop"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 text-sm font-semibold uppercase tracking-wider text-accent-foreground hover:bg-accent/90"
              >
                Shop Collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-6 text-sm font-semibold uppercase tracking-wider text-foreground hover:bg-muted"
              >
                Our Story
              </Link>
            </div>
          </div>

          <div className="relative aspect-square md:aspect-auto md:h-full min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
            <Image
              src="/images/logo.png"
              alt="DEM Lifestyle"
              fill
              className="object-contain p-8 md:p-16"
              priority
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mt-16 md:mt-20">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Men", href: "/shop?category=MEN", description: "Bold pieces for the modern man" },
            { label: "Women", href: "/shop?category=WOMEN", description: "Fierce styles that empower" },
            { label: "Kids", href: "/shop?category=KIDS", description: "Start them young in DEM" },
          ].map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-8 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Shop
              </p>
              <h3 className="mt-2 text-2xl font-bold uppercase tracking-wider text-foreground font-[var(--font-oswald)]">
                {cat.label}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {cat.description}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-accent">
                Explore
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mt-16 md:mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Curated Selection
            </p>
            <h2 className="mt-2 text-2xl font-bold uppercase tracking-wider text-foreground font-[var(--font-oswald)]">
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
          <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
            <p className="mt-2 text-xs text-muted-foreground">Please check back shortly or contact support.</p>
          </div>
        ) : featured.length > 0 ? (
          <div className="mt-6">
            <ProductGrid products={featured} />
          </div>
        ) : null}
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="mt-16 md:mt-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Just Dropped
              </p>
              <h2 className="mt-2 text-2xl font-bold uppercase tracking-wider text-foreground font-[var(--font-oswald)]">
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
          <div className="mt-6">
            <ProductGrid products={newArrivals} />
          </div>
        </section>
      )}

      {/* Brand Statement */}
      <section className="mt-16 md:mt-20">
        <div className="rounded-xl border border-border bg-card p-8 text-center md:p-12">
          <Image
            src="/images/logo.png"
            alt="DEMURBAN"
            width={64}
            height={64}
            className="mx-auto h-16 w-16 object-contain"
          />
          <h2 className="mt-6 text-3xl font-bold uppercase tracking-wider text-foreground font-[var(--font-oswald)] md:text-4xl">
            The DEM Lifestyle
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            More than fashion. It&apos;s a statement. A movement. An identity. 
            We craft pieces for those who refuse to blend in with the crowd.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border px-6 text-sm font-semibold uppercase tracking-wider text-foreground hover:border-accent hover:text-accent"
          >
            Learn More About Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mt-16 rounded-xl border border-accent/30 bg-accent/5 p-8 md:mt-20 md:p-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Stay Connected
            </p>
            <h3 className="mt-2 text-2xl font-bold uppercase tracking-wider text-foreground font-[var(--font-oswald)]">
              Join the Movement
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Be the first to know about new drops, exclusive offers, and behind-the-scenes content.
            </p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-12 w-full rounded-lg border border-border bg-input px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              required
            />
            <button
              type="submit"
              className="h-12 shrink-0 rounded-lg bg-accent px-6 text-sm font-semibold uppercase tracking-wider text-accent-foreground hover:bg-accent/90"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
