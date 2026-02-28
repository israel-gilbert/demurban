import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="DEMURBAN"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <span className="text-xl font-bold tracking-[0.15em] text-foreground font-[var(--font-oswald)]">
                DEMURBAN
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Where taste meets identity.
              <br />
              Home of the DEM lifestyle.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-accent hover:text-accent"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-accent hover:text-accent"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Shop
            </p>
            <nav className="mt-4 flex flex-col gap-3">
              <Link
                href="/shop"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                All Products
              </Link>
              <Link
                href="/shop?category=MEN"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Men
              </Link>
              <Link
                href="/shop?category=WOMEN"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Women
              </Link>
              <Link
                href="/shop?category=KIDS"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Kids
              </Link>
              <Link
                href="/shop?tag=new"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                New Arrivals
              </Link>
            </nav>
          </div>

          {/* Company Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Company
            </p>
            <nav className="mt-4 flex flex-col gap-3">
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                About Us
              </Link>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Support Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Support
            </p>
            <nav className="mt-4 flex flex-col gap-3">
              <Link
                href="/policies/shipping"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Shipping Info
              </Link>
              <Link
                href="/policies/returns"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Returns & Exchanges
              </Link>
              <Link
                href="/policies/privacy"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                href="/faq"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                FAQ
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} DEMURBAN. All rights reserved.</p>
          <p className="text-center">
            <span className="text-accent">WHERE TASTE MEETS IDENTITY</span> — Home of the DEM Lifestyle
          </p>
        </div>
      </div>
    </footer>
  );
}
