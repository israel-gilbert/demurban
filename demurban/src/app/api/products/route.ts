import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limiter";
import { logSecurityEvent } from "@/lib/security";

// Strict allowlist for collection parameter
const ALLOWED_COLLECTIONS = new Set([
  "all",
  "new",
  "trending",
  "essentials",
  "limited",
  "seasonal",
  "bestsellers",
]);

const QuerySchema = z.object({
  collection: z.string().max(50).default("all"),
});

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);

  try {
    // Rate limiting: 100 requests per 60 seconds (generous for public read)
    const rateLimitKey = `products:${clientIp}`;
    const rateLimitResult = await rateLimit(rateLimitKey, {
      requests: 100,
      window: 60000,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.retryAfter || 60),
          },
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const rawCollection = searchParams.get("collection") ?? "all";

    // Validate collection parameter (strict allowlist)
    const parsed = QuerySchema.parse({ collection: rawCollection });
    const collection = parsed.collection.toLowerCase();

    if (!ALLOWED_COLLECTIONS.has(collection)) {
      logSecurityEvent("invalid_collection_param", {
        collection,
        ip: clientIp,
      });
      // Return empty products instead of rejecting (fail gracefully)
      return NextResponse.json(
        { products: [] },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          },
        }
      );
    }

    const where: any = { active: true };

    // Map collection names to filter logic
    if (collection !== "all") {
      if (collection === "new") {
        where.tags = { has: "new" };
      } else if (collection === "trending") {
        where.tags = { has: "trending" };
      } else if (collection === "essentials") {
        where.tags = { has: "essentials" };
      } else if (collection === "limited") {
        where.tags = { has: "limited" };
      } else if (collection === "seasonal") {
        where.tags = { has: "seasonal" };
      } else if (collection === "bestsellers") {
        where.tags = { has: "bestsellers" };
      }
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { created_at: "desc" },
      take: 100, // Limit result set
    });

    return NextResponse.json(
      { products },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      logSecurityEvent("products_validation_error", {
        error: err.errors[0]?.message,
        ip: clientIp,
      });
      return NextResponse.json({ products: [] }, { status: 400 });
    }

    logSecurityEvent("products_error", {
      error: err?.message,
      ip: clientIp,
    });

    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
