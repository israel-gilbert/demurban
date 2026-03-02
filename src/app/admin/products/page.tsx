"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";

type ProductCollection = "LATEST_DROP" | "ARCHIVE";

type Product = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  collection: ProductCollection;
  price_kobo: number;
  compare_at_kobo?: number | null;
  inventory_qty: number;
  active: boolean;
  tags: string[];
  images: string[];
  updated_at: string;
};

function formatNaira(kobo: number) {
  const naira = kobo / 100;
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(naira);
}

async function uploadToCloudinary(files: File[]) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary env vars not set: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
  }

  const urls: string[] = [];

  for (const file of files) {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", uploadPreset);
    form.append("folder", "demurban/products");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Cloudinary upload failed: ${t}`);
    }

    const json = await res.json();
    urls.push(json.secure_url);
  }

  return urls;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim();
    if (!query) return products;
    return products.filter((p) =>
      [p.title, p.slug, p.collection, ...(p.tags || [])].join(" ").toLowerCase().includes(query)
    );
  }, [products, q]);

  // Form
  const [editing, setEditing] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [collection, setCollection] = useState<ProductCollection>("LATEST_DROP");
  const [price, setPrice] = useState<number>(0);
  const [compareAt, setCompareAt] = useState<number | "">("");
  const [inventory, setInventory] = useState<number>(0);
  const [active, setActive] = useState(true);
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const load = async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/products", { cache: "no-store" });
    if (res.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    if (!res.ok) {
      setError("Failed to load products");
      setLoading(false);
      return;
    }
    const json = await res.json();
    setProducts(json.products);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setTitle("");
    setSlug("");
    setCollection("LATEST_DROP");
    setPrice(0);
    setCompareAt("");
    setInventory(0);
    setActive(true);
    setTags("");
    setDescription("");
    setImageFiles([]);
    setExistingImages([]);
  };

  const openCreate = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setTitle(p.title);
    setSlug(p.slug);
    setCollection(p.collection);
    setPrice(Math.round(p.price_kobo / 100));
    setCompareAt(p.compare_at_kobo ? Math.round(p.compare_at_kobo / 100) : "");
    setInventory(p.inventory_qty);
    setActive(p.active);
    setTags((p.tags || []).join(","));
    setDescription(p.description || "");
    setExistingImages(p.images || []);
    setImageFiles([]);
    setFormOpen(true);
  };

  const createSlugFromTitle = (t: string) =>
    t
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const onTitleBlur = () => {
    if (!slug && title) setSlug(createSlugFromTitle(title));
  };

  const onSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const uploaded = imageFiles.length ? await uploadToCloudinary(imageFiles) : [];
      const images = [...existingImages, ...uploaded];

      const payload = {
        title,
        slug,
        collection,
        price_kobo: Math.round(price * 100),
        compare_at_kobo: compareAt === "" ? null : Math.round(Number(compareAt) * 100),
        inventory_qty: inventory,
        active,
        tags: tags
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        description: description || null,
        images,
      };

      const res = await fetch(editing ? `/api/admin/products/${editing.id}` : "/api/admin/products", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || "Failed to save product");
      }

      setFormOpen(false);
      resetForm();
      await load();
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;

    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    if (!res.ok) {
      alert("Failed to delete product");
      return;
    }
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, edit, upload images, and delete products.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openCreate}
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Add product
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
          placeholder="Search by title, slug, tag..."
        />
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Drop Status</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                    Loading...
                  </td>
                </tr>
              ) : filtered.length ? (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3">
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs text-muted-foreground">{p.slug}</div>
                    </td>
                    <td className="px-4 py-3">{p.collection}</td>
                    <td className="px-4 py-3">{formatNaira(p.price_kobo)}</td>
                    <td className="px-4 py-3">{p.active ? "Yes" : "No"}</td>
                    <td className="px-4 py-3">
                      {new Date(p.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(p.id)}
                          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-600 hover:bg-red-500/15"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-background p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{editing ? "Edit product" : "Add product"}</h2>
                <p className="text-sm text-muted-foreground">Upload images to Cloudinary and save.</p>
              </div>
              <button
                onClick={() => {
                  setFormOpen(false);
                  resetForm();
                }}
                className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={onTitleBlur}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Slug</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                  placeholder="demurban-black-tee"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Drop Status</label>
                <select
                  value={collection}
                  onChange={(e) => setCollection(e.target.value as ProductCollection)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="LATEST_DROP">Latest Drop</option>
                  <option value="ARCHIVE">Archive</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Inventory qty</label>
                <input
                  value={inventory}
                  onChange={(e) => setInventory(Number(e.target.value || 0))}
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Price (₦)</label>
                <input
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value || 0))}
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Compare-at price (₦)</label>
                <input
                  value={compareAt}
                  onChange={(e) => setCompareAt(e.target.value === "" ? "" : Number(e.target.value))}
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                  placeholder="new,best-seller,limited"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Images</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {existingImages.map((url) => (
                    <div key={url} className="group relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-16 w-16 rounded-lg object-cover border border-border" />
                      <button
                        type="button"
                        onClick={() => setExistingImages(existingImages.filter((u) => u !== url))}
                        className="absolute -right-2 -top-2 hidden rounded-full bg-black/70 px-2 py-1 text-xs text-white group-hover:block"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                  className="mt-3 block w-full text-sm"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  New uploads are sent to Cloudinary when you click Save.
                </p>
              </div>

              <div className="md:col-span-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                  />
                  Active
                </label>

                <button
                  onClick={onSave}
                  disabled={saving}
                  className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
