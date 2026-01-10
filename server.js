import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pkg;
const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from dist folder (React build)
app.use(express.static(path.join(__dirname, 'dist')));

// Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Debug: Log environment
console.log('Environment variables loaded:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET (' + process.env.DATABASE_URL.substring(0, 30) + '...)' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);

// PostgreSQL Connection Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

// Database Initialization Function
async function initializeDatabase() {
    try {
        console.log('Attempting to connect to PostgreSQL...');
        const client = await pool.connect();
        console.log('✓ Successfully connected to PostgreSQL database');
        console.log('✓ Database connected, initializing schema...');

        // Create sequences
        const sequences = [
            'CREATE SEQUENCE IF NOT EXISTS admins_admin_id_seq START WITH 4',
            'CREATE SEQUENCE IF NOT EXISTS brands_brand_id_seq START WITH 9',
            'CREATE SEQUENCE IF NOT EXISTS cart_cart_id_seq START WITH 25',
            'CREATE SEQUENCE IF NOT EXISTS categories_category_id_seq START WITH 10',
            'CREATE SEQUENCE IF NOT EXISTS customers_customer_id_seq START WITH 10',
            'CREATE SEQUENCE IF NOT EXISTS orders_order_id_seq START WITH 1',
            'CREATE SEQUENCE IF NOT EXISTS order_items_order_item_id_seq START WITH 1',
            'CREATE SEQUENCE IF NOT EXISTS payments_payment_id_seq START WITH 1',
            'CREATE SEQUENCE IF NOT EXISTS products_product_id_seq START WITH 10'
        ];

        for (const seq of sequences) {
            await client.query(seq);
        }
        console.log('✓ Sequences created');

        // Create tables
        await client.query(`
            CREATE TABLE IF NOT EXISTS admins (
              admin_id INTEGER PRIMARY KEY DEFAULT nextval('admins_admin_id_seq'),
              username VARCHAR(50) UNIQUE NOT NULL,
              password VARCHAR(255) NOT NULL,
              full_name VARCHAR(100),
              profile_picture BYTEA
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS brands (
              brand_id INTEGER PRIMARY KEY DEFAULT nextval('brands_brand_id_seq'),
              name VARCHAR(100) NOT NULL,
              description TEXT
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS categories (
              category_id INTEGER PRIMARY KEY DEFAULT nextval('categories_category_id_seq'),
              name VARCHAR(100) NOT NULL,
              description TEXT
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS customers (
              customer_id INTEGER PRIMARY KEY DEFAULT nextval('customers_customer_id_seq'),
              first_name VARCHAR(50) NOT NULL,
              last_name VARCHAR(50) NOT NULL,
              email VARCHAR(100) UNIQUE NOT NULL,
              password VARCHAR(255) NOT NULL,
              phone VARCHAR(20),
              address TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              profile_picture BYTEA
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
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
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS cart (
              cart_id INTEGER PRIMARY KEY DEFAULT nextval('cart_cart_id_seq'),
              customer_id INTEGER REFERENCES customers(customer_id) ON DELETE CASCADE,
              product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
              quantity INTEGER DEFAULT 1,
              added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS orders (
              order_id INTEGER PRIMARY KEY DEFAULT nextval('orders_order_id_seq'),
              customer_id INTEGER REFERENCES customers(customer_id) ON DELETE CASCADE,
              total DECIMAL(10, 2) NOT NULL,
              status VARCHAR(20) DEFAULT 'Pending',
              order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS order_items (
              order_item_id INTEGER PRIMARY KEY DEFAULT nextval('order_items_order_item_id_seq'),
              order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
              product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
              quantity INTEGER NOT NULL,
              price DECIMAL(10, 2) NOT NULL
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS payments (
              payment_id INTEGER PRIMARY KEY DEFAULT nextval('payments_payment_id_seq'),
              order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
              payment_method VARCHAR(50) NOT NULL,
              payment_status VARCHAR(20) DEFAULT 'Pending',
              amount DECIMAL(10, 2) NOT NULL,
              payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✓ All tables created');

        // Insert initial data (only if empty)
        const adminCheck = await client.query('SELECT COUNT(*) FROM admins');
        if (adminCheck.rows[0].count === '0' || adminCheck.rows[0].count === 0) {
            console.log('Inserting initial data...');
            try {
                await client.query(`
                    INSERT INTO admins (admin_id, username, password, full_name) VALUES
                    (1, 'admin', 'admin123', 'John Ron Paul Almia'),
                    (2, 'jrpalmia@gmail.com', 'almia123', 'john ron paul almia')
                `);
                console.log('✓ Admins inserted');
            } catch (err) {
                console.error('Failed to insert admins:', err.message);
            }

            try {
                await client.query(`
                    INSERT INTO brands (brand_id, name, description) VALUES
                    (1, 'Samsung', 'Leading electronics manufacturer'),
                    (2, 'Apple', 'Premium technology brand'),
                    (3, 'Dell', 'Computer and laptop brand'),
                    (4, 'Generic', 'Various brands'),
                    (5, 'Lenovo', 'Lenovo is a leading global technology company')
                `);
                console.log('✓ Brands inserted');
            } catch (err) {
                console.error('Failed to insert brands:', err.message);
            }

            try {
                await client.query(`
                    INSERT INTO categories (category_id, name, description) VALUES
                    (2, 'Smartphones', 'Mobile phones and accessories'),
                    (3, 'Laptops', 'Computers and notebooks'),
                    (4, 'Tablets', 'Tablet devices and accessories'),
                    (5, 'Accessories', 'Phone and computer accessories')
                `);
                console.log('✓ Categories inserted');
            } catch (err) {
                console.error('Failed to insert categories:', err.message);
            }

            try {
                await client.query(`
                    INSERT INTO customers (customer_id, first_name, last_name, email, password, phone, address, created_at) VALUES
                    (1, 'junjun', 'labyu', 'meow@gmail.com', '12345678', NULL, NULL, '2025-12-01 12:42:41'),
                    (4, 'Demo', 'User', 'demo@gizmohub.com', 'demo123', '555-0000', NULL, '2025-12-13 10:24:10')
                `);
                console.log('✓ Customers inserted');
            } catch (err) {
                console.error('Failed to insert customers:', err.message);
            }

            try {
                await client.query(`
                    INSERT INTO products (product_id, name, description, price, stock, category_id, brand_id) VALUES
                    (1, 'Samsung Galaxy S24', 'Latest Samsung smartphone with 5G', 999.99, 50, 2, 1),
                    (2, 'iPhone 15 Pro', 'Premium Apple smartphone', 1299.99, 30, 2, 2),
                    (3, 'Dell XPS 13', 'Portable and powerful laptop', 1199.99, 20, 3, 3)
                `);
                console.log('✓ Products inserted');
            } catch (err) {
                console.error('Failed to insert products:', err.message);
            }

            console.log('✓ Sample data insertion complete');
        } else {
            console.log('✓ Data already exists in database');
        }

        client.release();
        console.log('✓ Database initialization complete!\n');
    } catch (err) {
        console.error('Database initialization error:', err.message);
    }
}

// Start Server
// =====================
// ORDERS ENDPOINTS
// =====================

app.post('/api/orders', async (req, res) => {
    try {
        const { customer_id, items, total, status } = req.body;

        if (!customer_id || !items || !total) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await pool.query(
            'INSERT INTO orders (customer_id, total, status) VALUES ($1, $2, $3) RETURNING order_id',
            [customer_id, total, status || 'Pending']
        );

        const orderId = result.rows[0].order_id;

        // Insert order items
        for (const item of items) {
            await pool.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        res.json({ order_id: orderId, message: 'Order created successfully' });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Failed to create order', details: error.message });
    }
});

app.get('/api/orders/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;
        const result = await pool.query(
            'SELECT * FROM orders WHERE customer_id = $1 ORDER BY order_date DESC',
            [customerId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Orders fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// =====================
// PAYMENTS ENDPOINTS
// =====================

app.post('/api/payments', async (req, res) => {
    try {
        const { order_id, payment_method, amount, payment_status } = req.body;

        if (!order_id || !payment_method || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await pool.query(
            'INSERT INTO payments (order_id, payment_method, amount, payment_status) VALUES ($1, $2, $3, $4) RETURNING payment_id',
            [order_id, payment_method, amount, payment_status || 'Pending']
        );

        // Update order status to Completed
        await pool.query(
            'UPDATE orders SET status = $1 WHERE order_id = $2',
            ['Completed', order_id]
        );

        res.json({ payment_id: result.rows[0].payment_id, message: 'Payment processed successfully' });
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({ error: 'Failed to process payment', details: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
console.log('Creating server on port:', PORT);
console.log('Binding to host:', HOST);

let server;
try {
    server = app.listen(PORT, HOST, async () => {
        console.log(`✓ Server listening on ${HOST}:${PORT}`);
        // Initialize database on startup
        await initializeDatabase();
    });
} catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
}

console.log('Server started, setting up error handler...');
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} in use, trying ${PORT + 1}...`);
        const altServer = app.listen(PORT + 1, HOST, () => {
            console.log(`✓ Server listening on ${HOST}:${PORT + 1}`);
        });
        altServer.on('error', (altErr) => {
            console.error('Server error on alternate port:', altErr);
            process.exit(1);
        });
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});

