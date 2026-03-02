"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Download } from "lucide-react";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function PressKit() {
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
            Press Kit
          </h1>
          <p className="text-muted-foreground mb-12">
            Official brand resources and media information
          </p>

          <div className="space-y-16">
            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-6 font-[var(--font-oswald)]">
                About DEMURBAN
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                DEMURBAN is a premium urban streetwear brand dedicated to redefining contemporary fashion. Our collection celebrates the intersection of taste, identity, and lifestyle culture, offering curated pieces for men, women, and kids.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Founded with the mission "Where Taste Meets Identity," DEMURBAN represents more than clothing—it's a lifestyle movement for those who refuse to compromise on quality or authenticity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-6 font-[var(--font-oswald)]">
                Brand Assets
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-border p-6 bg-card/50">
                  <h3 className="font-bold uppercase tracking-wider mb-3 font-[var(--font-oswald)]">
                    Logo & Identity
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    High-resolution logos, color specifications, and brand guidelines.
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>

                <div className="rounded-lg border border-border p-6 bg-card/50">
                  <h3 className="font-bold uppercase tracking-wider mb-3 font-[var(--font-oswald)]">
                    Product Photography
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    High-quality product images suitable for media coverage.
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>

                <div className="rounded-lg border border-border p-6 bg-card/50">
                  <h3 className="font-bold uppercase tracking-wider mb-3 font-[var(--font-oswald)]">
                    Brand Story
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Detailed brand history, mission, and values documentation.
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>

                <div className="rounded-lg border border-border p-6 bg-card/50">
                  <h3 className="font-bold uppercase tracking-wider mb-3 font-[var(--font-oswald)]">
                    Media Kit
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive guide for journalists and content creators.
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-6 font-[var(--font-oswald)]">
                Fast Facts
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-bold text-accent mb-2">Founded</h3>
                  <p className="text-muted-foreground">2024</p>
                </div>
                <div>
                  <h3 className="font-bold text-accent mb-2">Headquarters</h3>
                  <p className="text-muted-foreground">Lagos, Nigeria</p>
                </div>
                <div>
                  <h3 className="font-bold text-accent mb-2">Focus</h3>
                  <p className="text-muted-foreground">Premium Urban Streetwear</p>
                </div>
                <div>
                  <h3 className="font-bold text-accent mb-2">Target Market</h3>
                  <p className="text-muted-foreground">Men, Women, Kids</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-6 font-[var(--font-oswald)]">
                Media Contact
              </h2>
              <div className="rounded-lg border border-border p-6 bg-card/50">
                <p className="text-muted-foreground mb-2">
                  For press inquiries, interviews, and media requests:
                </p>
                <a
                  href="mailto:press@demurban.com"
                  className="text-accent hover:underline font-semibold"
                >
                  press@demurban.com
                </a>
                <p className="text-sm text-muted-foreground mt-4">
                  Response time: 2-3 business days
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
