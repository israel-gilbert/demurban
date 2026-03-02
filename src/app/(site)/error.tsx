"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("[v0] Error caught in error.tsx:", error);

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">{error.message || "An unexpected error occurred"}</p>
        {error.digest && (
          <p className="mt-1 text-xs text-muted-foreground">Error ID: {error.digest}</p>
        )}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-6 text-sm font-semibold text-accent-foreground hover:bg-accent/90"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-6 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
