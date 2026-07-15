"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface OrderItem {
  id: string;
  title_snapshot: string;
  size_snapshot: string | null;
  quantity: number;
  unit_price_kobo: number;
  line_total_kobo: number;
  product: {
    id: string;
    title: string;
    slug: string;
    images: string[];
  };
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  currency: string;
  subtotal_kobo: number;
  shipping_kobo: number;
  total_kobo: number;
  customer_email: string;
  customer_phone: string | null;
  shipping_address_json: {
    fullName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };
  tracking_number: string | null;
  delivery_notes: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  paid_at: string | null;
  created_at: string;
  items: OrderItem[];
}

function formatPrice(amount: number, currency: string = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount / 100);
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-400",
    PAID: "bg-green-500/20 text-green-400",
    PROCESSING: "bg-blue-500/20 text-blue-400",
    IN_TRANSIT: "bg-purple-500/20 text-purple-400",
    DELIVERED: "bg-emerald-500/20 text-emerald-400",
    FAILED: "bg-red-500/20 text-red-400",
    CANCELLED: "bg-neutral-500/20 text-neutral-400",
    REFUNDED: "bg-orange-500/20 text-orange-400",
  };
  return colors[status] || "bg-neutral-500/20 text-neutral-400";
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    params.set("page", page.toString());

    fetch(`/api/admin/orders?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setLoading(false);
      })
      .catch(() => {
        setOrders([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, page]);

  const updateOrderStatus = async (orderId: string, newStatus: string, trackingNumber?: string, deliveryNotes?: string) => {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        status: newStatus,
        trackingNumber,
        deliveryNotes
      }),
    });

    if (res.ok) {
      fetchOrders();
      setShowDetailModal(false);
    }
  };

  const openOrderDetail = async (order: Order) => {
    // Fetch full order details
    const res = await fetch(`/api/admin/orders/${order.id}`);
    if (res.ok) {
      const data = await res.json();
      setSelectedOrder(data.order);
      setShowDetailModal(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-400">Loading orders...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-neutral-400 mt-1">Manage customer orders and delivery</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending Payment</option>
          <option value="PAID">Paid</option>
          <option value="PROCESSING">Processing</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="DELIVERED">Delivered</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          {orders.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-neutral-400 border-b border-neutral-800">
                  <th className="px-6 py-4 font-medium">Order</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Items</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Payment</th>
                  <th className="px-6 py-4 font-medium">Delivery</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/50"
                  >
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openOrderDetail(order)}
                        className="text-white hover:text-neutral-300 font-medium"
                      >
                        #{order.order_number.slice(0, 8)}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white">{order.customer_email}</p>
                        {order.customer_phone && (
                          <p className="text-neutral-500 text-sm">
                            {order.customer_phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {formatPrice(order.total_kobo, order.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status === "PAID" || order.status === "PROCESSING" || order.status === "IN_TRANSIT" || order.status === "DELIVERED" ? "PAID" : order.status)}`}>
                        {order.status === "PAID" || order.status === "PROCESSING" || order.status === "IN_TRANSIT" || order.status === "DELIVERED" ? "PAID" : order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status === "PENDING" || order.status === "PAID" ? "Awaiting" : order.status === "PROCESSING" ? "Processing" : order.status === "IN_TRANSIT" ? "Shipped" : order.status === "DELIVERED" ? "Delivered" : order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openOrderDetail(order)}
                        className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors inline-block"
                        title="View details"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-neutral-400">
              No orders found
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-6 border-t border-neutral-800">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-neutral-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-neutral-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-neutral-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedOrder(null);
          }}
          onUpdateStatus={updateOrderStatus}
        />
      )}
    </div>
  );
}

