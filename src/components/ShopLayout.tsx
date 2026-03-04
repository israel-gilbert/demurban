"use client";

import { motion } from "framer-motion";
import { pageVariants, sectionVariants, itemVariants } from "@/lib/motion";
import { ReactNode } from "react";

interface ShopLayoutProps {
  header: ReactNode;
  filters: ReactNode;
  content: ReactNode;
}

export default function ShopLayout({ header, filters, content }: ShopLayoutProps) {
  return (
    <motion.div
      className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Header */}
      <div className="mb-12">
  {header}
</div>

      <div className="grid gap-8 lg:gap-10 lg:grid-cols-[300px_1fr]">
        {/* Sidebar Filters */}
        <motion.aside className="lg:sticky lg:top-24 lg:self-start" variants={itemVariants}>
          <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-black/5 dark:border-white/10 p-5 md:p-6 shadow-sm">
            {filters}
          </div>
        </motion.aside>

        {/* Products Grid */}
        <motion.main variants={itemVariants}>
          {content}
        </motion.main>
      </div>
    </motion.div>
  );
}