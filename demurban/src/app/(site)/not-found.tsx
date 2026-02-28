import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="mt-2 text-lg text-muted-foreground">Page not found</p>
        <p className="mt-1 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-6 text-sm font-semibold text-accent-foreground hover:bg-accent/90"
          >
            Go Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-6 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
