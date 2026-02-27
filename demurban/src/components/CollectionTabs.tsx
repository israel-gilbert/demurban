"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
    <div className="flex items-center gap-2 overflow-x-auto">
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
            className={[
              "inline-flex h-10 shrink-0 items-center justify-center rounded-xl border px-4 text-sm",
              active
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
            ].join(" ")}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
