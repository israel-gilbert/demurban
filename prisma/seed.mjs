import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  {
    title: "DemUrban Minimal Tee",
    slug: "demurban-minimal-tee-black",
    description: "A clean, heavyweight tee built for repeat wear. Minimal branding, strong drape.",
    collection: "LATEST_DROP",
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
    collection: "LATEST_DROP",
    price_kobo: 42000 * 100,
    tags: ["best-seller", "fleece"],
    images: ["/products/hoodie-1.svg", "/products/hoodie-2.svg"],
    inventory_qty: 12,
  },
  {
    title: "DemUrban Utility Overshirt",
    slug: "demurban-utility-overshirt-olive",
    description: "Layer-ready overshirt with utility pockets. Works as jacket or shirt depending on the day.",
    collection: "LATEST_DROP",
    price_kobo: 52000 * 100,
    tags: ["limited"],
    images: ["/products/overshirt-1.svg", "/products/overshirt-2.svg"],
    inventory_qty: 8,
  },
  {
    title: "DemUrban Minimal Cap",
    slug: "demurban-minimal-cap-graphite",
    description: "Everyday cap with subtle detail. One-size adjustable strap.",
    collection: "LATEST_DROP",
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

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const password_hash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { password_hash, role: "ADMIN" },
      create: { email: adminEmail, password_hash, role: "ADMIN" },
    });
    console.log(`Seeded admin user: ${adminEmail}`);
  } else {
    console.log("ADMIN_EMAIL/ADMIN_PASSWORD not set; skipping admin user seed.");
  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
