-- Check and insert Lenovo brand

-- First, check if Lenovo already exists
SELECT * FROM brands WHERE name = 'Lenovo';

-- If not, insert it
INSERT INTO brands (name, description) VALUES 
('Lenovo', 'Lenovo is a leading global technology company that designs, manufactures, and sells personal computers, computer-related products and services. Founded in 1984, Lenovo is headquartered in Beijing, China and has offices worldwide.')
ON DUPLICATE KEY UPDATE name=name;
