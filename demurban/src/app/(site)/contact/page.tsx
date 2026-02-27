export default function ContactPage() {
  return (
    <div className="py-10 md:py-14">
      <h1 className="text-2xl font-semibold">Contact</h1>
      <p className="mt-2 text-sm text-zinc-600">We typically respond within 24–48 hours.</p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <form className="rounded-2xl border border-zinc-200 p-6">
          <div className="grid gap-4">
            <input
              className="h-11 rounded-xl border border-zinc-200 px-4 text-sm outline-none ring-zinc-950/10 focus:ring-4"
              placeholder="Name"
            />
            <input
              className="h-11 rounded-xl border border-zinc-200 px-4 text-sm outline-none ring-zinc-950/10 focus:ring-4"
              placeholder="Email"
              type="email"
            />
            <input
              className="h-11 rounded-xl border border-zinc-200 px-4 text-sm outline-none ring-zinc-950/10 focus:ring-4"
              placeholder="Subject"
            />
            <textarea
              className="min-h-[140px] rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none ring-zinc-950/10 focus:ring-4"
              placeholder="Message"
            />
            <button
              type="button"
              className="h-11 rounded-xl bg-zinc-950 px-5 text-sm font-medium text-white hover:bg-zinc-900"
            >
              Send
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
          <h2 className="text-sm font-semibold">Details</h2>
          <div className="mt-3 space-y-2 text-sm text-zinc-600">
            <p>Email: support@wearix-lite.com</p>
            <p>Instagram: @wearix</p>
            <p>Lagos / Remote</p>
          </div>
        </div>
      </div>
    </div>
  );
}
