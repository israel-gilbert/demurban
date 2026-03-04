import Link from "next/link";
import { formatNGNFromKobo } from "@/lib/money";

interface Collection {
  id: string;
  name: string;
  description: string;
  // IMPORTANT: min/max should be KOBO (₦ * 100)
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
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
          Our Collections
        </p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Defined by Simplicity
          </h2>

          <Link
            href="/shop"
            className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 text-xs font-semibold tracking-wide hover:opacity-90 transition w-fit"
          >
            Shop All Items
          </Link>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="grid gap-4 auto-rows-max md:grid-cols-3">
        {collections.map((collection, idx) => {
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
              className={`group relative overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm transition ${gridClass}`}
            >
              {/* Image Background */}
              <div className="absolute inset-0 h-full w-full">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-300 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              </div>

              {/* Content Overlay - Bottom Aligned */}
              <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
                {/* Tag */}
                {collection.tag && (
                  <div className="mb-4 inline-flex w-fit rounded-full bg-white/90 dark:bg-neutral-950/80 backdrop-blur px-3 py-1.5 text-xs font-semibold tracking-wide text-neutral-900 dark:text-neutral-50">
                    {collection.tag}
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 line-clamp-2 tracking-tight">
                  {collection.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/80 mb-4 line-clamp-2">
                  {collection.description}
                </p>

                {/* Price Range & CTA */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 dark:bg-neutral-950/80 border border-black/10 dark:border-white/10 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                      ₦
                    </span>

                    <div className="leading-tight">
                      <div className="text-[11px] text-white/70">Pricing start from:</div>
                      <div className="text-sm font-medium text-white">
                        {formatNGNFromKobo(collection.priceRange.min)} — {formatNGNFromKobo(collection.priceRange.max)}
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex h-9 items-center justify-center rounded-full bg-white dark:bg-neutral-950 border border-black/10 dark:border-white/10 px-4 text-xs font-semibold tracking-wide text-neutral-900 dark:text-neutral-50 group-hover:opacity-90 transition">
                    All collections
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}