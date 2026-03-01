"use client";

import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import { containerVariants } from "@/lib/motion";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <motion.div
      className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      variants={containerVariants}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </motion.div>
  );
}
