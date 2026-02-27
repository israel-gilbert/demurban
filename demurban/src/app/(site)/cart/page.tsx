"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cartSubtotalKobo, getCart, removeFromCart, updateCartQuantity, type CartState } from "@/lib/cart";
import { formatMoney } from "@/lib/format";

export default function CartPage() {
  const [cart, setCart] = useState<CartState>({ currency: "NGN", items: [] });

  useEffect(() => {
    setCart(getCart());
  }, []);

  const subtotal = useMemo(() => cartSubtotalKobo(cart), [cart]);

  return (
    <div className="py-10 md:py-14">
      <h1 className="text-2xl font-semibold">Cart</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-3">
          {cart.items.length > 0 ? (
            cart.items.map((item) => (
              <div key={`${item.productId}-${JSON.stringify(item.variant ?? {})}`} className="rounded-2xl border border-zinc-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="h-20 w-16 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image ?? "/products/tee-1.svg"}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title}</p>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => {
                            const next = Math.max(0, item.quantity - 1);
                            setCart(updateCartQuantity(item.productId, next, item.variant));
                          }}
                          className="h-8 w-8 rounded border border-zinc-200 text-sm hover:bg-zinc-50"
                        >
                          −
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => {
                            const next = item.quantity + 1;
                            setCart(updateCartQuantity(item.productId, next, item.variant));
                          }}
                          className="h-8 w-8 rounded border border-zinc-200 text-sm hover:bg-zinc-50"
                        >
                          +
                        </button>
                        <button
                          onClick={() => {
                            setCart(removeFromCart(item.productId, item.variant));
                          }}
                          className="ml-2 text-xs text-zinc-500 hover:text-zinc-950"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm font-medium">
                    {formatMoney(item.price_kobo * item.quantity, cart.currency)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center">
              <p className="text-sm text-zinc-600">Your cart is empty</p>
              <Link
                href="/shop"
                className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-5 text-sm font-medium text-white hover:bg-zinc-900"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <aside className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 h-fit">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <p className="text-sm text-zinc-600">Subtotal</p>
                <p className="text-sm font-semibold">{formatMoney(subtotal, cart.currency)}</p>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <p className="text-sm text-zinc-600">Shipping</p>
                <p className="text-sm font-semibold">Calculated at checkout</p>
              </div>
              <div className="flex items-center justify-between pb-4">
                <p className="text-sm font-semibold">Estimated Total</p>
                <p className="text-lg font-bold">{formatMoney(subtotal, cart.currency)}</p>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-950 px-5 text-sm font-medium text-white hover:bg-zinc-900"
            >
              Checkout
            </Link>
          </aside>
        )}
      </div>
    </div>
  );
}
