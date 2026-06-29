import { z } from "zod";

/**
 * Known user-facing error messages that are safe to show to customers.
 * Any error NOT in this set is treated as an internal error and hidden.
 */
const SAFE_ERROR_MESSAGES: Record<string, string> = {
  "Invalid total amount": "Order total is invalid. Please refresh and try again.",
  "Sold out": "One or more items in your cart are sold out. Please remove them and try again.",
  "Invalid product": "A product in your cart could not be found. Please refresh and try again.",
};

/**
 * Safe error response - no stack traces, no Prisma internals, no sensitive info.
 * Only whitelisted, user-friendly messages are ever returned to the client.
 */
export function safeErrorResponse(error: unknown) {
  let message = "Something went wrong. Please try again.";

  if (error instanceof z.ZodError) {
    const field = error.errors[0]?.path?.join(".") || "input";
    message = `Invalid ${field}. Please check your details and try again.`;
  } else if (error instanceof Error) {
    // Check if this is a known safe error we can show the user
    const knownKey = Object.keys(SAFE_ERROR_MESSAGES).find(
      (k) => error.message.startsWith(k) || error.message.includes(k)
    );
    if (knownKey) {
      message = SAFE_ERROR_MESSAGES[knownKey];
    }
    // All other Error messages (Prisma, internal, etc.) are hidden from users
  }

  return {
    error: message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Structured logging without PII or secrets
 */
export function logSecurityEvent(
  eventType: string,
  data: Record<string, any> = {}
) {
  const sanitized = {
    ...data,
    // Remove sensitive fields
    password: undefined,
    token: undefined,
    secret: undefined,
    card: undefined,
    cvv: undefined,
  };

  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    eventType,
    ...sanitized,
    env: process.env.NODE_ENV,
  }));
}

/**
 * Validate that amount hasn't been tampered with
 */
export function validateAmount(
  clientAmount: number,
  serverAmount: number,
  tolerance: number = 0 // No tolerance for payment amounts
): boolean {
  return Math.abs(clientAmount - serverAmount) <= tolerance;
}

/**
 * Rate limit fraud signals
 */
export interface FraudSignals {
  ipVelocity: number;
  emailVelocity: number;
  failureCount: number;
  isHighRisk: boolean;
}

const fraudStore: Record<string, { timestamp: number; count: number }[]> = {};
const MAX_FRAUD_STORE_SIZE = 10_000;
const FRAUD_SWEEP_INTERVAL_MS = 60_000; // 1 minute

/**
 * Sweep stale entries from fraud store to prevent unbounded growth
 */
function sweepFraudStore(now = Date.now()) {
  const oneHourAgo = now - 3600000;

  // Remove expired entries for all keys by rebuilding the array
  const entries = Object.entries(fraudStore);
  for (const [key, value] of entries) {
    // Rebuild array with only non-expired entries to avoid splice index issues
    fraudStore[key] = value.filter((t) => t.timestamp > oneHourAgo);
    
    // Remove key if empty
    if (fraudStore[key].length === 0) {
      delete fraudStore[key];
    }
  }

  // Enforce max store size by counting total entries (not just keys)
  let totalEntries = 0;
  for (const values of Object.values(fraudStore)) {
    totalEntries += values.length;
  }

  if (totalEntries <= MAX_FRAUD_STORE_SIZE) return;

  // Collect all entries and sort by timestamp, oldest first
  const allEntries: Array<[string, number, number]> = [];
  for (const [key, values] of Object.entries(fraudStore)) {
    for (let i = 0; i < values.length; i++) {
      allEntries.push([key, i, values[i].timestamp]);
    }
  }

  allEntries.sort(([, , a], [, , b]) => a - b); // oldest first
  const targetSize = Math.floor(MAX_FRAUD_STORE_SIZE * 0.75); // Keep 75% to avoid thrashing
  const toDelete = allEntries.slice(0, Math.max(0, allEntries.length - targetSize));

  // Delete from end to start so indices remain valid
  toDelete.reverse();
  for (const [key, idx] of toDelete) {
    if (fraudStore[key]?.[idx]) {
      fraudStore[key].splice(idx, 1);
      if (fraudStore[key].length === 0) {
        delete fraudStore[key];
      }
    }
  }
}

// Periodically sweep fraud store in the background
if (typeof setInterval === "function") {
  const interval = setInterval(() => {
    sweepFraudStore();
  }, FRAUD_SWEEP_INTERVAL_MS);

  // Avoid keeping event loop alive in Node.js
  interval.unref?.();
}

/**
 * Track fraud signals (IP velocity, email velocity)
 */
export function checkFraudSignals(
  ip: string,
  email: string,
  failureCount: number = 0
): FraudSignals {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  const oneHourAgo = now - 3600000;

  // Clean old entries and opportunistically sweep if store is large
  fraudStore[ip] = (fraudStore[ip] || []).filter((t) => t.timestamp > oneMinuteAgo);
  fraudStore[email] = (fraudStore[email] || []).filter((t) => t.timestamp > oneHourAgo);

  // Check total entries, not just keys
  let totalEntries = 0;
  for (const values of Object.values(fraudStore)) {
    totalEntries += values.length;
  }

  if (totalEntries > MAX_FRAUD_STORE_SIZE * 0.9) {
    sweepFraudStore(now);
  }

  const ipVelocity = fraudStore[ip]?.length || 0;
  const emailVelocity = fraudStore[email]?.length || 0;

  // Log signals
  logSecurityEvent("fraud_signal_check", {
    ip,
    email: email.substring(0, 5) + "***", // Partial email only
    ipVelocity,
    emailVelocity,
    failureCount,
  });

  return {
    ipVelocity,
    emailVelocity,
    failureCount,
    isHighRisk:
      ipVelocity > parseInt(process.env.FRAUD_VELOCITY_LIMIT || "5") ||
      emailVelocity > parseInt(process.env.FRAUD_EMAIL_VELOCITY_LIMIT || "3") ||
      failureCount > 2,
  };
}

/**
 * Record a payment attempt for fraud tracking
 */
export function recordPaymentAttempt(ip: string, email: string) {
  fraudStore[ip] = fraudStore[ip] || [];
  fraudStore[email] = fraudStore[email] || [];

  fraudStore[ip].push({ timestamp: Date.now(), count: 1 });
  fraudStore[email].push({ timestamp: Date.now(), count: 1 });
}

/**
 * Validate CSRF token (simplified implementation)
 */
export function validateCsrfToken(
  requestToken: string | null,
  sessionToken: string | null
): boolean {
  if (!process.env.NEXT_PUBLIC_CSRF_ENABLED || process.env.NEXT_PUBLIC_CSRF_ENABLED === "false") {
    return true; // CSRF disabled
  }

  if (!requestToken || !sessionToken) {
    return false;
  }

  return requestToken === sessionToken;
}
