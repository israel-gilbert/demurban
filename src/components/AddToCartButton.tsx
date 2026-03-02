"use client";

import { useMemo, useState } from "react";
import { addToCart } from "@/lib/cart";

export default function AddToCartButton(props: {
  product: {
    id: string;
    slug: string;
    title: string;
    price_kobo: number;
    currency: string;
    image?: string;
  };
  disabled?: boolean;
}) {
  const [added, setAdded] = useState(false);
  const label = useMemo(() => (added ? "Added" : "Add to cart"), [added]);

  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={() => {
        addToCart({
          productId: props.product.id,
          slug: props.product.slug,
          title: props.product.title,
          price_kobo: props.product.price_kobo,
          currency: props.product.currency,
          image: props.product.image,
          quantity: 1,
        });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-5 text-sm font-medium text-white hover:bg-zinc-900 disabled:opacity-50"
    >
      {label}
    </button>
  );
}
