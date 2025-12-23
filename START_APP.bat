@echo off
REM =====================================
REM Gizmohub Startup Script
REM =====================================

echo.
echo ===================================
echo   GIZMOHUB STARTUP SCRIPT
echo ===================================
echo.

REM Add Node.js to PATH
set PATH=C:\Program Files\nodejs;%PATH%

REM Navigate to project
cd /d C:\xampp\htdocs\gizmohub-transformation

REM Kill any existing processes
echo [1/3] Cleaning up old processes...
taskkill /F /IM node.exe /T 2>nul
timeout /t 1 /nobreak

REM Start Backend Server
echo [2/3] Starting Backend Server (Port 5001 or 5000)...
start "Gizmohub Backend" cmd /k node server.js
timeout /t 2 /nobreak

REM Start Frontend Server
echo [3/3] Starting Frontend Server (Port 3000)...
start "Gizmohub Frontend" cmd /k node node_modules/vite/bin/vite.js

echo.
echo ===================================
echo   STARTUP COMPLETE
echo ===================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000 or http://localhost:5001
echo.
echo Demo Credentials:
echo   Email: demo@gizmohub.com
echo   Password: demo123
echo.
echo Admin Credentials:
echo   Username: admin
echo   Password: admin123
echo.
echo Press any key to continue...
pause

