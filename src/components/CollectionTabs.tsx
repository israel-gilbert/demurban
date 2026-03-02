"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

type Tab = { label: string; value: string; href?: string };

export default function CollectionTabs({
  tabs,
  value,
}: {
  tabs: Tab[];
  value: string;
}) {
  const sp = useSearchParams();

  return (
    <div className="relative flex items-center gap-2 overflow-x-auto pb-2">
      {tabs.map((t) => {
        const active = t.value === value;
        let href = t.href;
        
        // Only compute dynamic href if not provided
        if (!href) {
          const next = new URLSearchParams(sp.toString());
          if (t.value === "all") next.delete("collection");
          else next.set("collection", t.value);
          href = `?${next.toString()}`;
        }

        return (
          <Link
            key={t.value}
            href={href}
            className={`relative inline-flex h-10 shrink-0 items-center justify-center rounded-lg border px-5 text-sm font-medium uppercase tracking-wider transition-colors ${
              active
                ? "border-accent text-accent"
                : "border-border text-muted-foreground hover:border-accent hover:text-accent"
            }`}
          >
            {t.label}
            {active && (
              <motion.div
                layoutId="tab-underline"
                className="absolute inset-0 rounded-lg border-2 border-accent"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
