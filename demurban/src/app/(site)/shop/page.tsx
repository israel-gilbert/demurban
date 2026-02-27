import { Suspense } from "react";
import CollectionTabs from "@/components/CollectionTabs";
import ProductGrid from "@/components/ProductGrid";
import { fetchProductsByCollection } from "@/lib/server-actions";

export const revalidate = 3600;

interface ShopPageProps {
  searchParams: Promise<{ collection?: string }>;
}

function CollectionTabsSkeleton() {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-10 w-24 rounded-xl bg-zinc-200 animate-pulse" />
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className="rounded-2xl border border-zinc-200 bg-zinc-50 h-96 animate-pulse"
        />
      ))}
    </div>
  );
}

async function ShopContent({ collection }: { collection: string }) {
  const products = await fetchProductsByCollection(collection);

  return (
    <div className="mt-6">
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center">
          <p className="text-sm text-zinc-600">No products found.</p>
        </div>
      )}
    </div>
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { collection = "all" } = await searchParams;

  return (
    <div className="py-10 md:py-14">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">Shop</h1>
        <p className="text-sm text-zinc-600">Browse DemUrban pieces by category.</p>
      </div>

      <div className="mt-6">
        <Suspense fallback={<CollectionTabsSkeleton />}>
          <CollectionTabs
            value={collection}
            tabs={[
              { label: "All", value: "all" },
              { label: "Men", value: "men" },
              { label: "Women", value: "women" },
              { label: "Kids", value: "kids" },
            ]}
          />
        </Suspense>
      </div>

      <Suspense fallback={<ProductGridSkeleton />}>
        <ShopContent collection={collection} />
      </Suspense>
    </div>
  );
}
