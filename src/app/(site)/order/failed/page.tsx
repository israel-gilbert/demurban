import Link from "next/link";

export default function OrderFailedPage() {
  return (
    <div className="py-10 md:py-14">
      <h1 className="text-2xl font-semibold">Payment not completed</h1>
      <p className="mt-2 text-sm text-zinc-600">
        If you were charged, contact support with your email and payment reference.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/checkout"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-5 text-sm font-medium text-white hover:bg-zinc-900"
        >
          Try again
        </Link>
        <Link
          href="/contact"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 px-5 text-sm font-medium text-zinc-950 hover:bg-zinc-50"
        >
          Contact support
        </Link>
      </div>
    </div>
  );
}
