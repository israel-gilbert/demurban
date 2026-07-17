import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import WhatDefinesOurWear from "@/components/WhatDefinesOurWear";
import CommunityShowcase from "@/components/CommunityShowcase";
import { AnimatedSection } from "@/components/AnimatedSection";
import { fetchProducts } from "@/lib/server-actions";
import type { Product } from "@/lib/types";
import HeroCarousel from "@/components/HeroCarousel";


// Force Next.js to render this page dynamically on every single refresh
export const revalidate = 0; 
export default async function HomePage() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    products = await fetchProducts({ limit: 12 });
  } catch (err) {
    console.error("[v0] Failed to fetch products:", err);
    error = "Unable to load products at the moment";
  }

  // Helper function to shuffle array items randomly (Fisher-Yates shuffle)
  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Shuffle all available products
  const shuffledProducts = shuffle(products);

  // Assign random slices directly (No tag filtering needed)
  const featured = shuffledProducts.slice(0, 8);     // Grab 8 completely random products
  const newArrivals = shuffledProducts.slice(0, 6);   // Grab 6 completely random products
  const heroProducts = shuffledProducts.slice(0, 7);  // Grab 7 completely random products

  return (
    <div className="space-y-0">
      {/* Hero Section - UNCHANGED ORIGINAL BACKGROUND AND CONTAINER SIZES */}
      <AnimatedSection className="relative flex h-[600px] md:h-[700px] lg:h-[800px] flex-col items-center justify-center overflow-hidden bg-black">
        
        {/* Carousel Component - Replaces the static image and gradient div */}
        <HeroCarousel />

        {/* Hero Content - Centered Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-2xl">
          
  {/* 2. HEADING MODIFIED WITH NUCLEAR INLINE STYLE */}
<div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl mb-6 mx-auto text-center">
  <h1 
    className="text-5xl md:text-[75px] tracking-[5px] uppercase leading-tight text-white drop-shadow-sm"
    style={{ fontFamily: "'Rubik Glitch', system-ui" }}
  >
    WHERE TASTE MEETS IDENTITY
  </h1>
</div>
          <p className="text-base md:text-lg text-white/90 mb-8 leading-relaxed max-w-xl">
            Discover unisex streetwear designed for those who refuse to blend in. Premium pieces that celebrate culture, creativity, and self-expression.
          </p>
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

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <AnimatedSection className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8">
            
{/* 3. SUBSECTION HEADER MODIFIED WITH NUCLEAR INLINE STYLE */}
<div className="w-full max-w-xs md:max-w-sm mt-2">
  <h2 
    className="text-[40px] md:text-[50px] tracking-[4px] uppercase text-neutral-900 dark:text-white leading-none"
    style={{ fontFamily: "'Rubik Glitch', system-ui" }}
  >
    STAY DEM
  </h2>
</div>

          </div>

          <ProductGrid products={newArrivals} />
        </AnimatedSection>
      )}

      {/* Community Showcase */}
      <AnimatedSection>
        <CommunityShowcase />
      </AnimatedSection>
    </div>
  );
}
