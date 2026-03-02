"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Truck, Clock, Globe } from "lucide-react";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ShippingInfo() {
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
            Shipping Information
          </h1>
          <p className="text-muted-foreground mb-12">
            Fast, secure delivery to your doorstep
          </p>

          <div className="space-y-12">
            <section className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border border-border p-6 bg-card/50">
                <Truck className="h-8 w-8 text-accent mb-3" />
                <h3 className="font-bold uppercase tracking-wider mb-2 font-[var(--font-oswald)]">
                  Standard Shipping
                </h3>
                <p className="text-sm text-muted-foreground">
                  5-7 business days. Free on orders over ₦50,000.
                </p>
              </div>

              <div className="rounded-lg border border-border p-6 bg-card/50">
                <Clock className="h-8 w-8 text-accent mb-3" />
                <h3 className="font-bold uppercase tracking-wider mb-2 font-[var(--font-oswald)]">
                  Express Shipping
                </h3>
                <p className="text-sm text-muted-foreground">
                  2-3 business days. ₦2,500 flat rate.
                </p>
              </div>

              <div className="rounded-lg border border-border p-6 bg-card/50">
                <Globe className="h-8 w-8 text-accent mb-3" />
                <h3 className="font-bold uppercase tracking-wider mb-2 font-[var(--font-oswald)]">
                  International
                </h3>
                <p className="text-sm text-muted-foreground">
                  7-14 business days. Rates vary by location.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-4 font-[var(--font-oswald)]">
                Shipping Details
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  All orders are carefully packed and shipped with tracking information. You will receive a tracking number via email once your order has been dispatched.
                </p>
                <p>
                  Orders are typically processed within 1-2 business days. During peak seasons, processing may take up to 3 business days.
                </p>
                <p>
                  We ship to most locations across Nigeria and internationally. Shipping costs will be calculated at checkout based on your location.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-4 font-[var(--font-oswald)]">
                Order Tracking
              </h2>
              <p className="text-muted-foreground mb-3">
                Once your order ships, you'll receive a tracking number. You can use this to monitor your package's journey:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Check your email for the tracking link</li>
                <li>Click the link to view real-time tracking updates</li>
                <li>Receive delivery notifications</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-4 font-[var(--font-oswald)]">
                Contact Support
              </h2>
              <p className="text-muted-foreground">
                Have questions about shipping? Contact us at{" "}
                <a href="mailto:hello@demurban.com" className="text-accent hover:underline">
                  hello@demurban.com
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
