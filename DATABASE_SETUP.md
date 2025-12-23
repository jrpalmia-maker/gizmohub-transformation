# Gizmohub Database Integration Setup Guide

## Overview
This guide will help you integrate your XAMPP MySQL database (`gizmohub_db`) with the Gizmohub Transformation application.

---

## Prerequisites

1. **XAMPP Running** - MySQL server must be active
2. **Database Created** - `gizmohub_db` with all tables
3. **Node.js Installed** - For running the backend server
4. **Backend Packages** - Install new dependencies

---

## Step 1: Prepare Your Database

Make sure your `gizmohub_db` database exists with these tables:

```sql
-- Run this in phpMyAdmin or MySQL CLI if tables don't exist yet

CREATE TABLE IF NOT EXISTS admins (
  admin_id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS brands (
  brand_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS categories (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS customers (
  customer_id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  description TEXT,
  image VARCHAR(255),
  category_id INT,
  brand_id INT,
  FOREIGN KEY (category_id) REFERENCES categories(category_id),
  FOREIGN KEY (brand_id) REFERENCES brands(brand_id)
);

CREATE TABLE IF NOT EXISTS cart (
  cart_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT,
  product_id INT,
  quantity INT DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT,
  total DECIMAL(10, 2),
  status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE IF NOT EXISTS order_items (
  order_item_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL(10, 2),
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE IF NOT EXISTS payments (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  amount DECIMAL(10, 2),
  payment_method ENUM('credit_card', 'debit_card', 'paypal', 'bank_transfer'),
  payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(order_id)
);
```

---

## Step 2: Add Sample Data (Optional)

```sql
-- Insert sample admin
INSERT INTO admins (full_name, username, password) VALUES 
('Admin User', 'admin', '$2b$10$...');  -- Use bcrypt hash

-- Insert sample brands
INSERT INTO brands (name, description) VALUES 
('TechCorp', 'Leading technology brand'),
('AudioMax', 'Premium audio equipment');

-- Insert sample categories
INSERT INTO categories (name, description) VALUES 
('Computers', 'Desktop and laptop computers'),
('Audio', 'Audio equipment and headphones'),
('Displays', 'Monitors and display devices');

-- Insert sample customers
INSERT INTO customers (first_name, last_name, email, password, phone) VALUES 
('John', 'Doe', 'john@example.com', '$2b$10$...', '555-1234');

-- Insert sample products
INSERT INTO products (name, price, stock, category_id, brand_id, description) VALUES 
('Pro Laptop 15"', 1299.99, 45, 1, 1, 'High-performance laptop'),
('Wireless Headphones', 199.99, 128, 2, 2, 'Premium wireless headphones'),
('Gaming Monitor 4K', 599.99, 22, 3, 1, 'Ultra HD gaming monitor');
```

---

## Step 3: Update Environment Variables

Edit `.env.local` and ensure database credentials match your XAMPP setup:

```bash
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=gizmohub_db

# Server Configuration
PORT=5000
JWT_SECRET=your-gizmohub-secret-key-change-in-production
```

**Note:** By default, XAMPP MySQL user is `root` with no password.

---

## Step 4: Install Backend Dependencies

```bash
cd c:\xampp\htdocs\gizmohub-transformation
npm install
```

This will install:
- `express` - Web server
- `mysql2` - MySQL database driver
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

---

## Step 5: Run the Application

### Option A: Run Frontend Only (uses demo data)
```bash
npm run dev
```

### Option B: Run Frontend + Backend (uses database)
```bash
npm run dev:all
```

This starts:
- **Frontend:** http://localhost:3000/ (Vite dev server)
- **Backend:** http://localhost:5000/ (Express API)

### Option C: Run Only Backend
```bash
npm run server
```

For development with auto-reload:
```bash
npm run server:dev
```

---

## Step 6: Test the Integration

### 1. **Check Backend Connection**
Open: http://localhost:5000/api/products

Should return your products from the database.

### 2. **Test Customer Login**
1. Navigate to http://localhost:3000/
2. Click "Login"
3. Use customer email and password
4. Should authenticate and show dashboard

### 3. **Test Admin Login**
1. Click "Login" 
2. Select "Admin" role
3. Enter admin username and password
4. Should show admin dashboard with stats

### 4. **Test Cart & Orders**
1. Login as customer
2. Add products to cart
3. Cart should update in database
4. Proceed to checkout (if implemented)

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/login` - Customer login
- `POST /api/auth/admin-login` - Admin login
- `POST /api/auth/register` - Customer registration

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details

### Cart
- `GET /api/cart/:customerId` - Get customer cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:cartId` - Update quantity
- `DELETE /api/cart/:cartId` - Remove item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:customerId` - Get customer orders

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/low-stock` - Products with low inventory

---

## Troubleshooting

### "Cannot connect to MySQL"
- Ensure XAMPP MySQL is running
- Check DB_HOST, DB_USER, DB_PASSWORD in .env.local
- Verify `gizmohub_db` database exists

### "Port 5000 already in use"
- Change PORT in .env.local
- Or kill process: `netstat -ano | findstr :5000`

### "CORS errors"
- Backend is running on different port
- Update API_BASE_URL if needed
- Check CORS configuration in server.js

### "Bcrypt errors"
- Make sure bcrypt is installed: `npm install bcrypt`
- Restart dev server after installing

---

## Next Steps

1. **Seed more data** - Add more products, categories, brands
2. **Implement checkout** - Add payment processing
3. **Add email notifications** - Notify customers on order status
4. **Implement product search** - Add filtering and search endpoints
5. **Add user reviews** - Create reviews/ratings system

---

## Security Notes

⚠️ **Before Production:**

1. **Change JWT_SECRET** in `.env.local`
2. **Set DB_PASSWORD** if using XAMPP with authentication
3. **Enable HTTPS** for all endpoints
4. **Add input validation** on all endpoints
5. **Add rate limiting** to prevent abuse
6. **Use environment variables** - Never commit .env.local
7. **Hash passwords** - Always use bcrypt (already implemented)
8. **Validate tokens** - Add middleware authentication

---

## Support

For issues or questions:
1. Check error logs in terminal
2. Review MySQL error logs in XAMPP
3. Verify all tables exist in database
4. Ensure all dependencies are installed
