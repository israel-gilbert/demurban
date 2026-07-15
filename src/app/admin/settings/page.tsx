"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingNaira, setShippingNaira] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setShippingNaira(String((data.shipping_fee_kobo ?? 0) / 100));
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load settings");
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const naira = parseFloat(shippingNaira);
    if (!Number.isFinite(naira) || naira < 0) {
      setError("Enter a valid shipping fee (0 or more)");
      setSaving(false);
      return;
    }

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shipping_fee_kobo: Math.round(naira * 100) }),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Failed to save settings");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-neutral-400 mt-1">Store-wide configuration</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl bg-neutral-900 rounded-xl border border-neutral-800 p-6 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Shipping Fee (₦)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={shippingNaira}
            onChange={(e) => setShippingNaira(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
          />
          <p className="mt-2 text-sm text-neutral-500">
            Flat fee added to every order at checkout. Set to 0 for free shipping.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saved && <span className="text-sm text-green-400">Saved ✓</span>}
        </div>
      </form>
    </div>
  );
}
