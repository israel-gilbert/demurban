"use client";

import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/motion";

export default function ShopHeader() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-8"
    >
      <motion.p
        variants={itemVariants}
        className="text-sm tracking-[0.2em] uppercase text-neutral-500 dark:text-neutral-400"
      >
        Premium Collection
      </motion.p>

      <motion.h1
  variants={itemVariants}
  className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight text-[color:var(--foreground)]"
>
  DEM Shop
</motion.h1>
      <motion.p
  variants={itemVariants}
  className="mt-4 text-base text-[color:var(--muted-foreground)] max-w-2xl leading-relaxed"
>
  Explore our curated collection of premium streetwear. Where style meets substance—bold pieces designed without compromise.
</motion.p>
    </motion.section>
  );
}