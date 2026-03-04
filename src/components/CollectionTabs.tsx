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
    <div className="relative flex w-fit items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-neutral-100 dark:bg-neutral-900 p-1">
      {tabs.map((t) => {
        const active = t.value === value;
        let href = t.href;

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
            className="relative z-10 inline-flex h-9 items-center justify-center rounded-full px-5 text-sm font-medium text-neutral-600 dark:text-neutral-300 transition-colors hover:text-neutral-900 dark:hover:text-neutral-50"
          >
            {active && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 rounded-full bg-white dark:bg-neutral-800"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}

            <span
              className={`relative ${
                active
                  ? "text-neutral-900 dark:text-neutral-50"
                  : ""
              }`}
            >
              {t.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}