"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import CollectionTabs from "@/components/CollectionTabs";
import { itemVariants } from "@/lib/motion";

export default function ShopHeader() {
  const sp = useSearchParams();
  const current = (sp.get("collection") || "all").toLowerCase();
  const tabs = [
    { label: "All", value: "all" },
    { label: "Latest Drop", value: "latest" },
    { label: "Archive", value: "archive" },
  ];
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
      <div className="mt-8">
        <CollectionTabs tabs={tabs} value={current} />
      </div>
    </>
  );
}
