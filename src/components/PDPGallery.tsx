"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { imageVariants } from "@/lib/motion";

interface PDPGalleryProps {
  images: string[];
  title: string;
}

export function PDPGallery({ images, title }: PDPGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground">
        No images available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image with crossfade transition */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted border border-border">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedIndex}
            src={images[selectedIndex]}
            alt={`${title} image ${selectedIndex + 1}`}
            className="absolute inset-0 h-full w-full object-cover"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
        </AnimatePresence>
      </div>

      {/* Thumbnail gallery */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
              idx === selectedIndex
                ? "border-accent"
                : "border-border hover:border-accent/50"
            }`}
            aria-label={`View image ${idx + 1}`}
          >
            <img
              src={img}
              alt={`${title} thumbnail ${idx + 1}`}
              className="h-full w-full object-cover"
            />
            {idx === selectedIndex && (
              <motion.div
                layoutId="gallery-active"
                className="absolute inset-0 border-2 border-accent rounded-lg"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Image counter */}
      <div className="text-xs text-muted-foreground text-center">
        {selectedIndex + 1} of {images.length}
      </div>
    </div>
  );
}
