import { PrismaClient } from "@prisma/client";
import { neon } from "@neondatabase/serverless";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma = global.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.__prisma = prisma;

// Direct Neon SQL client for raw queries (search, etc.)
export const sql = neon(process.env.DATABASE_URL!);
