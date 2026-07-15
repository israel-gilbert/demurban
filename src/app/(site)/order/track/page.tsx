"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Search, AlertCircle, CheckCircle, Clock, Truck, XCircle } from "lucide-react";

interface OrderItem {
  id: string;
  title: string;
  size: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  variant: Record<string, unknown> | null;
  product: {
    title: string;
    slug: string;
    images: string[];
  };
}

type ShippingAddress = {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
};

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  currency: string;
  subtotal: number;
  shipping: number;
  total: number;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: ShippingAddress | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  trackingNumber: string | null;
  deliveryNotes: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  items: OrderItem[];
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode; bgColor: string }> = {
  PENDING: {
    label: "Pending",
    color: "text-yellow-700 dark:text-yellow-400",
    icon: <Clock className="h-5 w-5" />,
    bgColor: "bg-yellow-50 border-yellow-200 dark:bg-yellow-500/10 dark:border-yellow-500/30",
  },
  PAID: {
    label: "Paid",
    color: "text-blue-700 dark:text-blue-400",
    icon: <CheckCircle className="h-5 w-5" />,
    bgColor: "bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/30",
  },
  PROCESSING: {
    label: "Processing",
    color: "text-indigo-700 dark:text-indigo-400",
    icon: <Package className="h-5 w-5" />,
    bgColor: "bg-indigo-50 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/30",
  },
  IN_TRANSIT: {
    label: "In Transit",
    color: "text-amber-700 dark:text-amber-400",
    icon: <Truck className="h-5 w-5" />,
    bgColor: "bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30",
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-green-700 dark:text-green-400",
    icon: <CheckCircle className="h-5 w-5" />,
    bgColor: "bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/30",
  },
  FAILED: {
    label: "Failed",
    color: "text-red-700 dark:text-red-400",
    icon: <XCircle className="h-5 w-5" />,
    bgColor: "bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/30",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-gray-700 dark:text-gray-400",
    icon: <XCircle className="h-5 w-5" />,
    bgColor: "bg-gray-50 border-gray-200 dark:bg-gray-500/10 dark:border-gray-500/30",
  },
  REFUNDED: {
    label: "Refunded",
    color: "text-purple-700 dark:text-purple-400",
    icon: <CheckCircle className="h-5 w-5" />,
    bgColor: "bg-purple-50 border-purple-200 dark:bg-purple-500/10 dark:border-purple-500/30",
  },
};

