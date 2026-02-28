'use client';

import Link from 'next/link';
import { ShirtIcon, PaletteIcon, Zap, Users, AlertCircle } from 'lucide-react';

const styleCategories = [
  {
    id: 'bold-statement',
    title: 'Bold Statements',
    description: 'Pieces designed to make you stand out. Unapologetic designs that celebrate individuality and culture.',
    image: '/images/placeholder.jpg',
    attributes: ['Statement', 'Cultural', 'Distinctive', 'Confident'],
    icon: Zap,
  },
  {
    id: 'urban-edge',
    title: 'Urban Edge',
    description: 'Contemporary streetwear that balances attitude with wearability. Perfect for those who live the urban lifestyle.',
    image: '/images/placeholder.jpg',
    attributes: ['Streetwear', 'Contemporary', 'Edgy', 'Modern'],
    icon: AlertCircle,
  },
  {
    id: 'everyday-luxury',
    title: 'Everyday Luxury',
    description: 'Premium quality pieces that work hard in your daily rotation. Comfort meets sophistication.',
    image: '/images/placeholder.jpg',
    attributes: ['Premium', 'Quality', 'Comfortable', 'Versatile'],
    icon: ShirtIcon,
  },
  {
    id: 'creative-expression',
    title: 'Creative Expression',
    description: 'Limited collaborations and exclusive designs that celebrate creativity. Art meets fashion.',
    image: '/images/placeholder.jpg',
    attributes: ['Limited', 'Artistic', 'Exclusive', 'Collaborative'],
    icon: PaletteIcon,
  },
  {
    id: 'community-driven',
    title: 'Community Driven',
    description: 'Designed for and with our community. Every piece tells a story of connection and shared values.',
    image: '/images/placeholder.jpg',
    attributes: ['Community', 'Inclusive', 'Unisex', 'Connected'],
    icon: Users,
  },
  {
    id: 'timeless-appeal',
    title: 'Timeless Appeal',
    description: 'Pieces that transcend trends. Classic styles that remain relevant season after season.',
    image: '/images/placeholder.jpg',
    attributes: ['Timeless', 'Classic', 'Durable', 'Iconic'],
    icon: AlertCircle,
  },
];

export default function WhatDefinesOurWear() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-6 md:py-28 lg:px-8">
      {/* Header */}
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 mb-6">
          <div className="h-2 w-2 rounded-full bg-accent"></div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
            What Defines DEM
          </p>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider font-[var(--font-oswald)] mb-4">
          Where Taste Meets Identity
        </h2>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground leading-relaxed">
          Thoughtful design blending bold aesthetics, cultural pride, and versatility for everyday living across lifestyles.
        </p>
      </div>

      {/* Grid of Style Categories */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {styleCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Link
              key={category.id}
              href={`/shop`}
              className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
            >
              {/* Image */}
              <div className="relative h-64 w-full overflow-hidden bg-muted">
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-lg font-bold text-foreground mb-2">{category.title}</h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {category.description}
                </p>

                {/* Attributes */}
                <div className="flex flex-wrap gap-2">
                  {category.attributes.map((attr) => (
                    <div
                      key={attr}
                      className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/70"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-accent"></div>
                      {attr}
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
