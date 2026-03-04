import Link from "next/link";
import { fetchProductBySlug, fetchProducts } from "@/lib/server-actions";
import { formatNGNFromKobo } from "@/lib/money";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGrid from "@/components/ProductGrid";
import { ArrowLeft } from "lucide-react";

export const revalidate = 3600;

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await fetchProductBySlug(handle);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14 lg:px-8">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Product not found</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">The product may be unavailable.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-6 text-sm font-semibold hover:opacity-90 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </Link>
      </div>
    );
  }

  const available = product.inventory_qty > 0;
  const related = (await fetchProducts({ limit: 8 })).filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14 lg:px-8">
      <Link
        href="/shop"
        className="text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-50 transition"
      >
        ← Back to shop
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-[3/4] overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 bg-neutral-100 dark:bg-neutral-900">
            <img
              src={product.images?.[0] ?? "/images/dem4.jpg"}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>

          {product.images?.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((src) => (
                <div
                  key={src}
                  className="aspect-square overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 bg-neutral-100 dark:bg-neutral-900"
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
            {product.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-semibold">
                ₦
              </span>
              <div className="leading-tight">
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Price</div>
                <div className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                  {formatNGNFromKobo(product.price_kobo)}
                </div>
              </div>
            </div>

            {product.compare_at_kobo ? (
              <div className="text-sm text-neutral-500 dark:text-neutral-400 line-through">
                {formatNGNFromKobo(product.compare_at_kobo)}
              </div>
            ) : null}

            {!available ? (
              <span className="rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-950/40 px-3 py-1 text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                Sold out
              </span>
            ) : null}
          </div>

          <p className="mt-6 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            {product.description ?? "Premium streetwear designed for those who refuse to blend in."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <AddToCartButton
              product={{
                id: product.id,
                slug: product.slug,
                title: product.title,
                price_kobo: product.price_kobo,
                currency: product.currency,
                image: product.images?.[0],
              }}
              disabled={!available}
            />

            <Link
              href="/cart"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 px-6 text-sm font-semibold text-neutral-900 dark:text-neutral-50 hover:opacity-90 transition"
            >
              View Cart
            </Link>
          </div>

          {/* Details */}
          <div className="mt-10 rounded-3xl border border-black/5 dark:border-white/10 bg-neutral-100 dark:bg-neutral-900 p-6 md:p-7">
            <h2 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Details</h2>
            <ul className="mt-4 space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
              <li className="flex justify-between">
                <span>Material:</span> <span className="text-neutral-900 dark:text-neutral-50">Premium blend</span>
              </li>
              <li className="flex justify-between">
                <span>Care:</span> <span className="text-neutral-900 dark:text-neutral-50">Cold wash, low heat</span>
              </li>
              <li className="flex justify-between">
                <span>Warranty:</span> <span className="text-neutral-900 dark:text-neutral-50">7-day issue reporting</span>
              </li>
            </ul>
          </div>

          {/* Info Grid */}
          <div className="mt-6 space-y-4 rounded-3xl border border-black/5 dark:border-white/10 bg-neutral-100 dark:bg-neutral-900 p-6 md:p-7">
            <div className="text-sm">
              <p className="font-semibold text-neutral-900 dark:text-neutral-50">Secure Payments</p>
              <p className="mt-1 text-neutral-600 dark:text-neutral-400">Paystack handles all transactions securely.</p>
            </div>
            <div className="border-t border-black/5 dark:border-white/10 pt-4 text-sm">
              <p className="font-semibold text-neutral-900 dark:text-neutral-50">Fast Dispatch</p>
              <p className="mt-1 text-neutral-600 dark:text-neutral-400">Shipping updates within 24–48 hours.</p>
            </div>
            <div className="border-t border-black/5 dark:border-white/10 pt-4 text-sm">
              <p className="font-semibold text-neutral-900 dark:text-neutral-50">Easy Returns</p>
              <p className="mt-1 text-neutral-600 dark:text-neutral-400">Hassle-free returns on unworn items.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16 md:mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              You May Also Like
            </h2>
            <Link
              href="/shop"
              className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50 transition"
            >
              View all
            </Link>
          </div>

          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}