// Test database connection asynchronously (doesn't block server start)
console.log('Testing database connection...');
pool.connect().then(conn => {
    console.log('✓ Database connected successfully');
    conn.release();
}).catch(err => {
    console.error('✗ Database connection failed:', err.message);
});

// Global error handler middleware (commented out - test without it first)
// app.use((err, req, res, next) => {
//     console.error('Express error:', err);
//     res.status(500).json({ error: 'Internal server error', message: err.message });
// });

// Simple session storage (in production use Redis/database)
const sessions = new Map();

// =====================
// AUTH ENDPOINTS
// =====================

// Customer Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Support login by email, username (first_name), or phone
        const result = await pool.query(
            'SELECT * FROM customers WHERE email = $1 OR first_name = $2 OR phone = $3',
            [email, email, email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        // Simple password comparison (in production use bcrypt)
        const isPasswordValid = password === user.password;

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create session token
        const token = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessions.set(token, { id: user.customer_id, email: user.email, role: 'customer' });

        res.json({
            token,
            user: {
                id: user.customer_id,
                email: user.email,
                name: `${user.first_name} ${user.last_name}`,
                role: 'customer',
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Admin Login
app.post('/api/auth/admin-login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await pool.query(
            'SELECT * FROM admins WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const admin = result.rows[0];
        // Simple password comparison (in production use bcrypt)
        const isPasswordValid = password === admin.password;

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Create session token
        const token = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessions.set(token, { id: admin.admin_id, username: admin.username, role: 'admin' });

        res.json({
            token,
            user: {
                id: admin.admin_id,
                username: admin.username,
                name: admin.full_name,
                role: 'admin',
            },
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Admin login failed' });
    }
});

// Customer Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, first_name, last_name, password, phone } = req.body;

        // Validate required fields
        if (!email || !first_name || !last_name || !password) {
            return res.status(400).json({ error: 'Missing required fields: email, first_name, last_name, password' });
        }

        // Check if email exists
        const existingResult = await pool.query(
            'SELECT * FROM customers WHERE email = $1',
            [email]
        );

        if (existingResult.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Simple password storage (in production use bcrypt)
        const hashedPassword = password;

        await pool.query(
            'INSERT INTO customers (email, first_name, last_name, password, phone) VALUES ($1, $2, $3, $4, $5)',
            [email, first_name, last_name, hashedPassword, phone || null]
        );

        res.json({ message: 'Registration successful. Please login.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed: ' + error.message });
    }
});

// =====================
// PRODUCTS ENDPOINTS
// =====================

// Get All Products
app.get('/api/products', async (req, res) => {
    try {
        console.log('Fetching products...');
        const result = await pool.query(
            `SELECT p.*, c.name as category_name, b.name as brand_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN brands b ON p.brand_id = b.brand_id`
        );
        console.log('Query executed, got ' + result.rows.length + ' products');

        res.json(result.rows);
    } catch (error) {
        console.error('Products fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch products', details: error.message });
    }
});

// Get Product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT p.*, c.name as category_name, b.name as brand_name 
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.category_id
             LEFT JOIN brands b ON p.brand_id = b.brand_id
             WHERE p.product_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Product fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Get All Categories
app.get('/api/categories', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM categories ORDER BY name ASC'
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Categories fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
    }
});

