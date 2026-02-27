"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cartSubtotalKobo, getCart, type CartState } from "@/lib/cart";
import { formatMoney } from "@/lib/format";

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartState>({ currency: "NGN", items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("Nigeria");

  useEffect(() => {
    setCart(getCart());
  }, []);

  const subtotal = useMemo(() => cartSubtotalKobo(cart), [cart]);

  async function onPay(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (cart.items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!email || !fullName || !address1 || !city || !state || !country) {
      setError("Please complete the required fields.");
      return;
    }

    setLoading(true);
    try {
      const createOrderRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          items: cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity, variant: i.variant })),
          shippingAddress: {
            fullName,
            address1,
            address2,
            city,
            state,
            country,
          },
        }),
      });

      const created = await createOrderRes.json();
      if (!createOrderRes.ok) {
        throw new Error(created?.error ?? "Failed to create order");
      }

      const initRes = await fetch("/api/payments/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: created.orderId }),
      });

      const init = await initRes.json();
      if (!initRes.ok) {
        throw new Error(init?.error ?? "Failed to initialize payment");
      }

      window.location.href = init.authorizationUrl;
    } catch (err: any) {
      setError(err?.message ?? "Payment failed");
      setLoading(false);
    }
  }

  return (
    <div className="py-10 md:py-14">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <Link href="/cart" className="text-sm text-zinc-600 hover:text-zinc-950">
          Back to cart
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <form onSubmit={onPay} className="lg:col-span-2 rounded-2xl border border-zinc-200 p-6">
          <h2 className="text-sm font-semibold">Contact</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs text-zinc-600">Email *</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none ring-zinc-950/10 focus:ring-4"
                placeholder="you@example.com"
                required
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs text-zinc-600">Phone</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none ring-zinc-950/10 focus:ring-4"
                placeholder="+234..."
              />
            </label>
          </div>

          <h2 className="mt-8 text-sm font-semibold">Shipping</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs text-zinc-600">Full name *</span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none ring-zinc-950/10 focus:ring-4"
                placeholder="Full name"
                required
              />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs text-zinc-600">Address line 1 *</span>
              <input
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none ring-zinc-950/10 focus:ring-4"
                placeholder="Street address"
                required
              />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs text-zinc-600">Address line 2</span>
              <input
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none ring-zinc-950/10 focus:ring-4"
                placeholder="Apartment, suite, etc."
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs text-zinc-600">City *</span>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none ring-zinc-950/10 focus:ring-4"
                placeholder="City"
                required
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs text-zinc-600">State *</span>
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none ring-zinc-950/10 focus:ring-4"
                placeholder="State"
                required
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs text-zinc-600">Country *</span>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none ring-zinc-950/10 focus:ring-4"
                placeholder="Country"
                required
              />
            </label>
          </div>

          {error ? (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-950 px-5 text-sm font-medium text-white hover:bg-zinc-900 disabled:opacity-50"
          >
            {loading ? "Redirecting…" : "Pay with Paystack"}
          </button>

          <p className="mt-3 text-xs text-zinc-500">
            By paying, you agree to DemUrban’s order and returns policy.
          </p>
        </form>

        <aside className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 h-fit">
          <h2 className="text-sm font-semibold">Order summary</h2>
          <div className="mt-4 space-y-3">
            {cart.items.map((i) => (
              <div key={`${i.productId}-${JSON.stringify(i.variant ?? {})}`} className="flex items-start justify-between gap-4">
                <div className="text-sm">
                  <p className="font-medium">{i.title}</p>
                  <p className="text-xs text-zinc-600">Qty: {i.quantity}</p>
                </div>
                <p className="text-sm font-medium">{formatMoney(i.price_kobo * i.quantity, cart.currency)}</p>
              </div>
            ))}

            <div className="border-t border-zinc-200 pt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">Subtotal</span>
                <span className="font-medium">{formatMoney(subtotal, cart.currency)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">Shipping</span>
                <span className="font-medium">Calculated</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Total</span>
                <span className="font-bold">{formatMoney(subtotal, cart.currency)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
