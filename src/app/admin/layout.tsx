import Link from "next/link";

export const metadata = {
  title: "DemUrban Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/admin/products" className="font-display text-lg tracking-wide">
            DemUrban Admin
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            View site
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
