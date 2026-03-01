import type { NextRequest } from "next/server";

// Simple in-memory rate limiter for MVP
// For production, use Upstash Redis with distributed rate limiting
interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

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
