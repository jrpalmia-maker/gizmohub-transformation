-- Add Lenovo Yoga 9i 2-in-1 Aura Edition Product

-- First, add new columns to products table if they don't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS specification TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS reasons_to_buy TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS reasons_to_avoid TEXT;

-- Ensure Lenovo brand exists
INSERT IGNORE INTO brands (name, description) VALUES 
('Lenovo', 'Lenovo laptops and computers');

-- Product insertion with complete details
INSERT INTO products (
    name, 
    price, 
    stock, 
    description, 
    category_id, 
    brand_id,
    specification,
    reasons_to_buy,
    reasons_to_avoid
) VALUES (
    'Lenovo Yoga 9i 2-in-1 Aura Edition',
    1799.99,
    15,
    'The Lenovo Yoga 9i 2-in-1 Aura Edition takes the Yoga 2-in-1 form factor we already loved and makes it even better, complete with a stunning OLED display, a thin-and-light design, admirable battery life, and a stellar keyboard. If you''re looking for a versatile, do-it-all Lenovo laptop, this is the one to get. The Yoga 9i 2-in-1 Aura Edition has a lot going for it, from its classy cosmic blue chassis to its top-tier OLED display, which scored an outstanding 149.2% on our DCI-P3 color gamut test. That''s nearly twice what the MacBook Air M4 scored and far beyond most other sub-$2,000 laptops. While the Yoga 9i 2-in-1 Aura Edition is easy to recommend, it''s not perfect. The performance could be better for the price. With that said, the Yoga 9i performed better than expected on our gaming tests, outscoring a few key rivals (particularly the MacBook Air M4). It''s certainly not a gaming laptop, but it''s more than capable of some casual gaming in between work or school tasks.',
    (SELECT category_id FROM categories WHERE name = 'Laptops' LIMIT 1),
    (SELECT brand_id FROM brands WHERE name = 'Lenovo' LIMIT 1),
    'CPU: Intel Core Ultra 7 258V|GPU: Intel Arc 140V integrated graphics|RAM: 32GB|Storage: 1TB|Display: 14-inch, 2880 x 1800, 120Hz OLED|Size: 12.44 x 8.66 x 0.65 inches|Weight: 2.9 pounds',
    'Slim and light design,Long battery life,Stunning OLED display,Smooth keyboard and touchpad experience,Awesome speakers',
    'Performance could be better for the price - Geekbench 6 score of 11,059 falls behind MacBook Air M4 and Asus Zenbook 14 UX3405'
);
