import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 1. ADD THIS INTERFACE
export interface FraudSignals {
  ipVelocity: number;
  emailVelocity: number;
  failureCount: number;
  isHighRisk: boolean;
}

// 2. ADD 'export' TO THIS FUNCTION
export function logSecurityEvent(eventType: string, data: Record<string, any> = {}) {
  const sanitized = {
    ...data,
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
 * Checks fraud signals using distributed Redis counters
 */
export async function checkFraudSignals(
  ip: string,
  email: string,
  failureCount: number = 0
): Promise<FraudSignals> {
  const ipKey = `fraud:ip:${ip}`;
  const emailKey = `fraud:email:${email.toLowerCase()}`;

  const ipVelocity = (await redis.get<number>(ipKey)) || 0;
  const emailVelocity = (await redis.get<number>(emailKey)) || 0;

  logSecurityEvent("fraud_signal_check", {
    ip,
    email: email.substring(0, 5) + "***",
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
 * Records a payment attempt and increments velocity counters in Redis
 */
export async function recordPaymentAttempt(ip: string, email: string) {
  const ipKey = `fraud:ip:${ip}`;
  const emailKey = `fraud:email:${email.toLowerCase()}`;

  await redis.incr(ipKey);
  await redis.pexpire(ipKey, 60000);

  await redis.incr(emailKey);
  await redis.pexpire(emailKey, 3600000);
}