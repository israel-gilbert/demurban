import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatMoney } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const available = product.inventory_qty > 0;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50"
    >
      <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images?.[0] ?? "/products/tee-1.svg"}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium leading-5">{product.title}</p>
            <p className="mt-1 text-xs text-zinc-600">DemUrban</p>
          </div>
          {!available ? (
            <span className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] text-zinc-600">
              Sold out
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <p className="text-sm font-semibold">{formatMoney(product.price_kobo, product.currency)}</p>
          {product.compare_at_kobo ? (
            <p className="text-xs text-zinc-500 line-through">
              {formatMoney(product.compare_at_kobo, product.currency)}
            </p>
          ) : null}
        </div>

        {product.tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] text-zinc-600"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
