# 🚀 Gizmohub Localhost Connection Guide

## ✅ Connection Status

Your application is now properly configured and connected!

| Component | Port | Status | URL |
|-----------|------|--------|-----|
| **Frontend (Vite)** | 3000 | ✅ Running | http://localhost:3000 |
| **Backend (Express)** | 5000/5001* | ✅ Running | http://localhost:5001/api |
| **Database (MySQL)** | 3306 | ✅ Connected | gizmohub_db |

*Backend may use port 5001 if 5000 is already in use. The frontend is automatically configured to use 5001.

---

## 🎯 Quick Start

### Option 1: Automated Startup (Recommended)
Double-click: **START_APP.bat**

This will:
- Clean up old processes
- Start Backend Server (Express.js)
- Start Frontend Server (Vite)
- Open both in separate windows

### Option 2: Manual Startup

**Terminal 1 - Backend:**
```bash
cd c:\xampp\htdocs\gizmohub-transformation
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd c:\xampp\htdocs\gizmohub-transformation
node node_modules/vite/bin/vite.js
```

Then open: **http://localhost:3000**

---

## 👤 Demo Accounts

### Customer Account
- **Email:** demo@gizmohub.com
- **Password:** demo123

### Admin Account
- **Username:** admin
- **Password:** admin123

---

## 🛠 Troubleshooting

### Port Already in Use
If you see "Port X in use, trying another port", it means:
- The backend will automatically try port 5001
- The frontend is already configured to use 5001
- Just access: **http://localhost:3000**

### Frontend Not Loading
1. Check if Vite is running: `netstat -ano | findstr :3000`
2. Check if backend is running: `netstat -ano | findstr :5001`
3. Clear browser cache: `Ctrl + Shift + Delete`

### API Errors
- Verify backend is running on port 5001 (or check terminal output)
- Check that MySQL/XAMPP is running
- Verify database `gizmohub_db` exists

### Clean Restart
```batch
taskkill /F /IM node.exe /T
START_APP.bat
```

---

## 📋 Features Available

✅ **Customer Features:**
- User Registration & Login
- Multi-credential login (email/username/phone)
- Shopping Cart
- Product Browsing
- Customer Profile
- Password strength indicator

✅ **Admin Features:**
- Admin Dashboard
- Insert Product Details
- Insert Order Details
- Insert Shipping Details
- Product Management

✅ **General Features:**
- AI Chat Assistant (Gemini API)
- Real-time inventory sync
- Responsive design (mobile & desktop)
- Dark/Light theme support

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `START_APP.bat` | Quick startup script |
| `start-frontend.bat` | Frontend only |
| `server.js` | Express backend API |
| `vite.config.ts` | Vite configuration |
| `services/api.ts` | API service layer (uses port 5001) |
| `context/AuthContext.tsx` | Authentication state management |

---

## 🔧 Configuration

### Backend Port (server.js)
- Default: 5000
- Fallback: 5001 (if 5000 in use)
- Uses MySQL on port 3306

### Frontend Port (vite.config.ts)
- Default: 3000
- Host: 0.0.0.0 (accessible on network)
- API Base URL: http://localhost:5001/api

---

## 📞 Support

**If you still can't connect:**

1. **Check all processes are running:**
   ```bash
   netstat -ano | findstr :3000
   netstat -ano | findstr :5001
   ```

2. **Check for Node errors:**
   - Look at the terminal output of START_APP.bat
   - Check MySQL is running in XAMPP Control Panel

3. **Force restart:**
   ```bash
   taskkill /F /IM node.exe /T
   START_APP.bat
   ```

---

## 🎉 You're All Set!

Access your application at: **http://localhost:3000**

Happy coding! 🚀
