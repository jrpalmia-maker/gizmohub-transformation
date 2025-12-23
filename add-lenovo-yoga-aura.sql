-- Add Lenovo Yoga 9i 2-in-1 Aura Edition Product

-- Ensure Lenovo brand exists
INSERT IGNORE INTO brands (name, description) VALUES 
('Lenovo', 'Lenovo laptops and computers');

-- Add image column to products if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS image VARCHAR(255);

-- Insert Lenovo Yoga 9i 2-in-1 Aura Edition with full details
INSERT INTO products (
    name, 
    price, 
    stock, 
    description, 
    category_id, 
    brand_id,
    image,
    specification,
    reasons_to_buy,
    reasons_to_avoid
) VALUES (
    'Lenovo Yoga 9i 2-in-1 Aura Edition',
    1799.99,
    15,
    'The Lenovo Yoga 9i 2-in-1 Aura Edition takes the Yoga 2-in-1 form factor we already loved and makes it even better, complete with a stunning OLED display, a thin-and-light design, admirable battery life, and a stellar keyboard. If you''re looking for a versatile, do-it-all Lenovo laptop, this is the one to get.',
    (SELECT category_id FROM categories WHERE name = 'Laptops' LIMIT 1),
    (SELECT brand_id FROM brands WHERE name = 'Lenovo' LIMIT 1),
    'lenovo2.jpg',
    'CPU: Intel Core Ultra 7 258V|GPU: Intel Arc 140V integrated graphics|RAM: 32GB|Storage: 1TB SSD|Display: 14-inch, 2880 x 1800, 120Hz OLED|Weight: 2.9 pounds|Battery: Up to 15 hours|Ports: 2x Thunderbolt 4, 1x USB-A',
    'Slim and light design,Long battery life,Stunning OLED display with 149.2% DCI-P3 color gamut,Smooth keyboard and touchpad,Awesome speakers,2-in-1 flexibility,Strong gaming performance',
    'Performance could be better for the price - Geekbench 6 score of 11,059 falls behind MacBook Air M4'
);

-- Verify insert
SELECT product_id, name, price, stock, image FROM products WHERE name LIKE 'Lenovo Yoga%' ORDER BY product_id DESC LIMIT 1;
