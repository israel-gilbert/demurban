import Link from "next/link";
import { fetchProductBySlug, fetchProducts } from "@/lib/server-actions";
import { formatMoney } from "@/lib/format";
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
        <h1 className="text-2xl font-semibold text-foreground">Product not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The product may be unavailable.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-accent px-6 text-sm font-medium text-background hover:bg-accent/90"
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
      <Link href="/shop" className="text-sm text-accent hover:text-accent/80 font-medium">
        ← Back to shop
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-muted">
            <img
              src={product.images?.[0] ?? "/images/placeholder.jpg"}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images?.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((src) => (
                <div key={src} className="aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-bold">{product.category}</p>
              <h1 className="mt-3 text-3xl font-bold leading-[1.05] md:text-4xl font-[var(--font-oswald)] uppercase">
                {product.title}
              </h1>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <p className="text-2xl font-bold text-foreground">{formatMoney(product.price_kobo, product.currency)}</p>
            {product.compare_at_kobo ? (
              <p className="text-sm text-muted-foreground line-through">
                {formatMoney(product.compare_at_kobo, product.currency)}
              </p>
            ) : null}
            {!available ? (
              <span className="rounded-lg border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                Sold out
              </span>
            ) : null}
          </div>

          <p className="mt-6 text-sm leading-7 text-muted-foreground">
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
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-6 text-sm font-medium text-foreground hover:bg-muted hover:border-accent/30"
            >
              View Cart
            </Link>
          </div>

          {/* Details */}
          <div className="mt-10 rounded-lg border border-border bg-muted/50 p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider">Details</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex justify-between"><span>Material:</span> <span className="text-foreground">Premium blend</span></li>
              <li className="flex justify-between"><span>Care:</span> <span className="text-foreground">Cold wash, low heat</span></li>
              <li className="flex justify-between"><span>Warranty:</span> <span className="text-foreground">7-day issue reporting</span></li>
            </ul>
          </div>

          {/* Info Grid */}
          <div className="mt-6 space-y-3 rounded-lg border border-border p-6">
            <div className="text-sm">
              <p className="font-bold">Secure Payments</p>
              <p className="mt-1 text-muted-foreground">Paystack handles all transactions securely.</p>
            </div>
            <div className="border-t border-border pt-3 text-sm">
              <p className="font-bold">Fast Dispatch</p>
              <p className="mt-1 text-muted-foreground">Shipping updates within 24–48 hours.</p>
            </div>
            <div className="border-t border-border pt-3 text-sm">
              <p className="font-bold">Easy Returns</p>
              <p className="mt-1 text-muted-foreground">Hassle-free returns on unworn items.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16 md:mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold uppercase tracking-wider font-[var(--font-oswald)]">You May Also Like</h2>
            <Link href="/shop" className="text-sm font-medium text-accent hover:text-accent/80">
              View all
            </Link>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
