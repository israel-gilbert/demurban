import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

// Initialize distributed Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const RATE_LIMITS = {
  checkout: { requests: 5, window: 300_000 },
  checkoutEmail: { requests: 3, window: 600_000 },
  paystackInit: { requests: 10, window: 300_000 },
  paystackCallback: { requests: 20, window: 60_000 },
  webhook: { requests: 100, window: 60_000 },
  orderTrack: { requests: 10, window: 60_000 },
  globalIp: { requests: 100, window: 60_000 },
} as const;

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
 * Distributed Rate limit check using Redis
 */
export async function rateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Date.now();
  
  // Increment the key. If it doesn't exist, Redis sets it to 1.
  const currentCount = await redis.incr(key);
  
  // If this is the first request, set the expiration window
  if (currentCount === 1) {
    await redis.pexpire(key, config.window);
  }

  // Fetch the exact TTL remaining to calculate reset times
  const ttl = await redis.pttl(key);
  const resetTime = now + (ttl > 0 ? ttl : config.window);

  if (currentCount <= config.requests) {
    return {
      success: true,
      remaining: config.requests - currentCount,
      resetTime,
    };
  }

  return {
    success: false,
    remaining: 0,
    resetTime,
    retryAfter: Math.ceil((ttl > 0 ? ttl : config.window) / 1000),
  };
}

/**
 * Check multiple rate limits at once (e.g., IP + email)
 */
export async function rateLimitMultiple(
  checks: Array<{ key: string; config: RateLimitConfig }>
): Promise<RateLimitResult> {
  const results = await Promise.all(
    checks.map(({ key, config }) => rateLimit(key, config))
  );

  const failed = results.filter((r) => !r.success);
  if (failed.length > 0) {
    return failed.reduce((a, b) =>
      (a.retryAfter || 0) > (b.retryAfter || 0) ? a : b
    );
  }

  return results.reduce((a, b) => (a.remaining < b.remaining ? a : b));
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded ? forwarded.split(",")[0].trim() : realIp || "unknown";
}

export function getUserIdentifier(body: any): string | null {
  if (typeof body === "object" && body?.email) {
    return String(body.email).toLowerCase();
  }
  return null;
}

export function createCheckoutRateLimitKeys(ip: string, email: string) {
  return {
    ipKey: `checkout:ip:${ip}`,
    emailKey: `checkout:email:${email.toLowerCase()}`,
  };
}

export function createPaymentRateLimitKey(reference: string) {
  return `payment:ref:${reference}`;
}