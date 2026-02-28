-- Create enums
DO $$ BEGIN
    CREATE TYPE "ProductCategory" AS ENUM ('MEN', 'WOMEN', 'KIDS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED', 'FULFILLED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Product table
CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" "ProductCategory" NOT NULL,
    "price_kobo" INTEGER NOT NULL,
    "compare_at_kobo" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "inventory_qty" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "tags" TEXT[],
    "images" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS "Product_slug_key" ON "Product"("slug");

-- Create Order table
CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT NOT NULL,
    "order_number" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "subtotal_kobo" INTEGER NOT NULL,
    "shipping_kobo" INTEGER NOT NULL,
    "total_kobo" INTEGER NOT NULL,
    "customer_email" TEXT NOT NULL,
    "customer_phone" TEXT,
    "shipping_address_json" JSONB NOT NULL,
    "paystack_reference" TEXT NOT NULL,
    "paystack_transaction_id" TEXT,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes for Order
CREATE UNIQUE INDEX IF NOT EXISTS "Order_order_number_key" ON "Order"("order_number");
CREATE UNIQUE INDEX IF NOT EXISTS "Order_paystack_reference_key" ON "Order"("paystack_reference");

-- Create OrderItem table
CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "title_snapshot" TEXT NOT NULL,
    "unit_price_kobo" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "variant_json" JSONB,
    "line_total_kobo" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- Create indexes for OrderItem
CREATE INDEX IF NOT EXISTS "OrderItem_order_id_idx" ON "OrderItem"("order_id");
CREATE INDEX IF NOT EXISTS "OrderItem_product_id_idx" ON "OrderItem"("product_id");

-- Create PaymentEvent table
CREATE TABLE IF NOT EXISTS "PaymentEvent" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentEvent_pkey" PRIMARY KEY ("id")
);

-- Create indexes for PaymentEvent
CREATE INDEX IF NOT EXISTS "PaymentEvent_order_id_idx" ON "PaymentEvent"("order_id");
CREATE INDEX IF NOT EXISTS "PaymentEvent_reference_idx" ON "PaymentEvent"("reference");

-- Add foreign key constraints
DO $$ BEGIN
    ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "PaymentEvent" ADD CONSTRAINT "PaymentEvent_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
