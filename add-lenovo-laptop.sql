-- Add Lenovo Laptop with Image

-- Ensure categories exist
INSERT IGNORE INTO categories (name, description) VALUES 
('Laptops', 'Computers and notebooks'),
('Smartphones', 'Mobile phones and accessories'),
('Tablets', 'Tablet devices and accessories'),
('Accessories', 'Phone and computer accessories');

-- Ensure Lenovo brand exists
INSERT IGNORE INTO brands (name, description) VALUES 
('Lenovo', 'Lenovo laptops and computers');

-- Add image column to products if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS image VARCHAR(255);

-- Insert Lenovo Laptop Product with Image
INSERT INTO products (
    name, 
    price, 
    stock, 
    description, 
    category_id, 
    brand_id,
    image
) VALUES (
    'Lenovo ThinkPad X1 Carbon',
    1299.99,
    25,
    'Premium business laptop with Intel Core Ultra processor, 16GB RAM, 512GB SSD, 14-inch FHD display, and all-day battery life. Perfect for professionals.',
    (SELECT category_id FROM categories WHERE name = 'Laptops' LIMIT 1),
    (SELECT brand_id FROM brands WHERE name = 'Lenovo' LIMIT 1),
    'lenovo1.jpg'
);

-- Verify insert
SELECT * FROM products WHERE name LIKE 'Lenovo%' ORDER BY product_id DESC LIMIT 1;
