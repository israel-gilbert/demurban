"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { formatMoney } from "@/lib/format";
import { hoverVariants, itemVariants, badgeVariants } from "@/lib/motion";

export default function ProductCard({ product }: { product: Product }) {
  const available = product.inventory_qty > 0;
  const hasDiscount = product.compare_at_kobo && product.compare_at_kobo > product.price_kobo;

  return (
    <motion.div variants={itemVariants} className="h-full">
      <Link
        href={`/shop/${product.slug}`}
        className="group block h-full overflow-hidden rounded-xl border border-border bg-card hover:border-accent/50 transition-colors"
      >
        <motion.div
          className="relative aspect-[3/4] w-full overflow-hidden bg-muted"
          initial="initial"
          whileHover="hover"
          variants={hoverVariants}
        >
          <Image
            src={product.images?.[0] ?? "/images/placeholder.jpg"}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          
          {/* Premium overlay on hover */}
          <motion.div 
            className="absolute inset-0 bg-black/0 group-hover:bg-black/10"
            transition={{ duration: 0.4 }}
          />
          
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {hasDiscount && (
              <motion.span 
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                className="rounded-md bg-accent px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground"
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
                className="rounded-md bg-foreground px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-background"
              >
                New
              </motion.span>
            )}
          </div>

          {!available && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <span className="rounded-md border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sold Out
              </span>
            </div>
          )}
        </motion.div>

        <div className="p-4">
          <motion.p 
            className="text-xs font-medium uppercase tracking-wider text-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {product.category}
          </motion.p>
          <h3 className="mt-1 text-sm font-semibold leading-tight text-card-foreground line-clamp-2">
            {product.title}
          </h3>

          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-base font-bold text-card-foreground">
              {formatMoney(product.price_kobo, product.currency)}
            </p>
            {hasDiscount && (
              <p className="text-sm text-muted-foreground line-through">
                {formatMoney(product.compare_at_kobo!, product.currency)}
              </p>
            )}
          </div>

          {product.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-1">
              {product.tags.slice(0, 2).map((t) => (
                <motion.span
                  key={t}
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                  className="rounded-md border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:border-accent hover:text-accent cursor-default"
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
