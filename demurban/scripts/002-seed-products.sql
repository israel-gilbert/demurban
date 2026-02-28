-- Seed products for DemUrban
-- Prices are in kobo (Nigerian currency subunit, 100 kobo = 1 Naira)

INSERT INTO "Product" (id, handle, title, description, price, "compareAtPrice", category, tags, images, inventory, "createdAt", "updatedAt")
VALUES
  -- MEN's Collection
  (gen_random_uuid(), 'dem-classic-tee-black', 'DEM Classic Tee - Black', 'Premium cotton crew neck tee with embroidered DEM logo. The essential piece for the DEM lifestyle.', 1500000, 1800000, 'MEN', ARRAY['new', 'best-seller', 'tees'], ARRAY['/images/products/men-tee-black.jpg'], 50, NOW(), NOW()),
  
  (gen_random_uuid(), 'urban-cargo-pants', 'Urban Cargo Pants', 'Relaxed fit cargo pants with multiple pockets. Built for the streets.', 2800000, NULL, 'MEN', ARRAY['pants', 'streetwear'], ARRAY['/images/products/men-cargo.jpg'], 35, NOW(), NOW()),
  
  (gen_random_uuid(), 'dem-hoodie-red', 'DEM Signature Hoodie - Red', 'Heavyweight cotton hoodie with bold DEM branding. Where taste meets identity.', 3500000, 4200000, 'MEN', ARRAY['new', 'hoodies', 'best-seller'], ARRAY['/images/products/men-hoodie-red.jpg'], 25, NOW(), NOW()),
  
  (gen_random_uuid(), 'street-bomber-jacket', 'Street Bomber Jacket', 'Sleek bomber jacket with satin lining. Perfect for layering.', 5500000, NULL, 'MEN', ARRAY['jackets', 'outerwear'], ARRAY['/images/products/men-bomber.jpg'], 15, NOW(), NOW()),

  -- WOMEN's Collection
  (gen_random_uuid(), 'dem-crop-top-white', 'DEM Crop Top - White', 'Fitted crop top with subtle DEM embroidery. Clean and minimal.', 1200000, 1500000, 'WOMEN', ARRAY['new', 'tops', 'best-seller'], ARRAY['/images/products/women-crop-white.jpg'], 40, NOW(), NOW()),
  
  (gen_random_uuid(), 'high-waist-joggers', 'High Waist Joggers', 'Comfortable joggers with tapered fit. Style meets comfort.', 2200000, NULL, 'WOMEN', ARRAY['pants', 'joggers'], ARRAY['/images/products/women-joggers.jpg'], 30, NOW(), NOW()),
  
  (gen_random_uuid(), 'oversized-tee-dress', 'Oversized Tee Dress', 'Long oversized tee that works as a dress. Effortless style.', 1800000, 2200000, 'WOMEN', ARRAY['dresses', 'tees'], ARRAY['/images/products/women-tee-dress.jpg'], 20, NOW(), NOW()),
  
  (gen_random_uuid(), 'dem-windbreaker-black', 'DEM Windbreaker - Black', 'Lightweight windbreaker with reflective DEM logo. Made for movement.', 4200000, NULL, 'WOMEN', ARRAY['new', 'jackets', 'outerwear'], ARRAY['/images/products/women-windbreaker.jpg'], 18, NOW(), NOW()),

  -- KIDS Collection
  (gen_random_uuid(), 'mini-dem-tee', 'Mini DEM Tee', 'Kids version of our iconic tee. Start them young.', 800000, 1000000, 'KIDS', ARRAY['new', 'tees', 'best-seller'], ARRAY['/images/products/kids-tee.jpg'], 60, NOW(), NOW()),
  
  (gen_random_uuid(), 'kids-track-pants', 'Kids Track Pants', 'Comfortable track pants for active kids. Durable and stylish.', 1200000, NULL, 'KIDS', ARRAY['pants', 'activewear'], ARRAY['/images/products/kids-track.jpg'], 45, NOW(), NOW()),
  
  (gen_random_uuid(), 'junior-hoodie-grey', 'Junior Hoodie - Grey', 'Soft fleece hoodie sized for juniors. Cozy DEM style.', 1800000, 2200000, 'KIDS', ARRAY['hoodies', 'best-seller'], ARRAY['/images/products/kids-hoodie.jpg'], 30, NOW(), NOW()),
  
  (gen_random_uuid(), 'kids-cap-red', 'Kids DEM Cap - Red', 'Adjustable cap with embroidered logo. One size fits most kids.', 600000, NULL, 'KIDS', ARRAY['accessories', 'caps'], ARRAY['/images/products/kids-cap.jpg'], 100, NOW(), NOW())

ON CONFLICT (handle) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  "compareAtPrice" = EXCLUDED."compareAtPrice",
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  images = EXCLUDED.images,
  inventory = EXCLUDED.inventory,
  "updatedAt" = NOW();
