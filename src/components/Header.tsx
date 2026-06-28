"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchModal from "./SearchModal";
import ThemeToggle from "./ThemeToggle";
import { overlayVariants, menuVariants } from "@/lib/motion";

const nav = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Track Order", href: "/order/track" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function getIsActive(pathname: string | null, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname?.startsWith(href) ?? false;
}

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [mobileMenuOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-950/70 backdrop-blur">
        <div className="mx-auto flex h-20 md:h-24 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8 relative">
          
          {/* LEFT BLOCK: Hamburger on mobile / Logo on desktop */}
          <div className="flex flex-1 items-center justify-start">
            {/* Mobile Hamburger */}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 transition md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 stroke-[2.5]" /> : <Menu className="h-5 w-5 stroke-[2.5]" />}
            </button>

            {/* Desktop Logo Layout */}
            <Link href="/" className="hidden md:flex items-center">
              <img
                src="/images/logo.png"
                alt="demurban"
                className="h-12 w-auto object-contain brightness-100 dark:brightness-110 antialiased"
              />
            </Link>
          </div>

          {/* CENTER BLOCK (Desktop Only): Navigation Links */}
          <nav className="hidden items-center justify-center gap-8 md:flex absolute left-1/2 -translate-x-1/2">
            {nav.map((item) => {
              const isActive = getIsActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-medium uppercase tracking-[0.2em] transition ${
                    isActive
                      ? "text-neutral-900 dark:text-neutral-50"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* CENTER BLOCK (Mobile Only): Brand Logo centered cleanly */}
          <div className="flex md:hidden flex-initial items-center justify-center">
            <Link href="/" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="demurban"
                className="h-10 w-auto object-contain brightness-100 dark:brightness-110 antialiased"
              />
            </Link>
          </div>

          {/* RIGHT BLOCK: Actions Grouped To The Far Right */}
          <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 transition"
              aria-label="Search"
            >
              <Search className="h-5 w-5 stroke-[2.5]" />
            </button>

            <ThemeToggle />

            <Link
              href="/cart"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 transition relative"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5 stroke-[2.5]" />
            </Link>

            <Link
              href="/checkout"
              className="hidden h-10 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 text-sm font-semibold hover:opacity-90 transition md:inline-flex"
            >
              Checkout
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Side Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40 md:hidden bg-black/30 backdrop-blur-sm"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={handleOverlayClick}
              />
              <motion.div
                className="fixed right-0 top-16 z-40 w-72 border-l border-black/5 dark:border-white/10 bg-white dark:bg-neutral-950 md:hidden"
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <nav className="flex flex-col items-end gap-1 px-5 py-5">
                  {nav.map((item) => {
                    const isActive = getIsActive(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`w-full text-right py-3 text-xs font-medium uppercase tracking-[0.2em] transition ${
                          isActive
                            ? "text-neutral-900 dark:text-neutral-50"
                            : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}