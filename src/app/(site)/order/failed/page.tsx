import Link from "next/link";

export default function OrderFailedPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-4 py-10 text-center md:py-14">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
        <svg
          className="h-8 w-8 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
        Payment not completed
      </h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        If you were charged, contact support with your email and payment reference.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/checkout"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-neutral-950 px-5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          Try again
        </Link>
        <Link
          href="/contact"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-300 px-5 text-sm font-medium text-neutral-950 hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
        >
          Contact support
        </Link>
      </div>
    </div>
  );
}
