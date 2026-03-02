"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function EmailSubscription({ inFooter = false }: { inFooter?: boolean }) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // TODO: Connect to your email service (Mailchimp, Resend, etc.)
    console.log("Subscribe:", email);
    setIsSubmitted(true);
    
    timeoutRef.current = setTimeout(() => {
      setEmail("");
      setIsSubmitted(false);
    }, 2000);
  };

  if (inFooter) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
        <label className="text-xs font-bold uppercase tracking-[0.2em] text-accent block">
          Newsletter
        </label>
        <div className="flex gap-2 w-full">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 h-10 rounded-lg border border-border bg-card px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 placeholder-muted-foreground"
            required
          />
          <motion.button
            type="submit"
            disabled={isSubmitted}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-10 px-4 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 disabled:opacity-50"
          >
            {isSubmitted ? "✓" : "Join"}
          </motion.button>
        </div>
        {isSubmitted && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-accent">
            Thanks for subscribing!
          </motion.p>
        )}
      </form>
    );
  }

  return null;
}
