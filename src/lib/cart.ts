"use client";

export type CartLine = {
  productId: string;
  slug: string;
  title: string;
  price_kobo: number;
  currency: string;
  image?: string;
  quantity: number;
  variant?: Record<string, unknown>;
};

export type CartState = {
  currency: string;
  items: CartLine[];
};

const KEY = "demurban_cart_v1";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function getCart(): CartState {
  if (typeof window === "undefined") return { currency: "NGN", items: [] };
  const parsed = safeParse<CartState>(window.localStorage.getItem(KEY));
  if (!parsed || !Array.isArray(parsed.items)) return { currency: "NGN", items: [] };
  return parsed;
}

export function saveCart(cart: CartState) {
  window.localStorage.setItem(KEY, JSON.stringify(cart));
}

export function addToCart(line: Omit<CartLine, "quantity"> & { quantity?: number }): CartState {
  const cart = getCart();
  const qty = Math.max(1, line.quantity ?? 1);

  const existingIdx = cart.items.findIndex(
    (i) => i.productId === line.productId && JSON.stringify(i.variant ?? {}) === JSON.stringify(line.variant ?? {})
  );

  if (existingIdx >= 0) {
    cart.items[existingIdx] = {
      ...cart.items[existingIdx],
      quantity: cart.items[existingIdx].quantity + qty,
    };
  } else {
    cart.items.push({ ...line, quantity: qty });
  }

  saveCart(cart);
  return cart;
}

export function updateCartQuantity(productId: string, quantity: number, variant?: Record<string, unknown>): CartState {
  const cart = getCart();
  cart.items = cart.items
    .map((i) => {
      const same = i.productId === productId && JSON.stringify(i.variant ?? {}) === JSON.stringify(variant ?? {});
      return same ? { ...i, quantity } : i;
    })
    .filter((i) => i.quantity > 0);

  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: string, variant?: Record<string, unknown>): CartState {
  const cart = getCart();
  cart.items = cart.items.filter(
    (i) => !(i.productId === productId && JSON.stringify(i.variant ?? {}) === JSON.stringify(variant ?? {}))
  );
  saveCart(cart);
  return cart;
}

export function clearCart() {
  window.localStorage.removeItem(KEY);
}

export function cartSubtotalKobo(cart: CartState): number {
  return cart.items.reduce((sum, i) => sum + i.price_kobo * i.quantity, 0);
}
