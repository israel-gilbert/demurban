"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          DEMURBAN
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((i) => {
            const active = pathname === i.href || pathname?.startsWith(i.href + "/");
            return (
              <Link
                key={i.href}
                href={i.href}
                className={[
                  "text-sm transition-colors",
                  active ? "text-zinc-950" : "text-zinc-600 hover:text-zinc-950",
                ].join(" ")}
              >
                {i.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 px-3 text-sm hover:bg-zinc-50"
          >
            Cart
          </Link>
          <Link
            href="/checkout"
            className="hidden h-10 items-center justify-center rounded-xl bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-900 md:inline-flex"
          >
            Checkout
          </Link>
        </div>
      </div>
    </header>
  );
}
