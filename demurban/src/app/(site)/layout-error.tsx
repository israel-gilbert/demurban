"use client";

import Link from "next/link";

export default function LayoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("[v0] Layout error:", error);

  return (
    <html>
      <body>
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Layout Error</h1>
            <p className="mt-2 text-muted-foreground">{error.message || "An error occurred in the layout"}</p>
            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={reset}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-red-600 px-6 text-sm font-semibold text-white"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
