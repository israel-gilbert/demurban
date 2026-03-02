"use client";

import { motion } from "framer-motion";
import { pageVariants } from "@/lib/motion";
import type { ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
      {children}
    </motion.div>
  );
}
