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
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="mb-12">
        {header}
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Filters */}
        <motion.aside 
          className="lg:sticky lg:top-24 lg:self-start"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filters}
        </motion.aside>

        {/* Products Grid */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {content}
        </motion.main>
      </div>
    </motion.div>
  );
}
