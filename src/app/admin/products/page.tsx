"use client";

import { useEffect, useState } from "react";

interface ProductVariant {
  id: string;
  size: string;
  inventory_qty: number;
  price_kobo: number | null;
  active: boolean;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  collection: string;
  price_kobo: number;
  compare_at_kobo: number | null;
  currency: string;
  inventory_qty: number;
  active: boolean;
  tags: string[];
  images: string[];
  variants: ProductVariant[];
  created_at: string;
}

function formatPrice(amount: number, currency: string = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount / 100);
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    collection: "LATEST_DROP",
    price_kobo: "",
    compare_at_kobo: "",
    currency: "NGN",
    inventory_qty: "",
    active: true,
    tags: "",
    images: [] as string[],
    variants: [] as Array<{
      size: string;
      inventory_qty: string;
      price_kobo: string;
      active: boolean;
    }>,
  });
  const [uploading, setUploading] = useState(false);

  const fetchProducts = () => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      collection: "LATEST_DROP",
      price_kobo: "",
      compare_at_kobo: "",
      currency: "NGN",
      inventory_qty: "",
      active: true,
      tags: "",
      images: [],
      variants: [],
    });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      slug: product.slug,
      description: product.description || "",
      collection: product.collection,
      price_kobo: product.price_kobo.toString(),
      compare_at_kobo: product.compare_at_kobo?.toString() || "",
      currency: product.currency,
      inventory_qty: product.inventory_qty.toString(),
      active: product.active,
      tags: (product.tags || []).join(", "),
      images: product.images || [],
      variants: (product.variants || []).map((v) => ({
        size: v.size,
        inventory_qty: v.inventory_qty.toString(),
        price_kobo: v.price_kobo?.toString() || "",
        active: v.active,
      })),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingProduct
      ? `/api/admin/products/${editingProduct.id}`
      : "/api/admin/products";

    const method = editingProduct ? "PUT" : "POST";

    const tagsArray = formData.tags
      ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const body = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description || null,
      collection: formData.collection,
      price_kobo: parseInt(formData.price_kobo),
      compare_at_kobo: formData.compare_at_kobo
        ? parseInt(formData.compare_at_kobo)
        : null,
      currency: formData.currency,
      inventory_qty: parseInt(formData.inventory_qty) || 0,
      active: formData.active,
      tags: tagsArray,
      images: formData.images,
      variants: formData.variants.map((v) => ({
        size: v.size,
        inventory_qty: v.inventory_qty,
        price_kobo: v.price_kobo || null,
        active: v.active,
      })),
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setShowModal(false);
      fetchProducts();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchProducts();
    }
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { size: "", inventory_qty: "", price_kobo: "", active: true },
      ],
    });
  };

  const updateVariant = (index: number, field: string, value: string | boolean) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  const standardSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-400">Loading products...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-neutral-400 mt-1">{products.length} products total</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors"
        >
          Add Product
        </button>
      </div>

      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          {products.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-neutral-400 border-b border-neutral-800">
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Collection</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Inventory</th>
                  <th className="px-6 py-4 font-medium">Variants</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-neutral-800 last:border-0"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0">
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-600">
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{product.title}</p>
                          <p className="text-neutral-500 text-sm">/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-neutral-800 rounded-full text-xs text-neutral-300">
                        {product.collection}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white">
                      {formatPrice(product.price_kobo, product.currency)}
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      {product.inventory_qty}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.variants && product.variants.length > 0 ? (
                          product.variants.map((v) => (
                            <span
                              key={v.id}
                              className={`px-2 py-0.5 rounded text-xs ${
                                v.active && v.inventory_qty > 0
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {v.size} ({v.inventory_qty})
                            </span>
                          ))
                        ) : (
                          <span className="text-neutral-500 text-xs">No variants</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.active
                            ? "bg-green-500/20 text-green-400"
                            : "bg-neutral-500/20 text-neutral-400"
                        }`}
                      >
                        {product.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-neutral hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-neutral-400">
              No products found. Create your first product to get started.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {editingProduct ? "Edit Product" : "Create Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-neutral-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Collection
                  </label>
                  <select
                    value={formData.collection}
                    onChange={(e) =>
                      setFormData({ ...formData, collection: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <option value="LATEST_DROP">Latest Drop</option>
                    <option value="ARCHIVE">Archive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Currency
                  </label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Base Price (kobo)
                  </label>
                  <input
                    type="number"
                    value={formData.price_kobo}
                    onChange={(e) =>
                      setFormData({ ...formData, price_kobo: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Compare at Price (kobo)
                  </label>
                  <input
                    type="number"
                    value={formData.compare_at_kobo}
                    onChange={(e) =>
                      setFormData({ ...formData, compare_at_kobo: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Total Inventory (all sizes)
                  </label>
                  <input
                    type="number"
                    value={formData.inventory_qty}
                    onChange={(e) =>
                      setFormData({ ...formData, inventory_qty: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="new, featured, sale"
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>

                {/* Product Variants Section */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-neutral-300">
                      Size Variants
                    </label>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="px-3 py-1 text-sm bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors"
                    >
                      + Add Size
                    </button>
                  </div>

                  {/* Quick add standard sizes */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {standardSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          if (!formData.variants.find((v) => v.size === size)) {
                            setFormData({
                              ...formData,
                              variants: [
                                ...formData.variants,
                                { size, inventory_qty: "", price_kobo: "", active: true },
                              ],
                            });
                          }
                        }}
                        className="px-3 py-1 text-xs bg-neutral-800 text-neutral-400 rounded hover:bg-neutral-700 transition-colors"
                      >
                        + {size}
                      </button>
                    ))}
                  </div>

                  {formData.variants.length > 0 && (
                    <div className="space-y-3">
                      {formData.variants.map((variant, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg"
                        >
                          <div className="w-24">
                            <label className="block text-xs text-neutral-400 mb-1">Size</label>
                            <input
                              type="text"
                              value={variant.size}
                              onChange={(e) => updateVariant(index, "size", e.target.value)}
                              placeholder="S, M, L..."
                              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-white"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-neutral-400 mb-1">Quantity</label>
                            <input
                              type="number"
                              value={variant.inventory_qty}
                              onChange={(e) => updateVariant(index, "inventory_qty", e.target.value)}
                              placeholder="0"
                              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-white"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-neutral-400 mb-1">Price (kobo)</label>
                            <input
                              type="number"
                              value={variant.price_kobo}
                              onChange={(e) => updateVariant(index, "price_kobo", e.target.value)}
                              placeholder="Leave empty for base price"
                              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-white"
                            />
                          </div>
                          <div className="flex items-center gap-2 pt-5">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={variant.active}
                                onChange={(e) => updateVariant(index, "active", e.target.checked)}
                                className="w-4 h-4 rounded border-neutral-700 bg-neutral-800"
                              />
                              <span className="text-xs text-neutral-400">Active</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => removeVariant(index)}
                              className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {formData.variants.length === 0 && (
                    <p className="text-sm text-neutral-500 text-center py-4">
                      No size variants added. Click "+ Add Size" or use the quick add buttons above.
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Product Images
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-neutral-800 border border-neutral-700 border-dashed rounded-lg text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{uploading ? "Uploading..." : "Click to upload images"}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          multiple
                          className="hidden"
                          disabled={uploading}
                          onChange={async (e) => {
                            const files = e.target.files;
                            if (!files) return;
                            setUploading(true);
                            try {
                              for (const file of Array.from(files)) {
                                const fd = new FormData();
                                fd.append("file", file);
                                const res = await fetch("/api/admin/upload", {
                                  method: "POST",
                                  body: fd,
                                });
                                if (res.ok) {
                                  const data = await res.json();
                                  setFormData((prev) => ({
                                    ...prev,
                                    images: [...prev.images, data.url],
                                  }));
                                }
                              }
                            } catch (err) {
                              console.error("Upload failed:", err);
                            } finally {
                              setUploading(false);
                              e.target.value = "";
                            }
                          }}
                        />
                      </label>
                    </div>
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-3">
                        {formData.images.map((url, idx) => (
                          <div key={idx} className="relative group aspect-square bg-neutral-800 rounded-lg overflow-hidden">
                            <img src={url} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  images: prev.images.filter((_, i) => i !== idx),
                                }))
                              }
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) =>
                        setFormData({ ...formData, active: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-white"
                    />
                    <span className="text-sm text-neutral-300">
                      Product is active
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors"
                >
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}