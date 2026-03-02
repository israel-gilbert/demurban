import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Mail } from "lucide-react";
import EmailSubscription from "./EmailSubscription";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:px-8">
        {/* Newsletter Section */}
        <div className="mb-16 grid gap-8 md:grid-cols-3 md:items-center rounded-xl border border-accent/20 bg-gradient-to-r from-accent/5 to-transparent p-8 md:p-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-accent" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Stay Updated</p>
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wider font-[var(--font-oswald)] mb-2">
              Join the DEM Insider
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Get exclusive drops, early access, and insider tips delivered to your inbox.
            </p>
          </div>
          <EmailSubscription inFooter={true} />
        </div>

        {/* Main Footer Grid */}
        <div className="grid gap-12 md:grid-cols-4 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
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
            <p className="text-sm leading-relaxed text-muted-foreground mb-6">
              Where taste meets identity.
              <br />
              Home of the DEM lifestyle.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4">
              Shop
            </p>
            <nav className="flex flex-col gap-3">
              <Link
                href="/shop"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                All Products
              </Link>
              <Link
                href="/shop?category=MEN"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Men
              </Link>
              <Link
                href="/shop?category=WOMEN"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Women
              </Link>
              <Link
                href="/shop?category=KIDS"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Kids
              </Link>
              <Link
                href="/shop?tag=new"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                New Arrivals
              </Link>
            </nav>
          </div>

          {/* Company Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4">
              Company
            </p>
            <nav className="flex flex-col gap-3">
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Contact
              </Link>
              <a
                href="mailto:hello@demurban.com"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Email Us
              </a>
            </nav>
          </div>

          {/* Support Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4">
              Support
            </p>
            <nav className="flex flex-col gap-3">
              <Link
                href="/policies/shipping"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Shipping Info
              </Link>
              <Link
                href="/policies/returns"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Returns & Exchanges
              </Link>
              <Link
                href="/policies/privacy"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/policies/terms"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Terms & Conditions
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <p>&copy; {currentYear} DEMURBAN. All rights reserved.</p>
          <p className="text-center">
            <span className="text-accent">WHERE TASTE MEETS IDENTITY</span> — Home of the DEM Lifestyle
          </p>
        </div>
      </div>
    </footer>
  );
}
