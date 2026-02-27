import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    title: "DemUrban Minimal Tee",
    slug: "demurban-minimal-tee-black",
    description: "A clean, heavyweight tee built for repeat wear. Minimal branding, strong drape.",
    category: "MEN",
    price_kobo: 18000 * 100,
    compare_at_kobo: 22000 * 100,
    tags: ["new", "cotton"],
    images: [
      "/products/tee-1.svg",
      "/products/tee-2.svg",
      "/products/tee-3.svg",
    ],
    inventory_qty: 25,
  },
  {
    title: "DemUrban Structured Hoodie",
    slug: "demurban-structured-hoodie-stone",
    description: "Structured hoodie with a premium feel. Warm, breathable, and built for Lagos evenings.",
    category: "MEN",
    price_kobo: 42000 * 100,
    tags: ["best-seller", "fleece"],
    images: ["/products/hoodie-1.svg", "/products/hoodie-2.svg"],
    inventory_qty: 12,
  },
  {
    title: "DemUrban Utility Overshirt",
    slug: "demurban-utility-overshirt-olive",
    description: "Layer-ready overshirt with utility pockets. Works as jacket or shirt depending on the day.",
    category: "WOMEN",
    price_kobo: 52000 * 100,
    tags: ["limited"],
    images: ["/products/overshirt-1.svg", "/products/overshirt-2.svg"],
    inventory_qty: 8,
  },
  {
    title: "DemUrban Minimal Cap",
    slug: "demurban-minimal-cap-graphite",
    description: "Everyday cap with subtle detail. One-size adjustable strap.",
    category: "KIDS",
    price_kobo: 12000 * 100,
    tags: ["essentials"],
    images: ["/products/cap-1.svg"],
    inventory_qty: 40,
  },
];

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
