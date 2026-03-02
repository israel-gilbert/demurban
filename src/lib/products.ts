// Blog mock content (replace with CMS/MDX later)
export type Post = { slug: string; title: string; excerpt: string; body: string; date: string };

const POSTS: Post[] = [
  {
    slug: "the-minimal-wardrobe",
    title: "The Minimal Wardrobe: A Practical System",
    excerpt: "How to build a small set of pieces that rotate cleanly across contexts.",
    body: "This is placeholder content. Replace with MDX later.",
    date: "2026-02-01",
  },
  {
    slug: "fabric-basics",
    title: "Fabric Basics: What Actually Matters",
    excerpt: "A short guide to feel, weight, care, and how it impacts longevity.",
    body: "This is placeholder content. Replace with MDX later.",
    date: "2026-02-10",
  },
];

export function getPosts(): Post[] {
  return POSTS;
}

export function getPostBySlug(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
