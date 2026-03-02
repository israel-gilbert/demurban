import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Collection {
  id: string;
  name: string;
  description: string;
  priceRange: { min: number; max: number };
  image: string;
  href: string;
  tag?: string;
  size?: "small" | "medium" | "large";
}

interface CollectionsShowcaseProps {
  collections: Collection[];
}

export default function CollectionsShowcase({ collections }: CollectionsShowcaseProps) {
  if (collections.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Our Collections</p>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider font-[var(--font-oswald)]">
            Defined by Simplicity
          </h2>
          <Link
            href="/shop"
            className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-xs font-bold uppercase text-background hover:bg-foreground/90 transition-colors w-fit"
          >
            Shop All Items
          </Link>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="grid gap-4 auto-rows-max md:grid-cols-3">
        {collections.map((collection, idx) => {
          // Create masonry layout: first item spans 2x2, then alternate
          let gridClass = "md:col-span-2 md:row-span-2";
          if (idx === 0) {
            gridClass = "md:col-span-2 md:row-span-2";
          } else if (idx === 1) {
            gridClass = "md:col-span-1 md:row-span-1";
          } else if (idx === 2) {
            gridClass = "md:col-span-1 md:row-span-2";
          } else if (idx === 3) {
            gridClass = "md:col-span-1 md:row-span-1";
          } else if (idx === 4) {
            gridClass = "md:col-span-2 md:row-span-1";
          }

          return (
            <Link
              key={collection.id}
              href={collection.href}
              className={`group relative overflow-hidden rounded-2xl bg-muted transition-all hover:shadow-lg hover:shadow-accent/10 ${gridClass}`}
            >
              {/* Image Background */}
              <div className="absolute inset-0 h-full w-full">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              </div>

              {/* Content Overlay - Bottom Aligned */}
              <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
                {/* Tag */}
                {collection.tag && (
                  <div className="mb-4 inline-flex w-fit rounded-full bg-background/90 backdrop-blur-sm px-3 py-1.5 text-xs font-bold uppercase text-foreground">
                    {collection.tag}
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2 font-[var(--font-oswald)] uppercase">
                  {collection.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/80 mb-4 line-clamp-2">
                  {collection.description}
                </p>

                {/* Price Range & CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-white/20">
                      💰
                    </span>
                    <span className="text-xs text-white/70">
                      ${collection.priceRange.min.toLocaleString()} – ${collection.priceRange.max.toLocaleString()}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-8 items-center justify-center rounded-full bg-background px-3 text-xs font-bold uppercase text-foreground hover:bg-background/90 transition-colors"
                  >
                    All collections
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
