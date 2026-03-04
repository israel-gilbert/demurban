"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cartSubtotalKobo, getCart, type CartState } from "@/lib/cart";
import { formatNGNFromKobo } from "@/lib/money";
import { ArrowLeft } from "lucide-react";

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
      setLoading(false);
      return;
    }

    if (!email || !fullName || !address1 || !city || !state || !country) {
      setError("Please complete all required fields.");
      setLoading(false);
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
          shippingAddress: { fullName, address1, address2, city, state, country },
        }),
      });

      const created = await createOrderRes.json();
      if (!createOrderRes.ok) throw new Error(created?.error ?? "Failed to create order");

      const initRes = await fetch("/api/payments/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: created.orderId }),
      });

      const init = await initRes.json();
      if (!initRes.ok) throw new Error(init?.error ?? "Failed to initialize payment");

      window.location.href = init.authorizationUrl;
    } catch (err: any) {
      setError(err?.message ?? "Payment failed");
      setLoading(false);
    }
  }

  const inputClass =
    "h-11 rounded-xl border border-border bg-input px-4 text-sm text-foreground outline-none " +
    "focus:ring-2 focus:ring-ring/20 focus:border-accent transition";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14 lg:px-8">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to cart
      </Link>

      <h1 className="mt-6 text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
        Checkout
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <form
          onSubmit={onPay}
          className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 md:p-7 space-y-6 shadow-sm"
        >
          {/* Contact */}
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Contact Information
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-medium text-muted-foreground">Email *</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className={inputClass}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-medium text-muted-foreground">Phone</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  className={inputClass}
                  placeholder="+234..."
                />
              </label>
            </div>
          </div>

          {/* Shipping */}
          <div className="border-t border-border pt-6">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Shipping Address
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 md:col-span-2">
                <span className="text-xs font-medium text-muted-foreground">Full Name *</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  placeholder="Full name"
                  required
                />
              </label>

              <label className="grid gap-2 md:col-span-2">
                <span className="text-xs font-medium text-muted-foreground">Street Address *</span>
                <input
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  className={inputClass}
                  placeholder="123 Main Street"
                  required
                />
              </label>

              <label className="grid gap-2 md:col-span-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Apartment, suite, etc. (optional)
                </span>
                <input
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  className={inputClass}
                  placeholder="Apartment 4B"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-medium text-muted-foreground">City *</span>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                  placeholder="Lagos"
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-medium text-muted-foreground">State *</span>
                <input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={inputClass}
                  placeholder="Lagos State"
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-medium text-muted-foreground">Country *</span>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={inputClass}
                  placeholder="Nigeria"
                  required
                />
              </label>
            </div>
          </div>

          {/* Error */}
          {error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground text-background px-6 text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? "Processing…" : "Pay Now"}
          </button>

          <p className="text-xs text-muted-foreground">
            By paying, you agree to DEM Urban&apos;s order and returns policy. Your transaction is secure and encrypted.
          </p>
        </form>

        {/* Summary */}
        <aside className="rounded-3xl border border-border bg-card p-6 md:p-7 h-fit lg:sticky lg:top-24 shadow-sm">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Order Summary
          </h2>

          <div className="mt-6 space-y-3 max-h-96 overflow-y-auto">
            {cart.items.map((i) => (
              <div
                key={`${i.productId}-${JSON.stringify(i.variant ?? {})}`}
                className="flex items-start justify-between gap-4 pb-3 border-b border-border last:border-b-0 last:pb-0"
              >
                <div className="text-sm flex-1">
                  <p className="font-semibold text-foreground line-clamp-1">{i.title}</p>
                  <p className="text-xs text-muted-foreground">Qty: {i.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-foreground shrink-0">
                  {formatNGNFromKobo(i.price_kobo * i.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-border pt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">{formatNGNFromKobo(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium text-foreground">Calculated</span>
            </div>

            <div className="flex items-center justify-between text-base font-semibold pt-3 border-t border-border">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">{formatNGNFromKobo(subtotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}