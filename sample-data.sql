-- Sample data for Gizmohub database

INSERT INTO categories (name, description) VALUES 
('Smartphones', 'Mobile phones and accessories'),
('Laptops', 'Computers and notebooks'),
('Tablets', 'Tablet devices and accessories'),
('Accessories', 'Phone and computer accessories');

INSERT INTO brands (name, description) VALUES 
('Samsung', 'Leading electronics manufacturer'),
('Apple', 'Premium technology brand'),
('Dell', 'Computer and laptop brand'),
('Generic', 'Various brands');

INSERT INTO products (name, price, stock, description, category_id, brand_id) VALUES 
('Samsung Galaxy S24', 999.99, 50, 'Latest Samsung smartphone with 5G', 1, 1),
('iPhone 15 Pro', 1299.99, 30, 'Premium Apple smartphone', 1, 2),
('Dell XPS 13', 1199.99, 20, 'Portable and powerful laptop', 2, 3),
('iPad Pro 12.9', 1099.99, 25, 'Large tablet with M2 chip', 3, 2),
('Samsung Galaxy Buds', 149.99, 100, 'Wireless earbuds', 4, 1),
('USB-C Cable Pack', 19.99, 200, 'Pack of 3 USB-C cables', 4, 4);
