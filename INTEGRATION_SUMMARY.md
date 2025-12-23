# Database Integration - Summary

## What Was Added

### 1. Backend Server (`server.js`)
Express.js API server that connects to your MySQL database with endpoints for:
- **Authentication** - Customer and admin login/registration
- **Products** - Fetch all products or by ID
- **Cart** - Add, update, remove cart items
- **Orders** - Create orders and track order history
- **Admin Dashboard** - Statistics and inventory management

### 2. API Service Layer (`services/api.ts`)
TypeScript service functions for all API calls:
- `authService` - Login, logout, registration
- `productsService` - Product fetching
- `cartService` - Cart operations
- `ordersService` - Order management
- `adminService` - Admin functions

### 3. Updated Auth Context (`context/AuthContext.tsx`)
Now connects to backend instead of using local storage:
- Authenticates against `customers` and `admins` tables
- Stores JWT token for authenticated requests
- Manages cart items with database persistence
- Supports role-based access control

### 4. Configuration Files
- `.env.local` - Database credentials and configuration
- `package.json` - Backend dependencies added
- `DATABASE_SETUP.md` - Complete setup instructions

---

## Files Modified

```
✓ .env.local                    (Added DB config)
✓ package.json                  (Added dependencies & scripts)
✓ context/AuthContext.tsx       (Now uses backend API)
✓ server.js                     (NEW - Express backend)
✓ services/api.ts              (NEW - API service layer)
✓ DATABASE_SETUP.md            (NEW - Setup guide)
```

---

## Database Schema

Your existing tables are compatible with these endpoints:

**admins**
- admin_id (PRI, INT)
- full_name (VARCHAR)
- username (UNI, VARCHAR)
- password (VARCHAR)

**customers**
- customer_id (PRI, INT)
- email (UNI, VARCHAR)
- first_name (VARCHAR)
- last_name (VARCHAR)
- password (VARCHAR)
- phone (VARCHAR, NULL)
- address (TEXT, NULL)
- created_at (TIMESTAMP)

**products**
- product_id (PRI, INT)
- name (VARCHAR)
- price (DECIMAL)
- stock (INT)
- description (TEXT, NULL)
- image (VARCHAR, NULL)
- category_id (MUL, INT, NULL)
- brand_id (MUL, INT, NULL)

**cart**
- cart_id (PRI, INT)
- customer_id (MUL, INT, NULL)
- product_id (MUL, INT, NULL)
- quantity (INT)
- added_at (TIMESTAMP)

**orders**
- order_id (PRI, INT)
- customer_id (MUL, INT, NULL)
- total (DECIMAL)
- status (ENUM)
- order_date (TIMESTAMP)

**order_items**
- order_item_id (PRI, INT)
- order_id (MUL, INT, NULL)
- product_id (MUL, INT, NULL)
- quantity (INT)
- price (DECIMAL)

**payments**
- payment_id (PRI, INT)
- order_id (MUL, INT, NULL)
- amount (DECIMAL)
- payment_method (ENUM)
- payment_status (ENUM)
- payment_date (TIMESTAMP)

**brands** & **categories** - Supporting tables

---

## How to Use

### Start Development (with database)
```bash
npm run dev:all
```

This runs both:
1. Frontend on `http://localhost:3000/`
2. Backend API on `http://localhost:5000/`

### Start Only Frontend (demo mode)
```bash
npm run dev
```

### Start Only Backend
```bash
npm run server
npm run server:dev  # with auto-reload
```

---

## Environment Variables (.env.local)

```
GEMINI_API_KEY=AIzaSyBKoJoZXRTiDFOBktFaxF_lx6K356FteNs

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=gizmohub_db

PORT=5000
JWT_SECRET=your-gizmohub-secret-key-change-in-production
```

---

## Next Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Ensure MySQL is running** in XAMPP

3. **Create/verify database tables** using DATABASE_SETUP.md

4. **Add sample data** (see DATABASE_SETUP.md for SQL)

5. **Start dev server:**
   ```bash
   npm run dev:all
   ```

6. **Test login:**
   - Go to http://localhost:3000/
   - Click Login
   - Use your database credentials

---

## API Documentation

See `server.js` for all endpoints with request/response examples.

Key endpoints:
- `POST /api/auth/login` - Customer authentication
- `POST /api/auth/admin-login` - Admin authentication
- `GET /api/products` - Get all products
- `POST /api/cart` - Add item to cart
- `POST /api/orders` - Create order
- `GET /api/admin/stats` - Admin dashboard stats

---

## Troubleshooting

**Problem:** Can't connect to database
- Verify XAMPP MySQL is running
- Check DB credentials in .env.local
- Ensure `gizmohub_db` database exists

**Problem:** Port already in use
- Change PORT in .env.local
- Or kill existing process on port 5000

**Problem:** Missing dependencies
- Run: `npm install`
- Make sure Node version is 16+

---

## Security Reminders

- Change JWT_SECRET before production
- Add proper input validation
- Use environment variables for all secrets
- Enable HTTPS in production
- Add rate limiting
- Implement proper error handling
