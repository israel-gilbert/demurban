"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Instagram } from "lucide-react";

const communityImages = [
  {
    id: 1,
    src: "/images/placeholder.jpg",
    alt: "DEM Community member 1",
    handle: "@dem.community",
  },
  {
    id: 2,
    src: "/images/placeholder.jpg",
    alt: "DEM Community member 2",
    handle: "@dem.vibes",
  },
  {
    id: 3,
    src: "/images/placeholder.jpg",
    alt: "DEM Community member 3",
    handle: "@urban.style",
  },
  {
    id: 4,
    src: "/images/placeholder.jpg",
    alt: "DEM Community member 4",
    handle: "@dem.fits",
  },
  {
    id: 5,
    src: "/images/placeholder.jpg",
    alt: "DEM Community member 5",
    handle: "@style.dem",
  },
  {
    id: 6,
    src: "/images/placeholder.jpg",
    alt: "DEM Community member 6",
    handle: "@dem.official",
  },
  {
    id: 7,
    src: "/images/placeholder.jpg",
    alt: "DEM Community member 7",
    handle: "@urban.dem",
  },
];

export default function CommunityShowcase() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("community-carousel");
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === "left" 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      container.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
      setScrollPosition(newPosition);
    }
  };

  return (
    <section className="relative mx-auto w-full max-w-full overflow-hidden bg-gradient-to-b from-background to-muted/20 py-16 md:py-24 lg:py-32">
      {/* Decorative Elements */}
      <div className="absolute -left-40 top-1/2 h-64 w-64 rounded-full bg-accent/5 blur-3xl"></div>
      <div className="absolute -right-40 top-1/2 h-64 w-64 rounded-full bg-accent/5 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Join the Movement</p>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight font-[var(--font-oswald)] uppercase tracking-tight">
            See our community <br /> in their DEM
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-base text-muted-foreground leading-relaxed">
            Connect with us on Instagram for a daily dose of fresh styles and raw energy. See how the DEM community is wearing it, from Lagos streets to the world.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center h-11 px-8 rounded-full bg-foreground text-background font-bold text-sm hover:bg-foreground/90 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="https://instagram.com/dem.urban"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-11 px-8 rounded-full border-2 border-foreground text-foreground font-bold text-sm hover:bg-foreground/5 transition-colors"
            >
              <Instagram className="h-4 w-4" />
              @dem.urban
            </Link>
          </div>
        </div>

        {/* Community Carousel */}
        <div className="relative mt-12">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/90 transition-colors hidden lg:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/90 transition-colors hidden lg:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Carousel Container */}
          <div
            id="community-carousel"
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
            style={{ scrollBehavior: "smooth" }}
          >
            {communityImages.map((image) => (
              <Link
                key={image.id}
                href="https://instagram.com/dem.urban"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative shrink-0 h-64 w-48 md:h-72 md:w-56 rounded-2xl overflow-hidden border-2 border-border hover:border-accent transition-all"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Handle Badge */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-xs font-medium text-white truncate">{image.handle}</p>
                </div>

                {/* Instagram Icon */}
                <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Instagram className="h-4 w-4 text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Use <span className="font-bold text-foreground">#WearDEM</span> to get featured
          </p>
          <Link
            href="https://instagram.com/dem.urban"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-accent text-background font-bold text-sm hover:bg-accent/90 transition-colors"
          >
            <Instagram className="h-4 w-4" />
            Follow @dem.urban
          </Link>
        </div>
      </div>
    </section>
  );
}
