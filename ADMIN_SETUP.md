# Admin Setup (Neon + Cloudinary)

## 1) Environment variables

Add these to `.env.local` (and Vercel Environment Variables):

- `DATABASE_URL` (Neon Postgres)
- `APP_URL` (e.g. `http://localhost:3000` or your production domain)
- `PAYSTACK_SECRET_KEY`

Admin auth:
- `NEXTAUTH_SECRET` (generate a random 32+ char string)
- `ADMIN_EMAIL` (the admin login email)
- `ADMIN_PASSWORD` (the admin login password)

Cloudinary:
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (unsigned preset)

## 2) Database

Run:

```bash
npm run db:push
npm run db:seed
```

This will seed products and also create/update the admin user if `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set.

## 3) Admin dashboard

Visit:
- `/admin/login`

Then manage products at:
- `/admin/products`

Uploads go to Cloudinary folder: `demurban/products`.
