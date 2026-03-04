"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { formatNGNFromKobo } from "@/lib/money";
import { hoverVariants, itemVariants, badgeVariants } from "@/lib/motion";

export default function ProductCard({ product }: { product: Product }) {
  const available = product.inventory_qty > 0;
  const hasDiscount = product.compare_at_kobo && product.compare_at_kobo > product.price_kobo;

  return (
    <motion.div variants={itemVariants} className="h-full">
      <Link
        href={`/shop/${product.slug}`}
        className="group block h-full overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm transition"
      >
        <motion.div
          className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800"
          initial="initial"
          whileHover="hover"
          variants={hoverVariants}
        >
          <Image
            src={product.images?.[0] ?? "/images/placeholder.jpg"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          <motion.div
            className="absolute inset-0 bg-black/0 group-hover:bg-black/5"
            transition={{ duration: 0.3 }}
          />

          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {hasDiscount && (
              <motion.span
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                className="rounded-full bg-white/90 dark:bg-neutral-950/80 px-3 py-1 text-[10px] font-semibold tracking-wide text-neutral-900 dark:text-neutral-50"
              >
                Sale
              </motion.span>
            )}

            {product.tags?.includes("new") && (
              <motion.span
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
                className="rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-3 py-1 text-[10px] font-semibold tracking-wide"
              >
                New
              </motion.span>
            )}
          </div>

          {!available && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
              <span className="rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 px-4 py-2 text-xs font-semibold tracking-wide text-neutral-900 dark:text-neutral-50">
                Sold Out
              </span>
            </div>
          )}
        </motion.div>

        <div className="p-5">
          <h3 className="mt-1 text-sm font-semibold leading-tight text-neutral-900 dark:text-neutral-50 line-clamp-2 tracking-tight">
            {product.title}
          </h3>

          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
              {formatNGNFromKobo(product.price_kobo)}
            </p>

            {hasDiscount && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 line-through">
                {formatNGNFromKobo(product.compare_at_kobo!)}
              </p>
            )}
          </div>

          {product.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {product.tags.slice(0, 2).map((t) => (
                <motion.span
                  key={t}
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                  className="rounded-full border border-black/10 dark:border-white/10 px-3 py-1 text-[10px] font-medium tracking-wide text-neutral-600 dark:text-neutral-300 cursor-default"
                >
                  {t}
                </motion.span>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </motion.div>
  );
}