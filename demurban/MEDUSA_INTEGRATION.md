# Medusa API Integration Guide

This project is configured to work with a Medusa backend. The API integration provides type-safe server actions and route handlers for product and cart operations.

## Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Client-side API URL (public, accessible from browser)
NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000

# Server-side API URL (backend only)
MEDUSA_BACKEND_URL=http://localhost:9000
```

## Architecture

### 1. **API Client** (`src/lib/medusa.ts`)
- `medusaBackendClient`: Server-side client for server actions and API routes
- `medusaStoreClient`: Client-side client for browser requests

**Benefits:**
- Centralized API communication
- Error handling and response typing
- Safe request configuration

### 2. **Server Actions** (`src/lib/server-actions.ts`)
- `fetchProducts()`: Get products with optional filters
- `fetchProductsByCollection()`: Get products by collection handle
- `fetchProductByHandle()`: Get single product by handle
- `createCart()`: Initialize a new cart
- `getCart()`: Fetch cart by ID
- `addToCart()`: Add item to cart
- `updateCartQuantity()`: Update item quantity
- `removeFromCart()`: Remove item from cart

**Usage in Server Components:**
```tsx
import { fetchProducts } from "@/lib/server-actions";

async function HomePage() {
  const products = await fetchProducts({ limit: 4 });
  
  return <ProductGrid products={products} />;
}
```

### 3. **API Routes** (`src/app/api/`)

#### `GET /api/products`
Get products, optionally filtered by collection.

**Query Parameters:**
- `collection`: Collection handle to filter by (optional)

**Response:**
```json
{
  "products": [
    {
      "id": "prod_123",
      "handle": "minimal-tee",
      "title": "Minimal Tee",
      "price": 18000,
      ...
    }
  ]
}
```

#### `POST /api/cart`
Create a new cart.

**Response:**
```json
{
  "cart": {
    "id": "cart_123",
    "currency_code": "NGN",
    "items": [],
    "total": 0,
    ...
  }
}
```

#### `GET /api/cart/:id`
Get cart details by ID.

**Response:**
```json
{
  "cart": {
    "id": "cart_123",
    "items": [...],
    "subtotal": 50000,
    "total": 50000,
    ...
  }
}
```

#### `POST /api/cart/:cartId/items`
Add item to cart.

**Request Body:**
```json
{
  "variant_id": "var_123",
  "quantity": 2
}
```

#### `POST /api/cart/:cartId/items/:lineItemId`
Update line item quantity.

**Request Body:**
```json
{
  "quantity": 3
}
```

#### `DELETE /api/cart/:cartId/items/:lineItemId`
Remove item from cart.

## Caching Strategy

### Server Components & Server Actions
- **Product pages**: 1 hour ISR (Incremental Static Regeneration)
- **Collection pages**: 1 hour ISR
- **Dynamic content**: No cache (`no-store`)

```tsx
export const revalidate = 3600; // 1 hour
```

### API Routes
- **Products endpoint**: Public cache with stale-while-revalidate
- **Cart endpoints**: No cache (always fresh)

```typescript
headers: {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
}
```

## Error Handling

All API operations return `ApiResponse<T>` with standardized error handling:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
```

**Example:**
```tsx
const result = await fetchProducts();
if (!result) {
  console.error("Failed to fetch products");
  // Fallback to mock data or error UI
}
```

## Loading & Error States

### Server Components
Use `Suspense` for streaming:

```tsx
import { Suspense } from "react";

function HomePage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductList />
    </Suspense>
  );
}

async function ProductList() {
  const products = await fetchProducts();
  return <ProductGrid products={products} />;
}
```

### Client Components
Use React state:

```tsx
"use client";

import { useState } from "react";
import { addToCart } from "@/lib/server-actions";

export function AddToCartButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const cart = await addToCart(cartId, variantId, 1);
      if (!cart) throw new Error("Failed to add to cart");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? "Adding..." : "Add to Cart"}
      {error && <p className="text-red-600">{error}</p>}
    </button>
  );
}
```

## Type Safety

All functions are fully typed with TypeScript:

```typescript
// Products
export async function fetchProducts(
  query?: Record<string, string | number | boolean>
): Promise<Product[]>

// Cart
export async function getCart(cartId: string): Promise<Cart | null>

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity?: number
): Promise<Cart | null>
```

## Medusa Endpoints Used

This integration assumes a standard Medusa installation with these endpoints:

- `GET /admin/products` - List products (admin)
- `GET /admin/products/by-handle/:handle` - Get product by handle (admin)
- `POST /store/carts` - Create cart (store)
- `GET /store/carts/:id` - Get cart (store)
- `POST /store/carts/:id/line-items` - Add line item (store)
- `POST /store/carts/:id/line-items/:lineItemId` - Update line item (store)
- `DELETE /store/carts/:id/line-items/:lineItemId` - Remove line item (store)

## Migration from Mock Data

The original mock data is still available in `src/lib/products.ts` as fallback. To fully migrate:

1. ✅ Update all page components to use server actions
2. ✅ Replace client component data fetching with server actions
3. ✅ Add loading/error UI with Suspense or useState
4. ✅ Configure `.env.local` with Medusa URLs
5. ✅ Test with running Medusa instance

## Local Development

Start Medusa backend:
```bash
cd medusa-backend
npm run develop
# Runs on http://localhost:9000
```

Start Next.js dev server:
```bash
pnpm dev
# Runs on http://localhost:3000
```

## Production Deployment

1. Set environment variables in your hosting platform
2. Ensure Medusa backend is accessible (typically behind a reverse proxy)
3. Update API URLs if needed for your domain
4. Monitor error logs for API failures
5. Consider implementing retry logic for resilience

## Troubleshooting

### "Cannot find module 'medusa'" errors
Ensure your `.env.local` file is created and restart the dev server.

### Cart/Product endpoints return 404
Verify Medusa backend is running and accessible at the configured URL.

### Stale product data
Adjust `revalidate` value in page components (lower = more frequent updates).

### API rate limiting
Medusa may rate limit requests. Implement exponential backoff in production.
