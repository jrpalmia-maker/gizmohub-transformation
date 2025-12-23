@echo off
REM Test Categories and Brands API Endpoints

echo.
echo ========================================
echo Testing Categories & Brands API
echo ========================================
echo.

echo 1. Testing GET /api/categories
echo    URL: http://localhost:5001/api/categories
echo.
powershell -Command "(Invoke-WebRequest -Uri 'http://localhost:5001/api/categories' -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json"
echo.
echo.

echo 2. Testing GET /api/brands
echo    URL: http://localhost:5001/api/brands
echo.
powershell -Command "(Invoke-WebRequest -Uri 'http://localhost:5001/api/brands' -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json"
echo.
echo.

echo 3. Testing GET /api/products/category/1
echo    URL: http://localhost:5001/api/products/category/1
echo.
powershell -Command "(Invoke-WebRequest -Uri 'http://localhost:5001/api/products/category/1' -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json"
echo.
echo.

echo 4. Testing GET /api/products/brand/1
echo    URL: http://localhost:5001/api/products/brand/1
echo.
powershell -Command "(Invoke-WebRequest -Uri 'http://localhost:5001/api/products/brand/1' -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json"
echo.
echo.

echo Test Complete!
pause
