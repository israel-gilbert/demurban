"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cartSubtotalKobo, getCart, removeFromCart, updateCartQuantity, type CartState } from "@/lib/cart";
import { formatMoney } from "@/lib/format";
import { ArrowRight, Trash2 } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState<CartState>({ currency: "NGN", items: [] });

  useEffect(() => {
    setCart(getCart());
  }, []);

  const subtotal = useMemo(() => cartSubtotalKobo(cart), [cart]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14 lg:px-8">
      <h1 className="text-3xl font-bold uppercase tracking-wider font-[var(--font-oswald)]">Shopping Cart</h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.length > 0 ? (
            cart.items.map((item) => (
              <div key={`${item.productId}-${JSON.stringify(item.variant ?? {})}`} className="rounded-lg border border-border bg-card p-5 hover:border-accent/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="h-24 w-20 overflow-hidden rounded-lg border border-border bg-muted shrink-0">
                      <img
                        src={item.image ?? "/images/placeholder.jpg"}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatMoney(item.price_kobo, cart.currency)} each
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
                          className="h-8 w-8 rounded border border-border text-sm font-medium hover:bg-muted hover:border-accent/30 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => {
                            const next = item.quantity + 1;
                            setCart(updateCartQuantity(item.productId, next, item.variant));
                          }}
                          className="h-8 w-8 rounded border border-border text-sm font-medium hover:bg-muted hover:border-accent/30 transition-colors"
                        >
                          +
                        </button>
                        <button
                          onClick={() => {
                            setCart(removeFromCart(item.productId, item.variant));
                          }}
                          className="ml-2 h-8 w-8 rounded border border-border/50 text-muted-foreground hover:text-accent hover:border-accent/30 transition-colors flex items-center justify-center"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="font-semibold text-foreground text-right">
                    {formatMoney(item.price_kobo * item.quantity, cart.currency)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-border bg-muted/50 p-12 text-center">
              <p className="text-base text-muted-foreground">Your cart is empty</p>
              <Link
                href="/shop"
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-accent px-6 text-sm font-medium text-background hover:bg-accent/90 transition-colors"
              >
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <aside className="rounded-lg border border-border bg-muted/30 p-6 h-fit lg:sticky lg:top-24">
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Order Summary</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p className="font-medium text-foreground">{formatMoney(subtotal, cart.currency)}</p>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <p className="text-sm text-muted-foreground">Shipping</p>
                <p className="text-sm text-accent font-medium">Calculated at checkout</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <p className="font-bold text-foreground">Estimated Total</p>
                <p className="text-xl font-bold text-accent">{formatMoney(subtotal, cart.currency)}</p>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-accent px-5 text-sm font-medium text-background hover:bg-accent/90 transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/shop"
              className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted hover:border-accent/30 transition-colors"
            >
              Continue Shopping
            </Link>
          </aside>
        )}
      </div>
    </div>
  );
}
