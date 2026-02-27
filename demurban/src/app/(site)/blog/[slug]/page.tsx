import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/products";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();

  return (
    <article className="py-10 md:py-14">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">{post.date}</p>
        <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">{post.excerpt}</p>
      </header>

      <div className="mt-8 max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="prose prose-zinc max-w-none">
          <p>{post.body}</p>
        </div>
      </div>
    </article>
  );
}
