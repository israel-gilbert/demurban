"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  products: { total: number; active: number };
  orders: { total: number; pending: number; paid: number };
  revenue: { total: number };
  subscribers: { total: number; active: number };
  recentOrders: Array<{
    id: string;
    order_number: string;
    status: string;
    total_kobo: number;
    currency: string;
    customer_email: string;
    created_at: string;
  }>;
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
    FAILED: "bg-red-500/20 text-red-400",
    CANCELLED: "bg-neutral-500/20 text-neutral-400",
    FULFILLED: "bg-blue-500/20 text-blue-400",
    REFUNDED: "bg-purple-500/20 text-purple-400",
  };
  return colors[status] || "bg-neutral-500/20 text-neutral-400";
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-neutral-400 mt-1">Welcome back! Here's your store overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Total Products</p>
              <p className="text-3xl font-bold text-white mt-1">{stats?.products.total || 0}</p>
            </div>
            <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-neutral-500 mt-4">{stats?.products.active || 0} active products</p>
        </div>

        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-white mt-1">{stats?.orders.total || 0}</p>
            </div>
            <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-yellow-400 mt-4">{stats?.orders.pending || 0} pending orders</p>
        </div>

        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-white mt-1">
                {formatPrice(stats?.revenue.total || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-green-400 mt-4">{stats?.orders.paid || 0} paid orders</p>
        </div>

        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Subscribers</p>
              <p className="text-3xl font-bold text-white mt-1">{stats?.subscribers.total || 0}</p>
            </div>
            <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-neutral-500 mt-4">{stats?.subscribers.active || 0} active</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800">
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-neutral-400 hover:text-white transition-colors">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-neutral-400 border-b border-neutral-800">
                  <th className="px-6 py-4 font-medium">Order</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-800 last:border-0">
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="text-white hover:text-neutral-300">
                        #{order.order_number.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-neutral-300">{order.customer_email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white">{formatPrice(order.total_kobo, order.currency)}</td>
                    <td className="px-6 py-4 text-neutral-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-neutral-400">
              No orders yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}