# DemUrban Storefront (Next.js + Paystack)

Minimal fashion ecommerce storefront inspired by modern Framer layouts, but fully code-owned.

## Stack
- Next.js (App Router) + Tailwind
- Prisma + Postgres
- Paystack (redirect checkout + webhook)

## 1) Setup

1. Install deps
```bash
pnpm install
```

2. Create env file
```bash
cp .env.example .env.local
```

Fill:
- `APP_URL` (e.g., `http://localhost:3000` locally)
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_PUBLIC_KEY` (optional for future inline usage)
- `DATABASE_URL`

3. Database
```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

4. Run
```bash
pnpm dev
```

## 2) Paystack webhooks

Set your Paystack webhook URL to:
- `https://YOUR_DOMAIN/api/webhooks/paystack`

Paystack signature verification is enabled via `x-paystack-signature` using your `PAYSTACK_SECRET_KEY`.

## 3) Payment flow

- `/checkout` creates an Order in DB (PENDING)
- `/api/payments/paystack/initialize` creates Paystack transaction and redirects user
- Paystack redirects to `/api/payments/paystack/callback` which verifies payment
- Webhook also updates orders idempotently

## Notes
- Shipping is set to 0 for now. Replace in `src/app/api/checkout/create-order/route.ts`.
- Products are seeded as placeholders. Replace images in `/public/products/` and update `prisma/seed.mjs`.
