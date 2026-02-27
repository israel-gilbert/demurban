export type ProductCategory = "MEN" | "WOMEN" | "KIDS";

export interface Product {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  category: ProductCategory;
  price_kobo: number;
  compare_at_kobo?: number | null;
  currency: string;
  inventory_qty: number;
  active: boolean;
  tags: string[];
  images: string[];
  created_at?: string;
  updated_at?: string;
}

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "FULFILLED"
  | "REFUNDED";

export interface CheckoutItemInput {
  productId: string;
  quantity: number;
  variant?: Record<string, unknown>;
}

export interface ShippingAddress {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}

export interface CreateOrderInput {
  email: string;
  phone?: string;
  items: CheckoutItemInput[];
  shippingAddress: ShippingAddress;
}
