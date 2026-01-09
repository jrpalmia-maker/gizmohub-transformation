import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const app = express();
app.use(express.json());
app.use(cors());

// Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// PostgreSQL Connection Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Alternative: If DATABASE_URL is not available, build from components
if (!process.env.DATABASE_URL) {
    pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'gizmohub_db',
    });
}

// Start Server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
console.log('Creating server on port:', PORT);
console.log('Binding to host:', HOST);

let server;
try {
    server = app.listen(PORT, HOST, () => {
        console.log(`✓ Server listening on ${HOST}:${PORT}`);
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

        const connection = await pool.getConnection();
        
        // Support login by email, username (first_name), or phone
        const [users] = await connection.query(
            'SELECT * FROM customers WHERE email = ? OR first_name = ? OR phone = ?',
            [email, email, email]
        );
        connection.release();

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
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

        const connection = await pool.getConnection();
        const [admins] = await connection.query(
            'SELECT * FROM admins WHERE username = ?',
            [username]
        );
        connection.release();

        if (admins.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const admin = admins[0];
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

        const connection = await pool.getConnection();

        // Check if email exists
        const [existing] = await connection.query(
            'SELECT * FROM customers WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            connection.release();
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Simple password storage (in production use bcrypt)
        const hashedPassword = password;

        await connection.query(
            'INSERT INTO customers (email, first_name, last_name, password, phone) VALUES (?, ?, ?, ?, ?)',
            [email, first_name, last_name, hashedPassword, phone || null]
        );

        connection.release();

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
        const connection = await pool.getConnection();
        console.log('Connection acquired');
        const [products] = await connection.query(
            `SELECT p.*, c.name as category_name, b.name as brand_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN brands b ON p.brand_id = b.brand_id`
        );
        console.log('Query executed, got ' + products.length + ' products');
        connection.release();

        res.json(products);
    } catch (error) {
        console.error('Products fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch products', details: error.message });
    }
});// Get Product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        const [products] = await connection.query(
            `SELECT p.*, c.name as category_name, b.name as brand_name 
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.category_id
             LEFT JOIN brands b ON p.brand_id = b.brand_id
             WHERE p.product_id = ?`,
            [id]
        );
        connection.release();

        if (products.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(products[0]);
    } catch (error) {
        console.error('Product fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Get All Categories
app.get('/api/categories', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [categories] = await connection.query(
            'SELECT * FROM categories ORDER BY name ASC'
        );
        connection.release();

        res.json(categories);
    } catch (error) {
        console.error('Categories fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
    }
});

// Get All Brands
app.get('/api/brands', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [brands] = await connection.query(
            'SELECT * FROM brands ORDER BY name ASC'
        );
        connection.release();

        res.json(brands);
    } catch (error) {
        console.error('Brands fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch brands', details: error.message });
    }
});

// Get Products by Category
app.get('/api/products/category/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;
        const connection = await pool.getConnection();
        const [products] = await connection.query(
            `SELECT p.*, c.name as category_name, b.name as brand_name 
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.category_id
             LEFT JOIN brands b ON p.brand_id = b.brand_id
             WHERE p.category_id = ?
             ORDER BY p.name ASC`,
            [categoryId]
        );
        connection.release();

        res.json(products);
    } catch (error) {
        console.error('Products by category fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch products by category', details: error.message });
    }
});

// Get Products by Brand
app.get('/api/products/brand/:brandId', async (req, res) => {
    try {
        const { brandId } = req.params;
        const connection = await pool.getConnection();
        const [products] = await connection.query(
            `SELECT p.*, c.name as category_name, b.name as brand_name 
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.category_id
             LEFT JOIN brands b ON p.brand_id = b.brand_id
             WHERE p.brand_id = ?
             ORDER BY p.name ASC`,
            [brandId]
        );
        connection.release();

        res.json(products);
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
        const connection = await pool.getConnection();
        const [cartItems] = await connection.query(
            `SELECT c.*, p.name, p.price, p.image, cat.name as category_name
             FROM cart c
             JOIN products p ON c.product_id = p.product_id
             LEFT JOIN categories cat ON p.category_id = cat.category_id
             WHERE c.customer_id = ?`,
            [customerId]
        );
        connection.release();

        res.json(cartItems);
    } catch (error) {
        console.error('Cart fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// Add to Cart
app.post('/api/cart', async (req, res) => {
    try {
        const { customerId, productId, quantity } = req.body;

        const connection = await pool.getConnection();

        // Check if product exists in cart
        const [existing] = await connection.query(
            'SELECT * FROM cart WHERE customer_id = ? AND product_id = ?',
            [customerId, productId]
        );

        if (existing.length > 0) {
            // Update quantity
            await connection.query(
                'UPDATE cart SET quantity = quantity + ? WHERE customer_id = ? AND product_id = ?',
                [quantity, customerId, productId]
            );
        } else {
            // Insert new cart item
            await connection.query(
                'INSERT INTO cart (customer_id, product_id, quantity) VALUES (?, ?, ?)',
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
