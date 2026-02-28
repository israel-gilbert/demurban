# DEM Urban Security Hardening - Verification Checklist

Complete these tests to verify all security enhancements are working correctly.

## Pre-Test Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Ensure .env is configured with test values
# - DATABASE_URL pointing to test database
# - PAYSTACK_SECRET_KEY set
# - APP_URL=http://localhost:3000
```

---

## 1. SECURITY HEADERS TEST

**Verify CSP, HSTS, X-Frame-Options are set**

```bash
curl -I http://localhost:3000

# Expected response headers:
# Content-Security-Policy: default-src 'self'; ...
# Strict-Transport-Security: max-age=31536000; ...
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
# Referrer-Policy: strict-origin-when-cross-origin
# Permissions-Policy: geolocation=(); ...
```

**Pass Criteria:** All headers present ✓

---

## 2. RATE LIMITING TEST - Checkout Endpoint

**Verify rate limiting on POST /api/checkout/create-order**

```bash
# Send 15 requests in quick succession (limit is 10 per 60 seconds)
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/checkout/create-order \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","items":[],"shippingAddress":{"fullName":"Test","address1":"Test","city":"Test","state":"Test","country":"Test"}}' \
    -w "\nStatus: %{http_code}\n"
  sleep 0.1
done
```

**Pass Criteria:**
- First 10 requests: ✓ HTTP 400 (invalid items array, but request processed)
- Request 11-15: ✓ HTTP 429 (rate limited)
- Response headers include `Retry-After` value

---

## 3. RATE LIMITING TEST - Paystack Init Endpoint

```bash
# Send 15 requests in quick succession
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/payments/paystack/initialize \
    -H "Content-Type: application/json" \
    -d '{"orderId":"invalid"}' \
    -w "\nStatus: %{http_code}\n"
  sleep 0.1
done
```

**Pass Criteria:**
- First 10 requests: ✓ HTTP 404 or 400 (order not found, but request processed)
- Request 11-15: ✓ HTTP 429 (rate limited)

---

## 4. INPUT VALIDATION TEST - Products Endpoint

**Test invalid collection parameter (strict allowlist)**

```bash
# Valid collection
curl http://localhost:3000/api/products?collection=new
# Expected: HTTP 200, products array

# Invalid collection
curl http://localhost:3000/api/products?collection=exploit_attempt
# Expected: HTTP 200, empty products array (fail gracefully)
```

**Pass Criteria:**
- Valid values (new, trending, essentials, etc.): ✓ Return products
- Invalid values: ✓ Return empty array, no error

---

## 5. WEBHOOK IDEMPOTENCY TEST

**Verify webhook doesn't mark order paid twice**

```bash
# 1. Create an order manually (or use existing test order reference)
TEST_REFERENCE="DU_abc123def456"

# 2. Create valid webhook signature
# (Requires knowing PAYSTACK_SECRET_KEY - run this in Node.js)
node -e "
const crypto = require('crypto');
const secret = process.env.PAYSTACK_SECRET_KEY || 'test_secret';
const payload = JSON.stringify({
  event: 'charge.success',
  data: {
    reference: '$TEST_REFERENCE',
    amount: 50000,
    currency: 'NGN',
    status: 'success',
    id: 123456
  }
});
const sig = crypto.createHmac('sha512', secret).update(payload).digest('hex');
console.log('Signature:', sig);
console.log('Payload:', payload);
"

# 3. Send webhook twice with same signature
SIGNATURE="<output_from_above>"
PAYLOAD='{"event":"charge.success","data":{"reference":"'$TEST_REFERENCE'","amount":50000,"currency":"NGN","status":"success","id":123456}}'

curl -X POST http://localhost:3000/api/webhooks/paystack \
  -H "x-paystack-signature: $SIGNATURE" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"

curl -X POST http://localhost:3000/api/webhooks/paystack \
  -H "x-paystack-signature: $SIGNATURE" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"

