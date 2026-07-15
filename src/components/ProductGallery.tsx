"use client";

import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const defaultImage = images?.[0] ?? "/images/dem4.jpg";
  const [activeImage, setActiveImage] = useState(defaultImage);

  return (
    <div className="space-y-3">
      {/* Hero Image */}
      <div className="aspect-[3/4] overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 bg-neutral-100 dark:bg-neutral-900">
        <img
          src={activeImage}
          alt={title}
          className="h-full w-full object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      {images?.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((src) => (
            <button
              key={src}
              onClick={() => setActiveImage(src)}
              className={`aspect-square overflow-hidden rounded-2xl border bg-neutral-100 dark:bg-neutral-900 transition-all ${
                activeImage === src
                  ? "border-neutral-900 dark:border-white scale-[0.97]"
                  : "border-black/5 dark:border-white/10 hover:scale-[1.03]"
              }`}
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}