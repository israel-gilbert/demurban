"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearCart } from "@/lib/cart";
import { Package, CheckCircle, Mail, ArrowRight, Copy, Check } from "lucide-react";

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product: {
    title: string;
    slug: string;
    images: string[];
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  currency: string;
  subtotal: number;
  shipping: number;
  total: number;
  customerEmail: string;
  paidAt: string | null;
  createdAt: string;
  items: OrderItem[];
}

function formatPrice(amount: number, currency: string = "NGN") {
  const formatted = (amount / 100).toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${currency === "NGN" ? "" : currency} ${formatted}`;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    clearCart();

    // Try to get order details from session storage (set during checkout)
    const orderData = sessionStorage.getItem("lastOrder");
    if (orderData) {
      try {
        setOrder(JSON.parse(orderData));
      } catch {
        // Invalid data, ignore
      }
    }
    setLoading(false);
  }, []);

  const copyOrderNumber = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Payment Successful!</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Thank you for your order. We've received your payment and are processing your order.
        </p>
      </div>

      {order ? (
        <div className="space-y-6">
          {/* Order Summary Card */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Order Summary</h2>
              <button
                onClick={copyOrderNumber}
                className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Order Number</p>
                <p className="font-mono font-medium">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Order Date</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Email</p>
                <p className="font-medium">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Status</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-sm font-medium text-green-700 dark:text-green-300">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Paid
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
            <h2 className="font-semibold mb-4">Items Ordered</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    {item.product?.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-6 w-6 text-neutral-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Qty: {item.quantity} × {formatPrice(item.unitPrice, order.currency)}
                    </p>
                  </div>
                  <p className="font-medium">{formatPrice(item.lineTotal, order.currency)}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">Subtotal</span>
                <span>{formatPrice(order.subtotal, order.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">Shipping</span>
                <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping, order.currency)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <span>Total</span>
                <span>{formatPrice(order.total, order.currency)}</span>
              </div>
            </div>
          </div>

          {/* Email Confirmation Notice */}
          <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/50 p-4 flex items-start gap-3">
            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">Confirmation email sent</p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                We've sent order confirmation to <strong>{order.customerEmail}</strong> with your order details and tracking information.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/order/track"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-neutral-900 dark:bg-white px-5 text-sm font-medium text-white dark:text-neutral-900 hover:opacity-90 transition"
            >
              Track Your Order
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700 px-5 text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        /* Fallback when no order data is available */
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">
              Your order has been confirmed. You'll receive an email confirmation shortly.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/order/track"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-neutral-900 dark:bg-white px-5 text-sm font-medium text-white dark:text-neutral-900 hover:opacity-90 transition"
            >
              Track Your Order
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700 px-5 text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-6 text-center">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Have questions about your order?
        </p>
        <Link
          href="/contact"
          className="mt-2 inline-flex items-center text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:underline"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}