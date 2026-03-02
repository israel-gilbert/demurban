/**
 * Import products from a CSV you control.
 *
 * Why CSV:
 * - Avoid scraping Instagram (terms/copyright risks)
 * - Lets your VA curate product titles/prices/variants + upload images to Cloudinary/Firebase Storage
 *
 * CSV columns (header required):
 * title,slug,description,collection,price_naira,compare_at_naira,tags,images,inventory_qty,active
 * - collection: latest|archive (optional; defaults to latest)
 * - tags: pipe-separated, e.g. "new|best-seller"
 * - images: pipe-separated absolute URLs (recommended), or site-relative paths
 */

import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function parseCsvLine(line) {
  // Minimal CSV parsing (handles quoted fields + commas).
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

async function main() {
  const csvPath = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve("./scripts/products.csv");
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV not found at: ${csvPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(csvPath, "utf8");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    console.error("CSV must include header + at least 1 row");
    process.exit(1);
  }

  const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const required = ["title", "slug", "price_naira", "images"]; 
  for (const r of required) {
    if (!(r in idx)) {
      console.error(`Missing required column: ${r}`);
      process.exit(1);
    }
  }

  let count = 0;
  for (let li = 1; li < lines.length; li++) {
    const cols = parseCsvLine(lines[li]);
    const title = cols[idx.title];
    const slug = cols[idx.slug];
    const description = idx.description != null ? cols[idx.description] : "";
    const collection = idx.collection != null ? (cols[idx.collection] || "latest") : "latest";
    const priceNaira = Number(cols[idx.price_naira] || 0);
    const compareAtNaira = idx.compare_at_naira != null ? Number(cols[idx.compare_at_naira] || 0) : 0;
    const tags = idx.tags != null && cols[idx.tags] ? cols[idx.tags].split("|").map((t) => t.trim()).filter(Boolean) : [];
    const images = cols[idx.images].split("|").map((u) => u.trim()).filter(Boolean);
    const inventoryQty = idx.inventory_qty != null ? Number(cols[idx.inventory_qty] || 0) : 0;
    const active = idx.active != null ? (String(cols[idx.active]).toLowerCase() !== "false") : true;

    if (!title || !slug || !Number.isFinite(priceNaira) || images.length === 0) {
      console.warn(`Skipping row ${li + 1}: missing/invalid required fields`);
      continue;
    }

    await prisma.product.upsert({
      where: { slug },
      update: {
        title,
        description: description || null,
        collection: String(collection).toLowerCase() === "archive" ? "ARCHIVE" : "LATEST_DROP",
        price_kobo: Math.round(priceNaira * 100),
        compare_at_kobo: compareAtNaira ? Math.round(compareAtNaira * 100) : null,
        tags,
        images,
        inventory_qty: inventoryQty,
        active,
      },
      create: {
        title,
        slug,
        description: description || null,
        collection: String(collection).toLowerCase() === "archive" ? "ARCHIVE" : "LATEST_DROP",
        price_kobo: Math.round(priceNaira * 100),
        compare_at_kobo: compareAtNaira ? Math.round(compareAtNaira * 100) : null,
        tags,
        images,
        inventory_qty: inventoryQty,
        active,
      },
    });
    count++;
  }

  console.log(`Imported/updated ${count} products from ${path.basename(csvPath)}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
