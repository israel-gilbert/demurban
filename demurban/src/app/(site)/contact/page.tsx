"use client";

import { useState } from "react";
import { Mail, Instagram, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send to an email service
    setSubmitted(true);
    setTimeout(() => {
      setFormState({ name: "", email: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Get In Touch</p>
        <h1 className="mt-3 text-4xl font-bold uppercase tracking-wider font-[var(--font-oswald)]">Contact Us</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Have a question or want to collaborate? We'd love to hear from you. Reach out and we'll get back to you within 24–48 hours.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-muted/30 p-8 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-foreground">Name *</span>
              <input
                type="text"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="h-11 rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
                placeholder="Your name"
                required
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-foreground">Email *</span>
              <input
                type="email"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="h-11 rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
                placeholder="your@email.com"
                required
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-foreground">Subject *</span>
            <input
              type="text"
              value={formState.subject}
              onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
              className="h-11 rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
              placeholder="What's this about?"
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-foreground">Message *</span>
            <textarea
              value={formState.message}
              onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              className="min-h-[140px] rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors resize-none"
              placeholder="Tell us more..."
              required
            />
          </label>

          <button
            type="submit"
            disabled={submitted}
            className="h-11 w-full rounded-lg bg-accent px-5 text-sm font-bold text-background hover:bg-accent/90 disabled:opacity-50 transition-colors"
          >
            {submitted ? "Message sent! ✓" : "Send Message"}
          </button>
        </form>

        {/* Contact Info */}
        <div className="space-y-6">
          {/* Email */}
          <div className="rounded-xl border border-border bg-muted/30 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Mail className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Email</h3>
            </div>
            <p className="text-muted-foreground">support@demurban.com</p>
            <p className="mt-1 text-sm text-muted-foreground">We respond within 24–48 hours</p>
          </div>

          {/* Instagram */}
          <div className="rounded-xl border border-border bg-muted/30 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Instagram className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Instagram</h3>
            </div>
            <p className="text-muted-foreground">@dem.urban</p>
            <p className="mt-1 text-sm text-muted-foreground">Follow for drops and updates</p>
          </div>

          {/* Location */}
          <div className="rounded-xl border border-border bg-muted/30 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Location</h3>
            </div>
            <p className="text-muted-foreground">Lagos, Nigeria</p>
            <p className="mt-1 text-sm text-muted-foreground">Headquarters & Creative Studio</p>
          </div>

          {/* FAQ */}
          <div className="rounded-xl border border-border bg-muted/30 p-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Common Questions</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-foreground">Shipping</p>
                <p className="text-muted-foreground">Delivered within 3–5 business days in Lagos</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Returns</p>
                <p className="text-muted-foreground">7-day returns on unworn, tagged items</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Collabs</p>
                <p className="text-muted-foreground">Email us directly for partnership inquiries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
