"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, Package, CheckCircle } from "lucide-react";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ReturnsAndExchanges() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={pageVariants}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <h1 className="text-4xl font-bold uppercase tracking-wider mb-2 font-[var(--font-oswald)]">
            Returns & Exchanges
          </h1>
          <p className="text-muted-foreground mb-12">
            We want you to love your DEM fit. Here's our return and exchange policy.
          </p>

          <div className="space-y-12">
            <section className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-border p-6 bg-card/50">
                <RotateCcw className="h-8 w-8 text-accent mb-3" />
                <h3 className="font-bold uppercase tracking-wider mb-2 font-[var(--font-oswald)]">
                  Easy Returns
                </h3>
                <p className="text-sm text-muted-foreground">
                  30-day return window from purchase date. Free return shipping on orders over ₦50,000.
                </p>
              </div>

              <div className="rounded-lg border border-border p-6 bg-card/50">
                <Package className="h-8 w-8 text-accent mb-3" />
                <h3 className="font-bold uppercase tracking-wider mb-2 font-[var(--font-oswald)]">
                  Exchanges
                </h3>
                <p className="text-sm text-muted-foreground">
                  Exchange for different sizes or colors within 30 days of purchase.
                </p>
              </div>

              <div className="rounded-lg border border-border p-6 bg-card/50">
                <CheckCircle className="h-8 w-8 text-accent mb-3" />
                <h3 className="font-bold uppercase tracking-wider mb-2 font-[var(--font-oswald)]">
                  Full Refunds
                </h3>
                <p className="text-sm text-muted-foreground">
                  Processed within 5-7 business days of receiving your return.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-4 font-[var(--font-oswald)]">
                Return Policy
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  We accept returns within 30 days of purchase. Items must be unworn, unwashed, and in original condition with all tags attached.
                </p>
                <p>
                  To start a return, contact us at{" "}
                  <a href="mailto:hello@demurban.com" className="text-accent hover:underline">
                    hello@demurban.com
                  </a>{" "}
                  with your order number.
                </p>
                <p>
                  Once approved, we'll provide a prepaid return shipping label. Pack your item securely and drop it off at any courier pickup point.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-4 font-[var(--font-oswald)]">
                Exchange Process
              </h2>
              <ol className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-bold text-accent">1.</span>
                  <span>Email us with your order number and desired exchange</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-accent">2.</span>
                  <span>We'll confirm availability and send a return label</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-accent">3.</span>
                  <span>Ship back your original item</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-accent">4.</span>
                  <span>Once received, we'll dispatch your new item</span>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-4 font-[var(--font-oswald)]">
                Non-Returnable Items
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Items purchased during final sales/clearance</li>
                <li>Custom or made-to-order items</li>
                <li>Items with signs of wear or damage</li>
                <li>Items without original tags</li>
              </ul>
            </section>

            <section className="rounded-lg border border-accent/20 bg-accent/5 p-6">
              <h2 className="text-lg font-bold uppercase tracking-wider mb-3 font-[var(--font-oswald)]">
                Questions?
              </h2>
              <p className="text-muted-foreground">
                Contact our customer service team at{" "}
                <a href="mailto:hello@demurban.com" className="text-accent hover:underline">
                  hello@demurban.com
                </a>{" "}
                for any questions about returns or exchanges.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