function OrderDetailModal({ 
  order, 
  onClose, 
  onUpdateStatus 
}: { 
  order: Order; 
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: string, trackingNumber?: string, deliveryNotes?: string) => void;
}) {
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || "");
  const [deliveryNotes, setDeliveryNotes] = useState(order.delivery_notes || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdateStatus(order.id, status, trackingNumber || undefined, deliveryNotes || undefined);
    setSaving(false);
  };

  const shippingAddress = order.shipping_address_json;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between sticky top-0 bg-neutral-900 z-10">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Order #{order.order_number}
            </h2>
            <p className="text-neutral-400 text-sm mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-800/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-neutral-400 mb-3">Customer</h3>
              <p className="text-white">{order.customer_email}</p>
              {order.customer_phone && (
                <p className="text-neutral-400 text-sm mt-1">{order.customer_phone}</p>
              )}
            </div>
            <div className="bg-neutral-800/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-neutral-400 mb-3">Shipping Address</h3>
              <div className="text-white text-sm">
                <p className="font-medium">{shippingAddress.fullName}</p>
                <p className="text-neutral-400">{shippingAddress.address1}</p>
                {shippingAddress.address2 && (
                  <p className="text-neutral-400">{shippingAddress.address2}</p>
                )}
                <p className="text-neutral-400">
                  {shippingAddress.city}, {shippingAddress.state}
                </p>
                <p className="text-neutral-400">{shippingAddress.country}</p>
                {shippingAddress.postalCode && (
                  <p className="text-neutral-400">{shippingAddress.postalCode}</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-sm font-medium text-neutral-400 mb-3">Order Items</h3>
            <div className="bg-neutral-800/50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-neutral-500 border-b border-neutral-700">
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-neutral-700 last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-neutral-700 rounded overflow-hidden flex-shrink-0">
                            {item.product.images && item.product.images[0] ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.title_snapshot}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-white text-sm">{item.title_snapshot}</p>
                            <Link
                              href={`/admin/products/${item.product.id}`}
                              className="text-neutral-500 text-xs hover:text-white"
                            >
                              Edit Product
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-neutral-300 text-sm">
                        {item.size_snapshot || "-"}
                      </td>
                      <td className="px-4 py-3 text-neutral-300 text-sm text-center">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-neutral-300 text-sm text-right">
                        {formatPrice(item.unit_price_kobo, order.currency)}
                      </td>
                      <td className="px-4 py-3 text-white text-sm text-right font-medium">
                        {formatPrice(item.line_total_kobo, order.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 border-t border-neutral-700">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Subtotal</span>
                    <span className="text-white">{formatPrice(order.subtotal_kobo, order.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Shipping</span>
                    <span className="text-white">{order.shipping_kobo === 0 ? "Free" : formatPrice(order.shipping_kobo, order.currency)}</span>
                  </div>
                  <div className="flex justify-between text-base font-medium pt-2 border-t border-neutral-700">
                    <span className="text-white">Total</span>
                    <span className="text-white">{formatPrice(order.total_kobo, order.currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Management */}
          <div className="bg-neutral-800/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-neutral-400 mb-4">Delivery Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-300 mb-2">Order Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <option value="PENDING">Pending Payment</option>
                  <option value="PAID">Paid</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="FAILED">Failed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-2">Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-neutral-300 mb-2">Delivery Notes</label>
                <textarea
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Add delivery notes (optional)"
                  rows={2}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white resize-none"
                />
              </div>
            </div>

            {/* Timestamps */}
            <div className="mt-4 pt-4 border-t border-neutral-700 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-neutral-500">Paid:</span>
                <span className="text-white ml-2">
                  {order.paid_at ? new Date(order.paid_at).toLocaleDateString() : "-"}
                </span>
              </div>
              <div>
                <span className="text-neutral-500">Shipped:</span>
                <span className="text-white ml-2">
                  {order.shipped_at ? new Date(order.shipped_at).toLocaleDateString() : "-"}
                </span>
              </div>
              <div>
                <span className="text-neutral-500">Delivered:</span>
                <span className="text-white ml-2">
                  {order.delivered_at ? new Date(order.delivered_at).toLocaleDateString() : "-"}
                </span>
              </div>
              <div>
                <span className="text-neutral-500">Tracking:</span>
                <span className="text-white ml-2">
                  {order.tracking_number || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-neutral-800 flex items-center justify-end gap-4 sticky bottom-0 bg-neutral-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}