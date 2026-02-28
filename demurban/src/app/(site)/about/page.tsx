import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14 lg:px-8">
      {/* Hero */}
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">About DEM</p>
          <h1 className="mt-3 text-4xl font-bold uppercase tracking-wider font-[var(--font-oswald)]">
            Where Taste Meets Identity
          </h1>
          <p className="mt-6 text-lg leading-7 text-muted-foreground">
            DEM Urban is a unisex streetwear brand born from the streets of Lagos. We create bold, unapologetic pieces for those who refuse to blend in. Every design tells a story—of culture, resilience, and self-expression.
          </p>
        </div>
        <div className="aspect-video rounded-2xl border border-border bg-muted overflow-hidden">
          <img
            src="/images/placeholder.jpg"
            alt="DEM Urban Store"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Mission & Values */}
      <div className="mt-20 grid gap-8 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-muted/30 p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Our Mission</p>
          <h2 className="mt-3 text-xl font-bold text-foreground">Empower Through Style</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            We believe fashion is a form of expression. DEM Urban provides the platform for individuals to assert their identity, culture, and values through what they wear.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Our Values</p>
          <h2 className="mt-3 text-xl font-bold text-foreground">Quality & Authenticity</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Every piece is crafted with intention. We use premium materials and work with skilled artisans to ensure each item meets our standards of excellence and durability.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Community</p>
          <h2 className="mt-3 text-xl font-bold text-foreground">Built Together</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            DEM Urban is more than a brand—it's a movement. Our community of creatives, artists, and tastemakers shape our direction and define what DEM means.
          </p>
        </div>
      </div>

      {/* Timeline / Story */}
      <div className="mt-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">The Journey</p>
        <h2 className="mt-3 text-3xl font-bold uppercase tracking-wider font-[var(--font-oswald)]">Our Story</h2>
        <div className="mt-10 space-y-8 max-w-2xl">
          <div className="flex gap-4">
            <div className="w-32 shrink-0">
              <p className="font-bold text-accent">2023</p>
              <p className="text-sm text-muted-foreground">Launch</p>
            </div>
            <p className="text-muted-foreground leading-7">DEM Urban was conceived as a response to Lagos' vibrant street culture. We started small, with limited drops and a close-knit community of supporters who believed in the vision.</p>
          </div>
          <div className="flex gap-4">
            <div className="w-32 shrink-0">
              <p className="font-bold text-accent">2024</p>
              <p className="text-sm text-muted-foreground">Growth</p>
            </div>
            <p className="text-muted-foreground leading-7">As demand grew, we expanded our collection and refined our production. Each drop now features collaborations with local artists and designers, bringing fresh perspectives to the DEM narrative.</p>
          </div>
          <div className="flex gap-4">
            <div className="w-32 shrink-0">
              <p className="font-bold text-accent">Today</p>
              <p className="text-sm text-muted-foreground">Evolution</p>
            </div>
            <p className="text-muted-foreground leading-7">DEM Urban continues to push boundaries. We're not just creating clothing—we're building a cultural movement that celebrates authenticity, creativity, and the unapologetic spirit of those who wear our pieces.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-20 rounded-2xl border border-accent/30 bg-accent/5 p-12 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Ready?</p>
        <h2 className="mt-3 text-2xl font-bold uppercase tracking-wider font-[var(--font-oswald)]">Join the Movement</h2>
        <p className="mt-4 text-muted-foreground">Explore our latest collection and become part of the DEM Urban community.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-accent px-8 text-sm font-bold text-background hover:bg-accent/90"
        >
          Shop Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
