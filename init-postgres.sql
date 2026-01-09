-- PostgreSQL Schema for Gizmohub Transformation (Converted from MySQL)
-- This will be auto-executed by Railway when the PostgreSQL database is created

-- Create sequences for AUTO_INCREMENT replacement
CREATE SEQUENCE admins_admin_id_seq START WITH 4;
CREATE SEQUENCE brands_brand_id_seq START WITH 9;
CREATE SEQUENCE cart_cart_id_seq START WITH 25;
CREATE SEQUENCE categories_category_id_seq START WITH 10;
CREATE SEQUENCE customers_customer_id_seq START WITH 10;
CREATE SEQUENCE orders_order_id_seq START WITH 1;
CREATE SEQUENCE order_items_order_item_id_seq START WITH 1;
CREATE SEQUENCE payments_payment_id_seq START WITH 1;
CREATE SEQUENCE products_product_id_seq START WITH 10;

-- Create tables
CREATE TABLE admins (
  admin_id INTEGER PRIMARY KEY DEFAULT nextval('admins_admin_id_seq'),
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  profile_picture BYTEA
);

CREATE TABLE brands (
  brand_id INTEGER PRIMARY KEY DEFAULT nextval('brands_brand_id_seq'),
  name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE categories (
  category_id INTEGER PRIMARY KEY DEFAULT nextval('categories_category_id_seq'),
  name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY DEFAULT nextval('customers_customer_id_seq'),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  profile_picture BYTEA
);

CREATE TABLE products (
  product_id INTEGER PRIMARY KEY DEFAULT nextval('products_product_id_seq'),
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL,
  category_id INTEGER REFERENCES categories(category_id) ON DELETE SET NULL,
  brand_id INTEGER REFERENCES brands(brand_id) ON DELETE SET NULL,
  image VARCHAR(255),
  specification TEXT,
  reasons_to_buy TEXT,
  reasons_to_avoid TEXT
);

CREATE TABLE cart (
  cart_id INTEGER PRIMARY KEY DEFAULT nextval('cart_cart_id_seq'),
  customer_id INTEGER REFERENCES customers(customer_id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY DEFAULT nextval('orders_order_id_seq'),
  customer_id INTEGER REFERENCES customers(customer_id) ON DELETE CASCADE,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending',
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  order_item_id INTEGER PRIMARY KEY DEFAULT nextval('order_items_order_item_id_seq'),
  order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE payments (
  payment_id INTEGER PRIMARY KEY DEFAULT nextval('payments_payment_id_seq'),
  order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'Pending',
  amount DECIMAL(10, 2) NOT NULL,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert data from your XAMPP database
INSERT INTO admins (admin_id, username, password, full_name) VALUES
(1, 'admin', 'admin123', 'John Ron Paul Almia'),
(2, 'jrpalmia@gmail.com', 'almia123', 'john ron paul almia');

INSERT INTO brands (brand_id, name, description) VALUES
(1, 'Samsung', 'Leading electronics manufacturer'),
(2, 'Apple', 'Premium technology brand'),
(3, 'Dell', 'Computer and laptop brand'),
(4, 'Generic', 'Various brands'),
(5, 'Lenovo', 'Lenovo is a leading global technology company that designs, manufactures, and sells personal computers, computer-related products and services. Founded in 1984, Lenovo is headquartered in Beijing, China and has offices worldwide.');

INSERT INTO categories (category_id, name, description) VALUES
(2, 'Smartphones', 'Mobile phones and accessories'),
(3, 'Laptops', 'Computers and notebooks'),
(4, 'Tablets', 'Tablet devices and accessories'),
(5, 'Accessories', 'Phone and computer accessories');

INSERT INTO customers (customer_id, first_name, last_name, email, password, phone, address, created_at) VALUES
(1, 'junjun', 'labyu', 'meow@gmail.com', '12345678', NULL, NULL, '2025-12-01 12:42:41'),
(2, 'john', 'almia', 'jrpalmia@gmail.com', '$2y$10$GyTN2sP.wP6V0HoK0SRW1OWx3OK6grqRGOyzjBjrLjNgyidydYrum', NULL, NULL, '2025-12-02 10:38:03'),
(3, 'john', 'almia', 'samuraialmia@gmail.com', '$2y$10$P2fe87p4KAClu1jby2qS9uRo5pLJwgGwa8bg63VIZGZGoNg4l.NsG', '09167809846', 'tamontaka', '2025-12-02 10:54:15'),
(4, 'Demo', 'User', 'demo@gizmohub.com', 'demo123', '555-0000', NULL, '2025-12-13 10:24:10'),
(5, 'john ron paul', 'almia', 'jane@gmail.com', 'almia123', NULL, NULL, '2025-12-13 10:58:52'),
(6, 'jane', 'almia', 'janedimaocor@yahoo.com', 'admin123', '+639167809846', NULL, '2025-12-17 14:59:00'),
(7, 'meow', 'almia', 'john@gmail.com', 'almia123', '+639167809847', NULL, '2025-12-18 04:25:10'),
(8, 'john', 'almia', 'jo@gmail.com', 'Almia123', NULL, NULL, '2025-12-23 15:03:01'),
(9, 'jun jun', 'Smith', 'smith@gmail.com', 'Almia123', NULL, NULL, '2025-12-23 15:50:12');

INSERT INTO products (product_id, name, description, price, stock, category_id, brand_id, image, specification, reasons_to_buy, reasons_to_avoid) VALUES
(1, 'Samsung Galaxy S24', 'Latest Samsung smartphone with 5G', 999.99, 50, 2, 1, NULL, NULL, NULL, NULL),
(2, 'iPhone 15 Pro', 'Premium Apple smartphone', 1299.99, 30, 2, 2, NULL, NULL, NULL, NULL),
(3, 'Dell XPS 13', 'Portable and powerful laptop', 1199.99, 20, 3, 3, NULL, 'Processor: Intel Core Ultra 7 256V|Graphics: Intel Arc Graphics 140V|RAM: 16GB|Storage: 512GB SSD|Display: 13.4-inch, 2880x1800, 60Hz OLED|Panel: OLED Tandem|Dimensions: 0.58 x 11.6 x 7.8 inches|Weight: 2.6 lbs|Battery Life: 16h 38m|OS: Windows 11 Home|Wireless: Wi-Fi 7, Bluetooth 5.4|Ports: 2x Thunderbolt 4|Touch Screen: Yes', 'Impressive battery life (16+ hours),Gorgeous tandem OLED display,Sleek and compact design,High-quality audio,Premium build quality', 'Lattice keyboard looks better than it works,Just two Thunderbolt 4 ports,No headphone jack,No mobile broadband option,Limited port connectivity'),
(4, 'iPad Pro 12.9', 'Large tablet with M2 chip', 1099.99, 25, 2, 2, NULL, NULL, NULL, NULL),
(5, 'Samsung Galaxy Buds', 'Wireless earbuds', 149.99, 100, 2, 1, NULL, NULL, NULL, NULL),
(6, 'USB-C Cable Pack', 'Pack of 3 USB-C cables', 19.99, 200, 5, 4, NULL, NULL, NULL, NULL),
(8, 'Lenovo ThinkPad X1 Carbon', 'Premium business laptop with Intel Core Ultra processor, 16GB RAM, 512GB SSD, 14-inch FHD display, and all-day battery life. Perfect for professionals.', 1299.99, 25, 3, 5, 'lenovo1.jpg', NULL, NULL, NULL),
(9, 'Lenovo Yoga 9i 2-in-1 Aura Edition', 'The Lenovo Yoga 9i 2-in-1 Aura Edition takes the Yoga 2-in-1 form factor we already loved and makes it even better, complete with a stunning OLED display, a thin-and-light design, admirable battery life, and a stellar keyboard. If you''re looking for a versatile, do-it-all Lenovo laptop, this is the one to get.', 1799.99, 15, 3, 5, 'lenovo2.jpg', 'CPU: Intel Core Ultra 7 258V|GPU: Intel Arc 140V integrated graphics|RAM: 32GB|Storage: 1TB SSD|Display: 14-inch, 2880 x 1800, 120Hz OLED|Weight: 2.9 pounds|Battery: Up to 15 hours|Ports: 2x Thunderbolt 4, 1x USB-A', 'Slim and light design,Long battery life,Stunning OLED display with 149.2% DCI-P3 color gamut,Smooth keyboard and touchpad,Awesome speakers,2-in-1 flexibility,Strong gaming performance', 'Performance could be better for the price - Geekbench 6 score of 11,059 falls behind MacBook Air M4');

INSERT INTO cart (cart_id, customer_id, product_id, quantity, added_at) VALUES
(1, 1, 1, 3, '2025-12-13 10:46:46'),
(2, 1, 2, 4, '2025-12-13 10:46:54'),
(3, 1, 3, 1, '2025-12-13 10:46:59'),
(4, 1, 4, 1, '2025-12-13 10:47:01'),
(5, 5, 1, 2, '2025-12-13 11:13:56'),
(6, 5, 2, 2, '2025-12-13 11:13:56'),
(7, 5, 3, 2, '2025-12-13 11:13:57'),
(8, 5, 4, 2, '2025-12-13 11:13:59'),
(9, 5, 5, 2, '2025-12-13 11:13:59'),
(10, 5, 6, 2, '2025-12-13 11:14:00'),
(23, 7, 9, 1, '2025-12-18 08:31:40'),
(24, 7, 8, 1, '2025-12-18 15:47:56');