// Get All Brands
app.get('/api/brands', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM brands ORDER BY name ASC'
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Brands fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch brands', details: error.message });
    }
});

// Get Products by Category
app.get('/api/products/category/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;
        const result = await pool.query(
            `SELECT p.*, c.name as category_name, b.name as brand_name 
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.category_id
             LEFT JOIN brands b ON p.brand_id = b.brand_id
             WHERE p.category_id = $1
             ORDER BY p.name ASC`,
            [categoryId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Products by category fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch products by category', details: error.message });
    }
});

// Get Products by Brand
app.get('/api/products/brand/:brandId', async (req, res) => {
    try {
        const { brandId } = req.params;
        const result = await pool.query(
            `SELECT p.*, c.name as category_name, b.name as brand_name 
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.category_id
             LEFT JOIN brands b ON p.brand_id = b.brand_id
             WHERE p.brand_id = $1
             ORDER BY p.name ASC`,
            [brandId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Products by brand fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch products by brand', details: error.message });
    }
});

// =====================
// CART ENDPOINTS
// =====================

// Get Cart Items
app.get('/api/cart/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;
        const result = await pool.query(
            `SELECT c.*, p.name, p.price, p.image, cat.name as category_name
             FROM cart c
             JOIN products p ON c.product_id = p.product_id
             LEFT JOIN categories cat ON p.category_id = cat.category_id
             WHERE c.customer_id = $1`,
            [customerId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Cart fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// Add to Cart
app.post('/api/cart', async (req, res) => {
    try {
        const { customerId, productId, quantity } = req.body;

        // Check if product exists in cart
        const existingResult = await pool.query(
            'SELECT * FROM cart WHERE customer_id = $1 AND product_id = $2',
            [customerId, productId]
        );

        if (existingResult.rows.length > 0) {
            // Update quantity
            await pool.query(
                'UPDATE cart SET quantity = quantity + $1 WHERE customer_id = $2 AND product_id = $3',
                [quantity, customerId, productId]
            );
        } else {
            // Insert new cart item
            await pool.query(
                'INSERT INTO cart (customer_id, product_id, quantity) VALUES ($1, $2, $3)',
                [customerId, productId, quantity]
            );
        }

        connection.release();
        res.json({ message: 'Added to cart' });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ error: 'Failed to add to cart' });
    }
});

// Update Cart Item Quantity
app.put('/api/cart/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;
        const { quantity } = req.body;

        const connection = await pool.getConnection();

        if (quantity <= 0) {
            await connection.query('DELETE FROM cart WHERE cart_id = ?', [cartId]);
        } else {
            await connection.query(
                'UPDATE cart SET quantity = ? WHERE cart_id = ?',
                [quantity, cartId]
            );
        }

        connection.release();
        res.json({ message: 'Cart updated' });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ error: 'Failed to update cart' });
    }
});

