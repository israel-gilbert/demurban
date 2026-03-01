"use client";

import { motion } from "framer-motion";
import { sectionVariants, itemVariants } from "@/lib/motion";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedSection({ children, className }: SectionProps) {
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      variants={sectionVariants}
    >
      {children}
    </motion.section>
  );
}

export function AnimatedItem({ children, className }: SectionProps) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
