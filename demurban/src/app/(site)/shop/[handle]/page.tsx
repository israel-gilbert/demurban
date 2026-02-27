import Link from "next/link";
import { fetchProductBySlug, fetchProducts } from "@/lib/server-actions";
import { formatMoney } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGrid from "@/components/ProductGrid";

export const revalidate = 3600;

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await fetchProductBySlug(handle);

  if (!product) {
    return (
      <div className="py-10 md:py-14">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <p className="mt-2 text-sm text-zinc-600">The product may be unavailable.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-5 text-sm font-medium text-white hover:bg-zinc-900"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const available = product.inventory_qty > 0;
  const related = (await fetchProducts({ limit: 8 })).filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="py-10 md:py-14">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images?.[0] ?? "/products/tee-1.svg"}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images?.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((src) => (
                <div key={src} className="aspect-square overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">{product.category}</p>
          <h1 className="mt-3 text-3xl font-semibold leading-[1.05] md:text-4xl">{product.title}</h1>

          <div className="mt-4 flex items-center gap-3">
            <p className="text-lg font-semibold">{formatMoney(product.price_kobo, product.currency)}</p>
            {product.compare_at_kobo ? (
              <p className="text-sm text-zinc-500 line-through">
                {formatMoney(product.compare_at_kobo, product.currency)}
              </p>
            ) : null}
            {!available ? (
              <span className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] text-zinc-600">
                Sold out
              </span>
            ) : null}
          </div>

          <p className="mt-5 text-sm leading-6 text-zinc-600">
            {product.description ?? "Clean essentials designed for repeat wear."}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
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
              className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 px-5 text-sm font-medium text-zinc-950 hover:bg-zinc-50"
            >
              View cart
            </Link>
          </div>

          <div className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
            <h2 className="text-sm font-semibold">Details</h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>Material: premium everyday blend</li>
              <li>Care: cold wash, low heat</li>
              <li>Warranty: 7-day issue reporting</li>
            </ul>
          </div>

          <div className="mt-6 grid gap-3 rounded-2xl border border-zinc-200 p-6">
            <div className="text-sm">
              <p className="font-semibold">Secure payments</p>
              <p className="text-zinc-600">Paystack handles card payments. We confirm orders by email.</p>
            </div>
            <div className="text-sm">
              <p className="font-semibold">Tracking</p>
              <p className="text-zinc-600">Dispatch updates within 24–48 hours after payment.</p>
            </div>
            <div className="text-sm">
              <p className="font-semibold">Returns</p>
              <p className="text-zinc-600">Returns accepted on unworn items within policy window.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold">You may also like</h2>
          <Link href="/shop" className="text-sm text-zinc-600 hover:text-zinc-950">
            View all
          </Link>
        </div>
        <div className="mt-5">
          <ProductGrid products={related} />
        </div>
      </section>
    </div>
  );
}
