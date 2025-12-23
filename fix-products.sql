-- Fix database issues

-- 1. Delete duplicate Lenovo brand (keep the first one)
DELETE FROM brands WHERE brand_id = 6;

-- 2. Fix product category mappings
UPDATE products SET category_id = 2 WHERE name = 'Samsung Galaxy S24';
UPDATE products SET category_id = 2 WHERE name = 'iPhone 15 Pro';
UPDATE products SET category_id = 2 WHERE name = 'Samsung Galaxy Buds';
UPDATE products SET category_id = 2 WHERE name = 'iPad Pro 12.9';
UPDATE products SET category_id = 5 WHERE name = 'USB-C Cable Pack';
UPDATE products SET category_id = 3 WHERE name = 'Dell XPS 13';

-- 3. Delete the placeholder category "Your Category Name"
DELETE FROM categories WHERE category_id = 1;
