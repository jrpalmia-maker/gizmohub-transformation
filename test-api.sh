#!/bin/bash
# Test Categories and Brands API Endpoints

echo "Testing Categories & Brands API Endpoints"
echo "=========================================="
echo ""

# Test Categories endpoint
echo "1. Testing GET /api/categories"
echo "   URL: http://localhost:5001/api/categories"
curl -s http://localhost:5001/api/categories | json_pp
echo ""
echo ""

# Test Brands endpoint
echo "2. Testing GET /api/brands"
echo "   URL: http://localhost:5001/api/brands"
curl -s http://localhost:5001/api/brands | json_pp
echo ""
echo ""

# Test Get Products by Category (example with category_id = 1)
echo "3. Testing GET /api/products/category/1"
echo "   URL: http://localhost:5001/api/products/category/1"
curl -s http://localhost:5001/api/products/category/1 | json_pp
echo ""
echo ""

# Test Get Products by Brand (example with brand_id = 1)
echo "4. Testing GET /api/products/brand/1"
echo "   URL: http://localhost:5001/api/products/brand/1"
curl -s http://localhost:5001/api/products/brand/1 | json_pp
echo ""
echo ""

echo "Test Complete!"
