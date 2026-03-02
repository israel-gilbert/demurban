"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function TermsAndConditions() {
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
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-3 font-[var(--font-oswald)]">
                Agreement to Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-3 font-[var(--font-oswald)]">
                Use License
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Permission is granted to temporarily download one copy of the materials (information or software) on DEMURBAN's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on the website</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-3 font-[var(--font-oswald)]">
                Disclaimer
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials on DEMURBAN's website are provided on an "as is" basis. DEMURBAN makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-3 font-[var(--font-oswald)]">
                Limitations
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall DEMURBAN or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on DEMURBAN's website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-3 font-[var(--font-oswald)]">
                Accuracy of Materials
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials appearing on DEMURBAN's website could include technical, typographical, or photographic errors. DEMURBAN does not warrant that any of the materials on the website are accurate, complete, or current. DEMURBAN may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-3 font-[var(--font-oswald)]">
                Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms & Conditions, please contact us at{" "}
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
