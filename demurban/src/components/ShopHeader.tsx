"use client";

import { motion } from "framer-motion";
import { itemVariants } from "@/lib/motion";

export default function ShopHeader() {
  return (
    <>
      <motion.div variants={itemVariants}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3">
          Premium Collection
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-[var(--font-oswald)] uppercase mb-3">
          DEM Shop
        </h1>
      </motion.div>
      <motion.p variants={itemVariants} className="text-base text-muted-foreground max-w-2xl leading-relaxed">
        Explore our curated collection of premium streetwear. Where style meets substance—bold pieces designed without compromise.
      </motion.p>
    </>
  );
}