# 4. Verify database shows order marked PAID only once
# SELECT status, paid_at, paystack_transaction_id FROM "Order" WHERE paystack_reference = '$TEST_REFERENCE';
```

**Pass Criteria:**
- Both requests: ✓ HTTP 200
- Database: ✓ Order marked PAID, `paid_at` has single timestamp
- PaymentEvent table: ✓ Two PAYSTACK_WEBHOOK_charge.success entries logged

---

## 6. WEBHOOK SIGNATURE VERIFICATION TEST

**Verify webhook rejects invalid signatures**

```bash
# Send webhook with WRONG signature
PAYLOAD='{"event":"charge.success","data":{"reference":"test","amount":50000}}'
WRONG_SIG="invalid_signature_here"

curl -X POST http://localhost:3000/api/webhooks/paystack \
  -H "x-paystack-signature: $WRONG_SIG" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"
```

**Pass Criteria:**
- Response: ✓ HTTP 401 (Unauthorized)
- No database changes: ✓ Order status unchanged

---

## 7. REQUEST BODY SIZE LIMIT TEST

**Verify request body size limits are enforced**

```bash
# Create a large payload (exceeds 1MB)
python3 -c "
import json
large_payload = {
  'email': 'test@test.com',
  'items': [{'productId': 'test', 'quantity': 1}],
  'shippingAddress': {
    'fullName': 'A' * 100000,
    'address1': 'B' * 100000,
    'city': 'C',
    'state': 'D',
    'country': 'E'
  }
}
print(json.dumps(large_payload))
" > /tmp/large.json

# Send oversized request
curl -X POST http://localhost:3000/api/checkout/create-order \
  -H "Content-Type: application/json" \
  -d @/tmp/large.json
```

**Pass Criteria:**
- Response: ✓ HTTP 413 (Payload Too Large) or HTTP 400

---

## 8. FRAUD VELOCITY DETECTION TEST

**Verify fraud signals trigger on multiple attempts**

```bash
# Send 6 requests from same IP within 60 seconds
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/checkout/create-order \
    -H "Content-Type: application/json" \
    -d '{"email":"fraud_test@test.com","items":[],"shippingAddress":{"fullName":"Test","address1":"Test","city":"Test","state":"Test","country":"Test"}}' \
    -w "\nAttempt $i - Status: %{http_code}\n"
  sleep 1
done
```

**Pass Criteria:**
- Request 1-5: ✓ HTTP 400 (validation error) or 429 (rate limit)
- Request 6+: ✓ HTTP 403 (Fraud risk detected)
- Console logs: ✓ "fraud_risk_detected_checkout" event logged

---

## 9. CORS POLICY TEST

**Verify CORS headers are enforced**

```bash
# Request from allowed origin
curl -H "Origin: http://localhost:3000" -I http://localhost:3000/api/products

# Expected: Access-Control-Allow-Origin header present

# Request from disallowed origin
curl -H "Origin: https://malicious.com" -I http://localhost:3000/api/products

# Expected: No Access-Control-Allow-Origin header (CORS blocked)
```

**Pass Criteria:**
- Allowed origins: ✓ CORS headers present
- Disallowed origins: ✓ No CORS headers

---

## 10. ERROR HANDLING TEST

**Verify no stack traces leak in production**

```bash
# Trigger an error
curl -X POST http://localhost:3000/api/checkout/create-order \
  -H "Content-Type: application/json" \
  -d '{"invalid": "request"}'
```

**Pass Criteria:**
- Response: ✓ JSON error message (no HTML stack trace)
- Dev mode (NODE_ENV=development): Stack trace may be visible for debugging
- Prod mode (NODE_ENV=production): ✓ Generic error message only

---

## 11. LOGGING TEST

**Verify security events are logged (check console output)**

```bash
# Check that these events appear in console logs:
# - rate_limit_exceeded_checkout
# - fraud_risk_detected_checkout
# - order_created
# - paystack_init_success
# - order_marked_paid_via_webhook
# - webhook_signature_invalid (on bad signature)

