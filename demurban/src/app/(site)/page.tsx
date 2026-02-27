import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { fetchProducts } from "@/lib/server-actions";

export const revalidate = 3600;

export default async function HomePage() {
  const products = await fetchProducts({ limit: 4 });

  return (
    <div className="py-10 md:py-14">
      <section className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">DemUrban</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.05] md:text-5xl">
            Clean pieces. Strong identity.
          </h1>
          <p className="mt-4 text-base leading-6 text-zinc-600">
            A minimal fashion storefront with real checkout via Paystack.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-5 text-sm font-medium text-white hover:bg-zinc-900"
            >
              Shop collection
            </Link>
            <Link
              href="/about"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 px-5 text-sm font-medium text-zinc-950 hover:bg-zinc-50"
            >
              About
            </Link>
          </div>
        </div>

        <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/products/tee-1.svg"
              alt="DemUrban"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mt-12 md:mt-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold">Featured</h2>
          <Link href="/shop" className="text-sm text-zinc-600 hover:text-zinc-950">
            View all
          </Link>
        </div>
        <div className="mt-5">
          <ProductGrid products={products} />
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 md:mt-16 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="text-lg font-semibold">Join the list</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Product drops, editorial notes, and early access.
            </p>
          </div>
          <form className="flex gap-3">
            <input
              type="email"
              placeholder="Email address"
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none ring-zinc-950/10 focus:ring-4"
            />
            <button
              type="button"
              className="h-11 shrink-0 rounded-xl bg-zinc-950 px-5 text-sm font-medium text-white hover:bg-zinc-900"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
