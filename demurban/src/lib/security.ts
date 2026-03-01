import { z } from "zod";

/**
 * Safe error response - no stack traces, no sensitive info
 */
export function safeErrorResponse(error: unknown, statusCode: number = 400) {
  let message = "An error occurred";

  if (error instanceof z.ZodError) {
    message = `Validation error: ${error.errors[0]?.message || "Invalid input"}`;
  } else if (error instanceof Error) {
    // Don't expose stack traces in production
    message = error.message;
    if (process.env.NODE_ENV === "production") {
      message = "Request failed. Please try again.";
    }
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

  // Clean old entries
  fraudStore[ip] = (fraudStore[ip] || []).filter((t) => t.timestamp > oneMinuteAgo);
  fraudStore[email] = (fraudStore[email] || []).filter((t) => t.timestamp > oneHourAgo);

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