# Format should be JSON (structured logging):
# {"timestamp":"2024-...","eventType":"...","...": "..."}
```

**Pass Criteria:**
- ✓ Security events logged to console (structured JSON)
- ✓ No PII (full emails, card numbers) in logs
- ✓ Sensitive fields masked (passwords, tokens, cards)

---

## 12. FULL PAYMENT FLOW TEST

**End-to-end payment flow verification**

```bash
# 1. Create order
ORDER=$(curl -X POST http://localhost:3000/api/checkout/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "email":"customer@test.com",
    "items":[{"productId":"VALID_PRODUCT_ID","quantity":1}],
    "shippingAddress":{"fullName":"John Doe","address1":"123 Main","city":"Lagos","state":"LA","country":"Nigeria"}
  }' | jq -r '.orderId')
echo "Order created: $ORDER"

# 2. Initialize payment
PAYSTACK=$(curl -X POST http://localhost:3000/api/payments/paystack/initialize \
  -H "Content-Type: application/json" \
  -d "{\"orderId\":\"$ORDER\"}" | jq -r '.authorizationUrl')
echo "Auth URL: $PAYSTACK"

# 3. Verify order status is PENDING
# SELECT status FROM "Order" WHERE id = '$ORDER';

# 4. Simulate webhook (charge.success)
# (Run webhook test from #5 above with this order's reference)

# 5. Verify order status is now PAID
# SELECT status, paid_at FROM "Order" WHERE id = '$ORDER';
```

**Pass Criteria:**
- ✓ Order created with status PENDING
- ✓ Paystack authorization URL returned
- ✓ Webhook marks order PAID after success event
- ✓ All events logged in PaymentEvent table

---

## Summary Checklist

- [ ] Security headers present (CSP, HSTS, X-Frame-Options)
- [ ] Rate limiting works (429 returned after limit)
- [ ] Input validation enforced (allowlist filtering)
- [ ] Webhook signature verification works (401 on invalid)
- [ ] Webhook idempotency works (no double-charging)
- [ ] Fraud detection triggers (HTTP 403 on high risk)
- [ ] CORS policy enforced (headers only for allowed origins)
- [ ] Error messages safe (no stack traces in prod)
- [ ] Security events logged (structured JSON)
- [ ] Full payment flow succeeds (order created → paid)

---

## Notes for QA

1. **Test in both environments:**
   - Development (`NODE_ENV=development`) - may show stack traces for debugging
   - Production (`NODE_ENV=production`) - generic error messages only

2. **Database queries for verification:**
   ```sql
   -- Check payment events
   SELECT event_type, created_at, payload_json FROM "PaymentEvent" ORDER BY created_at DESC LIMIT 10;

   -- Check orders
   SELECT id, order_number, status, paid_at, paystack_reference FROM "Order" ORDER BY created_at DESC LIMIT 10;

   -- Check for duplicate PAID transitions
   SELECT order_id, COUNT(*) FROM "PaymentEvent" 
   WHERE event_type LIKE '%WEBHOOK_%' 
   GROUP BY order_id 
   HAVING COUNT(*) > 1;
   ```

3. **Monitor logs for:**
   - `fraud_risk_detected_*` events (high-velocity attacks)
   - `webhook_signature_invalid` (potential tampering)
   - `rate_limit_exceeded_*` events (DDoS patterns)

4. **Performance considerations:**
   - Rate limiter stores data in memory (development)
   - For distributed production, migrate to Upstash Redis
   - Current implementation suitable for single-region deployments

---

## Troubleshooting

**Rate limiting always returns 429:**
- Check `RATE_LIMIT_WINDOW_MS` env variable
- In-memory store may not be clearing entries
- Restart dev server to reset in-memory storage

**Webhook not working:**
- Verify `PAYSTACK_SECRET_KEY` matches your account
- Signature must be calculated on raw JSON body (not parsed)
- Check webhook event type matches allowed list

**CORS blocking requests:**
- Add origin to `allowedOrigins` array in `middleware.ts`
- Ensure origin matches exactly (http vs https, :port)

---

## Security Improvement Roadmap

- [ ] Migrate rate limiter to Upstash Redis (distributed)
- [ ] Add IP geolocation fraud signals
- [ ] Implement Sentry error reporting
- [ ] Add email verification for new accounts
- [ ] Implement captcha on checkout (optional)
- [ ] Add 3D Secure payment support
- [ ] Monthly security audit of PaymentEvent logs
- [ ] PCI-DSS audit (annual)
