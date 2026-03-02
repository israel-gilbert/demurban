"use client";

import Link from "next/link";
import Image from "next/image";
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
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function getIsActive(pathname: string | null, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname?.startsWith(href) ?? false;
}

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close menu on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [mobileMenuOpen]);

  // Close menu on outside click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="DEMURBAN"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <span className="hidden text-lg font-bold tracking-[0.2em] text-foreground sm:inline-block font-[var(--font-oswald)]">
              DEMURBAN
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((item) => {
              const isActive = getIsActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium uppercase tracking-wider transition-colors ${
                    isActive 
                      ? "text-accent" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <ThemeToggle />
            <Link
              href="/cart"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-muted"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
            </Link>
            <Link
              href="/checkout"
              className="hidden h-10 items-center justify-center rounded-lg bg-accent px-5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 md:inline-flex"
            >
              Checkout
            </Link>
          </div>
        </div>

        {/* Mobile Navigation with Animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40 md:hidden"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={handleOverlayClick}
              />
              <motion.div
                className="fixed right-0 top-16 z-40 w-64 border-l border-border bg-background md:hidden"
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <nav className="flex flex-col px-4 py-4">
                  {nav.map((item) => {
                    const isActive = getIsActive(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`py-3 text-sm font-medium uppercase tracking-wider transition-colors ${
                          isActive 
                            ? "text-accent" 
                            : "text-muted-foreground hover:text-foreground"
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

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
