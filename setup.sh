#!/bin/bash
# Quick Setup & Run Script for Gizmohub with Database Integration

echo "================================"
echo "  Gizmohub Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "   Please download from: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js detected: $(node --version)"
echo ""

# Check if MySQL is running (optional)
echo "Make sure:"
echo "  1. XAMPP MySQL service is running"
echo "  2. gizmohub_db database exists"
echo "  3. Database tables are created"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✓ Setup complete!"
echo ""
echo "================================"
echo "  Available Commands"
echo "================================"
echo ""
echo "Development:"
echo "  npm run dev        - Start frontend only (http://localhost:3000/)"
echo "  npm run server     - Start backend only (http://localhost:5000/)"
echo "  npm run server:dev - Start backend with auto-reload"
echo "  npm run dev:all    - Start both frontend & backend"
echo ""
echo "Production:"
echo "  npm run build      - Build frontend for production"
echo "  npm run preview    - Preview production build"
echo ""
echo "================================"
echo ""
echo "To get started:"
echo ""
echo "  1. Start MySQL in XAMPP"
echo "  2. Run: npm run dev:all"
echo "  3. Open: http://localhost:3000/"
echo ""
