"use client";

import { useMemo, useState } from "react";
import { addToCart } from "@/lib/cart";

interface Variant {
  id: string;
  size: string;
  inventory_qty: number;
  price_kobo: number | null;
  active: boolean;
}

export default function AddToCartButton(props: {
  product: {
    id: string;
    slug: string;
    title: string;
    price_kobo: number;
    currency: string;
    image?: string;
    variants?: Variant[];
  };
  disabled?: boolean;
}) {
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const label = useMemo(() => (added ? "Added" : "Add to cart"), [added]);

  const hasVariants = props.product.variants && props.product.variants.length > 0;
  const activeVariants = props.product.variants?.filter(
    (v) => v.active && v.inventory_qty > 0
  ) || [];

  const handleAddToCart = () => {
    if (hasVariants && !selectedSize) {
      return; // Require size selection
    }

    const selectedVariant = hasVariants
      ? props.product.variants?.find((v) => v.size === selectedSize)
      : null;

    const price = selectedVariant?.price_kobo ?? props.product.price_kobo;

    addToCart({
      productId: props.product.id,
      slug: props.product.slug,
      title: props.product.title,
      price_kobo: price,
      currency: props.product.currency,
      image: props.product.image,
      quantity: 1,
      variant: selectedVariant
        ? { id: selectedVariant.id, size: selectedVariant.size }
        : undefined,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="space-y-4">
      {/* Size Selector */}
      {hasVariants && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Select Size
          </label>
          <div className="flex flex-wrap gap-2">
            {activeVariants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedSize(variant.size)}
                className={`min-w-[3rem] px-4 py-2 rounded-lg border text-sm font-medium transition ${
                  selectedSize === variant.size
                    ? "border-neutral-900 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500"
                }`}
              >
                {variant.size}
                {variant.price_kobo && variant.price_kobo !== props.product.price_kobo && (
                  <span className="ml-1 text-xs opacity-70">
                    (+{Math.round((variant.price_kobo - props.product.price_kobo) / 100)})
                  </span>
                )}
              </button>
            ))}
          </div>
          {props.product.variants?.some((v) => v.active && v.inventory_qty === 0) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {props.product.variants
                .filter((v) => v.active && v.inventory_qty === 0)
                .map((variant) => (
                  <span
                    key={variant.id}
                    className="min-w-[3rem] px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500 text-sm font-medium line-through cursor-not-allowed"
                  >
                    {variant.size}
                  </span>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Add to Cart Button */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={props.disabled || (hasVariants && !selectedSize)}
          onClick={handleAddToCart}
          className={`inline-flex h-11 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-6 text-sm font-semibold tracking-wide hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed ${
            added ? "opacity-90" : ""
          }`}
        >
          {label}
        </button>

        <a
          href="/cart"
          className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 px-6 text-sm font-semibold text-neutral-900 dark:text-neutral-50 hover:opacity-90 transition"
        >
          View Cart
        </a>
      </div>

      {/* Size not selected warning */}
      {hasVariants && !selectedSize && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Please select a size before adding to cart
        </p>
      )}
    </div>
  );
}