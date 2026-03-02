import type { NextRequest } from "next/server";

// Simple in-memory rate limiter for MVP
// For production, use Upstash Redis with distributed rate limiting
interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

// Basic guardrails against unbounded in-memory growth
// In a long-lived process this keeps the store from growing without bound
// Longer term this should be replaced with an external store (e.g., Redis/Upstash)
const MAX_STORE_SIZE = 10_000;
const SWEEP_INTERVAL_MS = 60_000; // 1 minute

function sweepStore(now = Date.now()) {
  // Remove expired entries
  const entries = Object.entries(store);
  for (const [key, value] of entries) {
    if (value.resetTime <= now) {
      delete store[key];
    }
  }

  // Enforce max size by evicting oldest entries by resetTime
  const keys = Object.keys(store);
  if (keys.length <= MAX_STORE_SIZE) return;

  const remainingEntries = Object.entries(store)
    .sort(([, a], [, b]) => a.resetTime - b.resetTime); // oldest first

  const targetSize = Math.floor(MAX_STORE_SIZE * 0.75); // Keep 75% to avoid thrashing
  const toDelete = remainingEntries.slice(0, Math.max(0, remainingEntries.length - targetSize));
  for (const [key] of toDelete) {
    delete store[key];
  }
}

// Periodically sweep in the background to avoid unbounded growth
// In serverless environments this will only run while the process is alive
if (typeof setInterval === "function") {
  const interval = setInterval(() => {
    sweepStore();
  }, SWEEP_INTERVAL_MS);

  // Avoid keeping the event loop alive just for the sweeper in Node.js
  interval.unref?.();
}

export interface RateLimitConfig {
  requests: number;
  window: number; // in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Simple in-memory rate limiter
 * For distributed systems, use Upstash Redis
 */
export async function rateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Date.now();
  const entry = store[key];

  // Clean up expired entries
  if (entry && now > entry.resetTime) {
    delete store[key];
  }

  // Opportunistically sweep if store is getting large
  if (Object.keys(store).length > MAX_STORE_SIZE * 0.9) {
    sweepStore(now);
  }

  if (!store[key]) {
    store[key] = { count: 1, resetTime: now + config.window };
    return {
      success: true,
      remaining: config.requests - 1,
      resetTime: store[key].resetTime,
    };
  }

  const current = store[key];
  if (current.count < config.requests) {
    current.count++;
    return {
      success: true,
      remaining: config.requests - current.count,
      resetTime: current.resetTime,
    };
  }

  return {
    success: false,
    remaining: 0,
    resetTime: current.resetTime,
    retryAfter: Math.ceil((current.resetTime - now) / 1000),
  };
}

/**
 * Get client IP from request
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded ? forwarded.split(",")[0].trim() : realIp || "unknown";
}

/**
 * Extract user identifier (email) if available
 */
export function getUserIdentifier(body: any): string | null {
  if (typeof body === "object" && body?.email) {
    return String(body.email).toLowerCase();
  }
  return null;
}
