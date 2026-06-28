"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, CreditCard, User, MapPin, Clock, Save, ChevronDown } from "lucide-react";

interface Product {
  id: string;
  title: string;
  slug: string;
  images: string[];
}

interface OrderItem {
  id: string;
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  variant: Record<string, unknown> | null;
  product: Product;
}

interface PaymentEvent {
  id: string;
  reference: string;
  eventType: string;
  payload: unknown;
  createdAt: string;
}

interface ShippingAddress {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
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
  customerPhone: string | null;
  shippingAddress: ShippingAddress;
  paystackReference: string;
  paystackTransactionId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  paymentEvents: PaymentEvent[];
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  PENDING: {
    label: "Pending",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  PAID: {
    label: "Paid",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  FAILED: {
    label: "Failed",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
  FULFILLED: {
    label: "Fulfilled",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  REFUNDED: {
    label: "Refunded",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
  },
};

const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "FULFILLED", label: "Fulfilled" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
];

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

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/admin/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("Order not found");
        }
        const data = await response.json();
        setOrder(data.order);
        setSelectedStatus(data.order.status);
      } catch (error) {
        console.error("Error fetching order:", error);
        router.push("/admin/orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  const handleStatusUpdate = async () => {
    if (!order || selectedStatus === order.status) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus, note }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const data = await response.json();
      setOrder(data.order);
      setNote("");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Loading order...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Order not found</p>
        <Link href="/admin/orders" className="mt-4 text-primary hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  const currentStatus = statusConfig[order.status];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/admin/orders")}
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${currentStatus.bgColor} ${currentStatus.color}`}
          >
            {currentStatus.label}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold">Order Items</h2>
            </div>
            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-6">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {item.product?.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × {formatPrice(item.unitPrice, order.currency)}
                    </p>
                    {item.variant && typeof item.variant === "object" && Object.keys(item.variant).length > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {Object.entries(item.variant as Record<string, string>).map(([key, value]) => (
                          <span key={key} className="mr-2">
                            {key}: {value}
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                  <p className="font-medium">{formatPrice(item.lineTotal, order.currency)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border px-6 py-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.subtotal, order.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping, order.currency)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.total, order.currency)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Events Timeline */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold">Order Timeline</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.paymentEvents.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                      {index < order.paymentEvents.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">
                        {event.eventType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(event.createdAt)}
                      </p>
                      {event.reference && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Ref: {event.reference}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Update Status */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold">Update Status</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Status</label>
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-border bg-background px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Note (optional)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note about this status change..."
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  onClick={handleStatusUpdate}
                  disabled={saving || selectedStatus === order.status}
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Save className="h-4 w-4" />
                      Update Status
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold">Customer Information</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                  </div>
                </div>
                {order.customerPhone && (
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Paystack Reference</p>
                    <p className="text-sm text-muted-foreground break-all">{order.paystackReference}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold">Shipping Address</h2>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p className="text-muted-foreground">{order.shippingAddress.address1}</p>
                  {order.shippingAddress.address2 && (
                    <p className="text-muted-foreground">{order.shippingAddress.address2}</p>
                  )}
                  <p className="text-muted-foreground">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                  <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                  {order.shippingAddress.postalCode && (
                    <p className="text-muted-foreground">{order.shippingAddress.postalCode}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold">Order Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Total</span>
                  <span className="font-medium">{formatPrice(order.total, order.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span>{order.items.length}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Created {formatDate(order.createdAt)}</span>
                </div>
                {order.paidAt && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span>Paid {formatDate(order.paidAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}