// Delete Cart Item
app.delete('/api/cart/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;
        const connection = await pool.getConnection();
        await connection.query('DELETE FROM cart WHERE cart_id = ?', [cartId]);
        connection.release();

        res.json({ message: 'Removed from cart' });
    } catch (error) {
        console.error('Delete cart error:', error);
        res.status(500).json({ error: 'Failed to remove from cart' });
    }
});

// =====================
// ORDERS ENDPOINTS
// =====================

// Create Order
app.post('/api/orders', async (req, res) => {
    try {
        const { customerId, cartItems, total } = req.body;
        const connection = await pool.getConnection();

        // Start transaction
        await connection.beginTransaction();

        // Create order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (customer_id, total, status) VALUES (?, ?, ?)',
            [customerId, total, 'pending']
        );

        const orderId = orderResult.insertId;

        // Add order items
        for (const item of cartItems) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );

            // Update product stock
            await connection.query(
                'UPDATE products SET stock = stock - ? WHERE product_id = ?',
                [item.quantity, item.product_id]
            );
        }

        // Clear customer cart
        await connection.query('DELETE FROM cart WHERE customer_id = ?', [customerId]);

        await connection.commit();
        connection.release();

        res.json({ orderId, message: 'Order created successfully' });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Get Orders
app.get('/api/orders/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;
        const connection = await pool.getConnection();
        const [orders] = await connection.query(
            'SELECT * FROM orders WHERE customer_id = ? ORDER BY order_date DESC',
            [customerId]
        );
        connection.release();

        res.json(orders);
    } catch (error) {
        console.error('Orders fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// =====================
// ADMIN ENDPOINTS
// =====================

// Get Dashboard Stats
app.get('/api/admin/stats', async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [totalProducts] = await connection.query(
            'SELECT COUNT(*) as count FROM products'
        );
        const [totalCustomers] = await connection.query(
            'SELECT COUNT(*) as count FROM customers'
        );
        const [totalOrders] = await connection.query(
            'SELECT COUNT(*) as count FROM orders'
        );
        const [totalRevenue] = await connection.query(
            'SELECT SUM(total) as revenue FROM orders WHERE status = "completed"'
        );

        connection.release();

        res.json({
            totalProducts: totalProducts[0].count,
            totalCustomers: totalCustomers[0].count,
            totalOrders: totalOrders[0].count,
            totalRevenue: totalRevenue[0].revenue || 0,
        });
    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Get Low Stock Products
app.get('/api/admin/low-stock', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [products] = await connection.query(
            'SELECT * FROM products WHERE stock < 20 ORDER BY stock ASC'
        );
        connection.release();

        res.json(products);
    } catch (error) {
        console.error('Low stock fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch low stock products' });
    }
});

