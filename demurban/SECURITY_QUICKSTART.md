# DEM Urban Security Hardening - Quick Start Guide

## TL;DR - What Changed?

Your ecommerce app has been hardened against OWASP Top 10 vulnerabilities with a focus on payment security.

**3 Critical Issues Fixed:**
1. ✅ Rate limiting on checkout (prevents DDoS/enumeration)
2. ✅ Security headers (prevents XSS/clickjacking)
3. ✅ Webhook idempotency (prevents double-charging)

---

## Installation (5 minutes)

### 1. Update Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local

# Edit .env.local:
DATABASE_URL="postgresql://..." # Your database URL
PAYSTACK_SECRET_KEY="sk_live_..." # Your Paystack key
PAYSTACK_PUBLIC_KEY="pk_live_..." # Your Paystack public key
APP_URL="https://yourdomain.com" # Your production URL
NODE_ENV="production"
```

### 2. No New Dependencies for MVP

The implementation uses only existing dependencies (zod, next, prisma).

**Optional** for production distributed rate limiting:
```bash
npm install upstash-ratelimit   # For Upstash Redis (optional)
```

### 3. Update Database Schema

```bash
npx prisma migrate dev --name add_payment_indices
# Or in production:
npx prisma migrate deploy
```

### 4. Test Security Headers

```bash
npm run dev
# In another terminal:
curl -I http://localhost:3000
# Should see: Content-Security-Policy, Strict-Transport-Security, etc.
```

---

## Key Features

### 🚨 Rate Limiting
- **10 requests per 60 seconds per IP** on checkout/payment endpoints
- Returns `HTTP 429` with `Retry-After` header
- Prevents spam, DDoS, order enumeration

### 🔐 Security Headers
- **Content-Security-Policy** (CSP) - Prevents inline script injection
- **Strict-Transport-Security** (HSTS) - Forces HTTPS
- **X-Frame-Options** - Prevents clickjacking
- **X-Content-Type-Options** - Prevents MIME sniffing
- **Referrer-Policy** - Controls referrer exposure

### 💳 Webhook Safety
- **Signature verification** - Ensures webhooks from Paystack only
- **Idempotency** - Prevents double-charging if webhook retries
- **Amount validation** - Ensures payment amount hasn't changed

### 🚫 Input Validation
- **Strict allowlists** - Only accepted values allowed
- **Zod schemas** - Type-safe validation
- **Length limits** - Prevents buffer overflow
- **Email verification** - Valid email format required

### 🔍 Fraud Detection
- **IP velocity** - Blocks >5 attempts per minute from same IP
- **Email velocity** - Blocks >3 orders per hour from same email
- **HTTP 403** response for high-risk attempts

### 📊 Security Logging
- **Structured JSON logs** - Easy to parse and analyze
- **PII redaction** - Emails masked, no card data logged
- **Event tracking** - All payment events recorded for audit

---

## Critical Files

| File | Purpose | Status |
|------|---------|--------|
| `middleware.ts` | Security headers middleware | ✅ NEW |
| `src/lib/rate-limiter.ts` | Rate limiting utility | ✅ NEW |
| `src/lib/security.ts` | Security helpers (fraud, logging) | ✅ NEW |
| `src/app/api/checkout/create-order/route.ts` | Hardened with rate limits + fraud detection | ✅ UPDATED |
| `src/app/api/payments/paystack/initialize/route.ts` | Hardened with rate limits | ✅ UPDATED |
| `src/app/api/webhooks/paystack/route.ts` | Idempotent webhook handler | ✅ UPDATED |
| `src/app/api/products/route.ts` | Strict input validation | ✅ UPDATED |
| `prisma/schema.prisma` | Added performance indices | ✅ UPDATED |
| `.env.example` | All required env vars | ✅ NEW |
| `SECURITY_AUDIT.md` | Detailed vulnerability analysis | ✅ NEW |
| `SECURITY_IMPLEMENTATION.md` | Implementation summary | ✅ NEW |
| `SECURITY_CHECKLIST.md` | QA testing guide (12 tests) | ✅ NEW |

---

## Quick Test (2 minutes)

```bash
# 1. Start dev server
npm run dev

# 2. Test rate limiting (should get 429 on request 11)
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/checkout/create-order \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","items":[],"shippingAddress":{"fullName":"Test","address1":"Test","city":"Test","state":"ST","country":"Country"}}' \
    -w "Request $i: %{http_code}\n"
  sleep 0.1
done

# 3. Expect: 400 errors (invalid items) for first 10, then 429 for rest
```

---

## Monitoring

### Console Logs (Development)

```bash
# Look for security events:
npm run dev 2>&1 | grep -E "rate_limit|fraud_|webhook_|security"
```

### Production Logs

Track these events:
- `rate_limit_exceeded_*` - Potential DDoS
- `fraud_risk_detected_*` - Blocked attempts
- `webhook_signature_invalid` - Tampering attempt
- `webhook_idempotency_duplicate` - Retry detected

---

## Troubleshooting

### Problem: Rate limiting too aggressive
**Solution:** Increase `RATE_LIMIT_REQUESTS` in `.env.local`

### Problem: Webhook not working
**Solution:** Verify `PAYSTACK_SECRET_KEY` matches your Paystack account

### Problem: CORS errors on frontend
**Solution:** Add your frontend origin to `allowedOrigins` in `middleware.ts`

### Problem: High fraud blocks
**Solution:** Adjust `FRAUD_VELOCITY_LIMIT` or `FRAUD_EMAIL_VELOCITY_LIMIT` in `.env.local`

---

## Next Steps

1. ✅ Run `npm run dev` to verify everything builds
2. ✅ Test using `SECURITY_CHECKLIST.md` (12 test scenarios)
3. ✅ Deploy to staging environment
4. ✅ Monitor logs for 24 hours
5. ✅ Deploy to production

---

## Documentation

- **Full Audit:** See `SECURITY_AUDIT.md` for all vulnerabilities found
- **Testing:** See `SECURITY_CHECKLIST.md` for detailed test procedures
- **Implementation:** See `SECURITY_IMPLEMENTATION.md` for code change details

---

## Support

If you encounter issues:

1. Check the error logs (console output)
2. Review `SECURITY_CHECKLIST.md` troubleshooting section
3. Verify all `.env.example` variables are set
4. Ensure `npm install` and `npx prisma migrate` completed

---

## Summary of Changes

| Endpoint | Before | After |
|----------|--------|-------|
| POST /api/checkout/create-order | No rate limiting | ✅ 10/min per IP |
| POST /api/payments/paystack/initialize | No rate limiting | ✅ 10/min per IP |
| POST /api/webhooks/paystack | Simple idempotency | ✅ Atomic with WHERE clause |
| GET /api/products | Weak validation | ✅ Strict allowlist |
| All endpoints | No headers | ✅ CSP, HSTS, X-Frame-Options |
| All endpoints | Generic errors | ✅ Safe error responses |

---

**Status:** ✅ All security enhancements implemented, tested, and documented.

Ready to deploy!
