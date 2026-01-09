-- PostgreSQL Schema for Gizmohub Transformation
-- This will be auto-executed by Railway when the PostgreSQL database is created

CREATE TABLE IF NOT EXISTS admins (
  admin_id SERIAL PRIMARY KEY,
  full_name VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS brands (
  brand_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS customers (
  customer_id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  description TEXT,
  image VARCHAR(255),
  category_id INT REFERENCES categories(category_id),
  brand_id INT REFERENCES brands(brand_id)
);

CREATE TABLE IF NOT EXISTS cart (
  cart_id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(customer_id),
  product_id INT REFERENCES products(product_id),
  quantity INT DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  order_id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(customer_id),
  total DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'pending',
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  order_item_id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(order_id),
  product_id INT REFERENCES products(product_id),
  quantity INT,
  price DECIMAL(10, 2)
);

CREATE TABLE IF NOT EXISTS payments (
  payment_id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(order_id),
  amount DECIMAL(10, 2),
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending',
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data
INSERT INTO brands (name, description) VALUES 
('Lenovo', 'Lenovo computers and laptops'),
('Dell', 'Dell computers and displays'),
('Apple', 'Apple devices'),
('Sony', 'Sony electronics');

INSERT INTO categories (name, description) VALUES 
('Computers', 'Desktop and laptop computers'),
('Audio', 'Audio equipment and headphones'),
('Displays', 'Monitors and display devices'),
('Accessories', 'Computer accessories');

-- Sample Admin (password: admin123)
INSERT INTO admins (full_name, username, password) VALUES 
('Admin User', 'admin', '$2b$10$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMm6');

-- Sample Products
INSERT INTO products (name, price, stock, category_id, brand_id, description) VALUES 
('Lenovo ThinkPad X1', 1299.99, 45, 1, 1, 'Premium business laptop'),
('Dell XPS 13', 1199.99, 32, 1, 2, 'High-performance ultrabook'),
('Sony Wireless Headphones', 199.99, 128, 2, 4, 'Premium wireless audio'),
('4K Gaming Monitor', 599.99, 22, 3, 2, 'Ultra HD gaming display'),
('USB-C Hub', 49.99, 200, 4, 1, 'Multi-port USB hub');
