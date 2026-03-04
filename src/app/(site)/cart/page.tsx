"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cartSubtotalKobo, getCart, removeFromCart, updateCartQuantity, type CartState } from "@/lib/cart";
import { formatNGNFromKobo } from "@/lib/money";
import { ArrowRight, Trash2 } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState<CartState>({ currency: "NGN", items: [] });

  useEffect(() => {
    setCart(getCart());
  }, []);

  const subtotal = useMemo(() => cartSubtotalKobo(cart), [cart]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
        Shopping Cart
      </h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.length > 0 ? (
            cart.items.map((item) => (
              <div
                key={`${item.productId}-${JSON.stringify(item.variant ?? {})}`}
                className="rounded-3xl border border-black/5 dark:border-white/10 bg-neutral-100 dark:bg-neutral-900 p-5 shadow-sm transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="h-24 w-20 overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 bg-neutral-200 dark:bg-neutral-800 shrink-0">
                      <img
                        src={item.image ?? "/images/placeholder.jpg"}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900 dark:text-neutral-50">{item.title}</p>

                      <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                        {formatNGNFromKobo(item.price_kobo)} each
                      </p>

                      <div className="mt-4 flex items-center gap-2">
                        <button
                          onClick={() => {
                            const next = Math.max(0, item.quantity - 1);
                            if (next === 0) {
                              setCart(removeFromCart(item.productId, item.variant));
                            } else {
                              setCart(updateCartQuantity(item.productId, next, item.variant));
                            }
                          }}
                          className="h-9 w-9 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 text-sm font-semibold text-neutral-900 dark:text-neutral-50 hover:opacity-90 transition"
                        >
                          −
                        </button>

                        <span className="w-8 text-center text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => {
                            const next = item.quantity + 1;
                            setCart(updateCartQuantity(item.productId, next, item.variant));
                          }}
                          className="h-9 w-9 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 text-sm font-semibold text-neutral-900 dark:text-neutral-50 hover:opacity-90 transition"
                        >
                          +
                        </button>

                        <button
                          onClick={() => {
                            setCart(removeFromCart(item.productId, item.variant));
                          }}
                          className="ml-2 h-9 w-9 rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-950/40 text-neutral-700 dark:text-neutral-200 hover:opacity-90 transition flex items-center justify-center"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="font-semibold text-neutral-900 dark:text-neutral-50 text-right">
                    {formatNGNFromKobo(item.price_kobo * item.quantity)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-neutral-100 dark:bg-neutral-900 p-14 text-center">
              <p className="text-base text-neutral-600 dark:text-neutral-400">Your cart is empty</p>

              <Link
                href="/shop"
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-6 text-sm font-semibold hover:opacity-90 transition"
              >
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <aside className="rounded-3xl border border-black/5 dark:border-white/10 bg-neutral-100 dark:bg-neutral-900 p-6 h-fit lg:sticky lg:top-24 shadow-sm">
            <h2 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Subtotal</p>
                <p className="font-semibold text-neutral-900 dark:text-neutral-50">{formatNGNFromKobo(subtotal)}</p>
              </div>

              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Shipping</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Calculated at checkout</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="font-semibold text-neutral-900 dark:text-neutral-50">Estimated Total</p>
                <p className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                  {formatNGNFromKobo(subtotal)}
                </p>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 text-sm font-semibold hover:opacity-90 transition"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/shop"
              className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 px-5 text-sm font-semibold text-neutral-900 dark:text-neutral-50 hover:opacity-90 transition"
            >
              Continue Shopping
            </Link>
          </aside>
        )}
      </div>
    </div>
  );
}