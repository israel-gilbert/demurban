import Link from "next/link";
import { getPosts } from "@/lib/products";

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div className="py-10 md:py-14">
      <h1 className="text-2xl font-semibold">Blog</h1>
      <p className="mt-2 text-sm text-zinc-600">Editorial notes and releases.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="rounded-2xl border border-zinc-200 p-5 hover:bg-zinc-50"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">{p.date}</p>
            <h2 className="mt-2 text-lg font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 line-clamp-2">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