function formatPrice(amount: number, currency: string = "NGN") {
  const formatted = (amount / 100).toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${currency === "NGN" ? "₦" : currency} ${formatted}`;
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

type TimelineStep = {
  key: string;
  label: string;
  description: string;
  date: string | null;
  done: boolean;
  current: boolean;
};

/** Build a customer-friendly timeline from the order's delivery lifecycle. */
function buildTimeline(order: Order): TimelineStep[] {
  const terminal = ["FAILED", "CANCELLED", "REFUNDED"].includes(order.status);

  if (terminal) {
    const cfg = statusConfig[order.status];
    return [
      {
        key: "placed",
        label: "Order Placed",
        description: `Order ${order.orderNumber} was created`,
        date: order.createdAt,
        done: true,
        current: false,
      },
      {
        key: order.status,
        label: cfg?.label ?? order.status,
        description:
          order.status === "FAILED"
            ? "Payment was not completed"
            : order.status === "CANCELLED"
              ? "This order was cancelled"
              : "This order was refunded",
        date: order.updatedAt,
        done: true,
        current: true,
      },
    ];
  }

  const statusRank: Record<string, number> = {
    PENDING: 0,
    PAID: 1,
    PROCESSING: 2,
    IN_TRANSIT: 3,
    DELIVERED: 4,
  };
  const rank = statusRank[order.status] ?? 0;

  const steps: TimelineStep[] = [
    {
      key: "placed",
      label: "Order Placed",
      description: `Order ${order.orderNumber} was created`,
      date: order.createdAt,
      done: true,
      current: rank === 0,
    },
    {
      key: "paid",
      label: "Payment Confirmed",
      description: "We received your payment",
      date: order.paidAt,
      done: rank >= 1,
      current: rank === 1,
    },
    {
      key: "processing",
      label: "Processing",
      description: "Your order is being prepared",
      date: null,
      done: rank >= 2,
      current: rank === 2,
    },
    {
      key: "in_transit",
      label: "In Transit",
      description: order.trackingNumber
        ? `On its way — tracking: ${order.trackingNumber}`
        : "Your order is on its way",
      date: order.shippedAt,
      done: rank >= 3,
      current: rank === 3,
    },
    {
      key: "delivered",
      label: "Delivered",
      description: "Your order has been delivered",
      date: order.deliveredAt,
      done: rank >= 4,
      current: rank === 4,
    },
  ];

  return steps;
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch order");
      }

      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = order ? statusConfig[order.status] : null;
  const timeline = order ? buildTimeline(order) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
          <Package className="h-7 w-7 text-neutral-600 dark:text-neutral-300" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Track Your Order</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Enter your order number and email to track your order status
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label htmlFor="orderNumber" className="block text-sm font-medium mb-1.5">
              Order Number
            </label>
            <input
              type="text"
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g., DU-20240628-ABC123"
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-3 text-sm focus:border-neutral-900 dark:focus:border-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="The email used during checkout"
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-3 text-sm focus:border-neutral-900 dark:focus:border-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-neutral-900 dark:bg-white px-4 py-3.5 text-sm font-semibold text-white dark:text-neutral-900 hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white dark:border-neutral-900 border-t-transparent" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Track Order
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {order && currentStatus && (
        <div className="mt-8 space-y-6">
          {/* Status Banner */}
          <div className={`rounded-2xl border p-6 ${currentStatus.bgColor}`}>
            <div className="flex items-center gap-3">
              <div className={currentStatus.color}>{currentStatus.icon}</div>
              <div>
                <p className={`font-semibold ${currentStatus.color}`}>{currentStatus.label}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Order {order.orderNumber}
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-neutral-500 dark:text-neutral-400">Order Date</p>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-neutral-500 dark:text-neutral-400">Total</p>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">{formatPrice(order.total, order.currency)}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
            <h2 className="font-semibold mb-4">Order Items</h2>
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
                      {item.size ? `Size: ${item.size} · ` : ""}
                      Qty: {item.quantity} × {formatPrice(item.unitPrice, order.currency)}
                    </p>
                  </div>
                  <p className="font-medium">{formatPrice(item.lineTotal, order.currency)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-2">
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

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
              <h2 className="font-semibold mb-4">Shipping Address</h2>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  {(order.shippingAddress as ShippingAddress).fullName}
                </p>
                <p>{(order.shippingAddress as ShippingAddress).address1}</p>
                {(order.shippingAddress as ShippingAddress).address2 && (
                  <p>{(order.shippingAddress as ShippingAddress).address2}</p>
                )}
                <p>
                  {(order.shippingAddress as ShippingAddress).city},{" "}
                  {(order.shippingAddress as ShippingAddress).state}
                </p>
                <p>{(order.shippingAddress as ShippingAddress).country}</p>
              </div>
            </div>
          )}

          {/* Order Timeline */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
            <h2 className="font-semibold mb-4">Order Timeline</h2>
            <div className="space-y-0">
              {timeline.map((step, index) => (
                <div key={step.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        step.done
                          ? "bg-green-500"
                          : "bg-neutral-300 dark:bg-neutral-700"
                      } ${step.current ? "ring-4 ring-green-500/20" : ""}`}
                    />
                    {index < timeline.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 ${
                          step.done ? "bg-green-500/50" : "bg-neutral-200 dark:bg-neutral-700"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <p
                      className={`font-medium text-sm ${
                        step.done
                          ? "text-neutral-900 dark:text-neutral-100"
                          : "text-neutral-400 dark:text-neutral-500"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {step.description}
                    </p>
                    {step.done && step.date && (
                      <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">
                        {formatDate(step.date)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {order.deliveryNotes && (
              <div className="mt-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-4">
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                  Delivery Notes
                </p>
                <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                  {order.deliveryNotes}
                </p>
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-6 text-center">
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
      )}

      {/* Footer Links */}
      {!order && (
        <div className="mt-8 text-center">
          <Link href="/shop" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition">
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