// =====================
// ADMIN PRODUCT MANAGEMENT ENDPOINTS
// =====================

// Add Product
app.post('/api/products', async (req, res) => {
    try {
        const { name, description, price, stock, image, category_id, brand_id, specifications, pros, cons } = req.body;

        // Validate required fields
        if (!name || !price || stock === undefined || !category_id || !brand_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const connection = await pool.getConnection();
        const [result] = await connection.query(
            `INSERT INTO products (name, description, price, stock, image, category_id, brand_id, specifications, pros, cons) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description || '', price, stock, image || '', category_id, brand_id, specifications || '', pros || '', cons || '']
        );
        connection.release();

        res.status(201).json({ product_id: result.insertId, message: 'Product added successfully' });
    } catch (error) {
        console.error('Add product error:', error);
        res.status(500).json({ error: 'Failed to add product', details: error.message });
    }
});

// Update Product
app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, image, category_id, brand_id, specifications, pros, cons } = req.body;

        const connection = await pool.getConnection();
        await connection.query(
            `UPDATE products SET name=?, description=?, price=?, stock=?, image=?, category_id=?, brand_id=?, specifications=?, pros=?, cons=? 
             WHERE product_id=?`,
            [name, description || '', price, stock, image || '', category_id, brand_id, specifications || '', pros || '', cons || '', id]
        );
        connection.release();

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Failed to update product', details: error.message });
    }
});

// Delete Product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        await connection.query('DELETE FROM products WHERE product_id = ?', [id]);
        connection.release();

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Failed to delete product', details: error.message });
    }
});

// Add Category
app.post('/api/categories', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        const connection = await pool.getConnection();
        const [result] = await connection.query(
            'INSERT INTO categories (name) VALUES (?)',
            [name]
        );
        connection.release();

        res.status(201).json({ category_id: result.insertId, message: 'Category added successfully' });
    } catch (error) {
        console.error('Add category error:', error);
        res.status(500).json({ error: 'Failed to add category', details: error.message });
    }
});

// Add Brand
app.post('/api/brands', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Brand name is required' });
        }

        const connection = await pool.getConnection();
        const [result] = await connection.query(
            'INSERT INTO brands (name) VALUES (?)',
            [name]
        );
        connection.release();

        res.status(201).json({ brand_id: result.insertId, message: 'Brand added successfully' });
    } catch (error) {
        console.error('Add brand error:', error);
        res.status(500).json({ error: 'Failed to add brand', details: error.message });
    }
});
