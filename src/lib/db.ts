import { PrismaClient } from "@prisma/client";
import { neon } from "@neondatabase/serverless";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
  var __sql: ReturnType<typeof neon> | undefined;
}

export const prisma = global.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.__prisma = prisma;

// Lazy-load Neon SQL client - only initialize when actually needed at runtime
export function getSql() {
  if (!global.__sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    global.__sql = neon(process.env.DATABASE_URL);
  }
  return global.__sql;
}
