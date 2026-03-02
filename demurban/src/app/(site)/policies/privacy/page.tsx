"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-3 font-[var(--font-oswald)]">
                Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                DEMURBAN ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-3 font-[var(--font-oswald)]">
                Information We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We may collect information about you in a variety of ways. The information we may collect on the site includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Personal Data: name, email address, shipping address, payment information</li>
                <li>Device Information: browser type, IP address, pages visited, time spent on pages</li>
                <li>Usage Data: how you interact with our website and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-3 font-[var(--font-oswald)]">
                How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the site to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Process your transactions and fulfill your orders</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-3 font-[var(--font-oswald)]">
                Security of Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use administrative, technical, and physical security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-3 font-[var(--font-oswald)]">
                Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at{" "}
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
