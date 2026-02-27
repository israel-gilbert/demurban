import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm md:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold">WEARIX</p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Minimal storefront scaffold. Swap data layer later.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:col-span-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">Shop</p>
              <div className="mt-3 space-y-2">
                <Link className="block text-zinc-600 hover:text-zinc-950" href="/shop">
                  All products
                </Link>
                <Link className="block text-zinc-600 hover:text-zinc-950" href="/shop/new">
                  New
                </Link>
                <Link className="block text-zinc-600 hover:text-zinc-950" href="/shop/essentials">
                  Essentials
                </Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">Company</p>
              <div className="mt-3 space-y-2">
                <Link className="block text-zinc-600 hover:text-zinc-950" href="/about">
                  About
                </Link>
                <Link className="block text-zinc-600 hover:text-zinc-950" href="/blog">
                  Blog
                </Link>
                <Link className="block text-zinc-600 hover:text-zinc-950" href="/contact">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-zinc-200 pt-6 text-xs text-zinc-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Wearix Lite</p>
          <div className="flex gap-4">
            <Link className="hover:text-zinc-950" href="/policies/privacy">
              Privacy
            </Link>
            <Link className="hover:text-zinc-950" href="/policies/returns">
              Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
