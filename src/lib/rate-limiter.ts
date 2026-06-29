import type { NextRequest } from "next/server";

/**
 * PRODUCTION-GRADE RATE LIMITER
 * 
 * Features:
 * - Per-IP rate limiting
 * - Per-email rate limiting (prevents same email from multiple accounts)
 * - Per-reference rate limiting (prevents duplicate payment processing)
 * - Distributed-safe design (ready for Redis/Upstash upgrade)
 * - Automatic cleanup to prevent memory leaks
 */

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

// Configuration
const MAX_STORE_SIZE = 10_000;
const SWEEP_INTERVAL_MS = 60_000; // 1 minute

// Rate limit configurations for different endpoints
export const RATE_LIMITS = {
  // Checkout creation: 5 attempts per 5 minutes per IP
  checkout: { requests: 5, window: 300_000 },
  
  // Checkout per email: 3 attempts per 10 minutes
  checkoutEmail: { requests: 3, window: 600_000 },
  
  // Paystack initialization: 10 attempts per 5 minutes per IP
  paystackInit: { requests: 10, window: 300_000 },
  
  // Paystack callback: 20 attempts per minute per IP
  paystackCallback: { requests: 20, window: 60_000 },
  
  // Webhook processing: 100 attempts per minute per IP (Paystack retries)
  webhook: { requests: 100, window: 60_000 },
  
  // Order tracking: 10 attempts per minute per IP
  orderTrack: { requests: 10, window: 60_000 },
  
  // Global per-IP: 100 requests per minute (catch-all)
  globalIp: { requests: 100, window: 60_000 },
} as const;

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
    .sort(([, a], [, b]) => a.resetTime - b.resetTime);

  const targetSize = Math.floor(MAX_STORE_SIZE * 0.75);
  const toDelete = remainingEntries.slice(0, Math.max(0, remainingEntries.length - targetSize));
  for (const [key] of toDelete) {
    delete store[key];
  }
}

// Periodically sweep in the background
if (typeof setInterval === "function") {
  const interval = setInterval(() => {
    sweepStore();
  }, SWEEP_INTERVAL_MS);

  interval.unref?.();
}

export interface RateLimitConfig {
  requests: number;
  window: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Rate limit check with automatic key prefixing
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
 * Check multiple rate limits at once (e.g., IP + email)
 * Returns the most restrictive result
 */
export async function rateLimitMultiple(
  checks: Array<{ key: string; config: RateLimitConfig }>
): Promise<RateLimitResult> {
  const results = await Promise.all(
    checks.map(({ key, config }) => rateLimit(key, config))
  );

  // Return the most restrictive result
  const failed = results.filter((r) => !r.success);
  if (failed.length > 0) {
    // Return the one with the longest retry after
    return failed.reduce((a, b) => 
      (a.retryAfter || 0) > (b.retryAfter || 0) ? a : b
    );
  }

  // All passed - return the one with least remaining
  return results.reduce((a, b) => a.remaining < b.remaining ? a : b);
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

/**
 * Create a rate limit key for checkout with both IP and email
 */
export function createCheckoutRateLimitKeys(ip: string, email: string) {
  return {
    ipKey: `checkout:ip:${ip}`,
    emailKey: `checkout:email:${email.toLowerCase()}`,
  };
}

/**
 * Create a rate limit key for payment reference
 * Prevents duplicate processing of the same payment
 */
export function createPaymentRateLimitKey(reference: string) {
  return `payment:ref:${reference}`;
}