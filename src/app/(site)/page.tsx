import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import CollectionsShowcase from "@/components/CollectionsShowcase";
import WhatDefinesOurWear from "@/components/WhatDefinesOurWear";
import CommunityShowcase from "@/components/CommunityShowcase";
import { AnimatedSection } from "@/components/AnimatedSection";
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

  // IMPORTANT: priceRange is now in KOBO (₦ * 100)
  const collections = [
    {
      id: "essentials",
      name: "Core Essentials",
      description: "Premium basics designed for everyday wear. Perfect foundation pieces for any wardrobe.",
      priceRange: { min: 2500000, max: 8500000 }, // ₦25,000 — ₦85,000
      image: "/images/dem6.png",
      href: "/shop?tag=essentials",
      tag: "For everyone",
    },
    {
      id: "limited",
      name: "Limited Editions",
      description: "Exclusive pieces in limited quantities. Get them before they're gone.",
      priceRange: { min: 3500000, max: 12000000 }, // ₦35,000 — ₦120,000
      image: "/images/dem3.jpg",
      href: "/shop?tag=limited",
      tag: "Limited",
    },
    {
      id: "trending",
      name: "Trending Now",
      description: "The hottest pieces right now. What everyone's wearing.",
      priceRange: { min: 3000000, max: 10000000 }, // ₦30,000 — ₦100,000
      image: "/images/dem0.jpg",
      href: "/shop?tag=trending",
      tag: "Trending",
    },
    {
      id: "seasonal",
      name: "Seasonal Collection",
      description: "Fresh styles for the season. Stay ahead of the curve.",
      priceRange: { min: 2800000, max: 11000000 }, // ₦28,000 — ₦110,000
      image: "/images/dem4.jpg",
      href: "/shop?tag=seasonal",
    },
    {
      id: "bestsellers",
      name: "Best Sellers",
      description: "Customer favorites that keep coming back. Tested and loved by the community.",
      priceRange: { min: 2000000, max: 9500000 }, // ₦20,000 — ₦95,000
      image: "/images/dem10.jpg",
      href: "/shop?sort=popular",
    },
  ];

  return (
    <div className="space-y-0">
      {/* Hero Section - Full Width with Image Background */}
      <AnimatedSection className="relative flex h-[600px] md:h-[700px] lg:h-[800px] flex-col items-center justify-center overflow-hidden bg-black">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img src="/images/placeholder.jpeg" alt="DEM Urban Hero" className="h-full w-full object-cover" />
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
            Discover unisex streetwear designed for those who refuse to blend in. Premium pieces that celebrate culture, creativity, and
            self-expression.
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
                    src={product.images?.[0] ?? "images/community1.jpg"}
                    alt={product.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </AnimatedSection>

      {/* Collections Showcase - Masonry Grid */}
      <AnimatedSection>
        <CollectionsShowcase collections={collections} />
      </AnimatedSection>

      {/* What Defines Our Wear Section */}
      <AnimatedSection>
        <WhatDefinesOurWear />
      </AnimatedSection>

      {/* Community Showcase */}
      <AnimatedSection>
        <CommunityShowcase />
      </AnimatedSection>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <AnimatedSection className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Latest Drop</p>
              <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                New Arrivals
              </h2>
            </div>

            <Link
              href="/shop?tag=new"
              className="group flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50 transition"
            >
              View all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <ProductGrid products={newArrivals} />
        </AnimatedSection>
      )}
    </div>
  );
}