"use client";

import Link from "next/link";
import { useEffect } from "react";
import { clearCart } from "@/lib/cart";

export default function OrderSuccessPage() {
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="py-10 md:py-14">
      <h1 className="text-2xl font-semibold">Payment received</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Your order is confirmed. You’ll receive an email confirmation shortly.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/shop"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-5 text-sm font-medium text-white hover:bg-zinc-900"
        >
          Continue shopping
        </Link>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 px-5 text-sm font-medium text-zinc-950 hover:bg-zinc-50"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
