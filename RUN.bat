@echo off
cd /d C:\xampp\htdocs\gizmohub-transformation

echo.
echo ========================================
echo   🚀 GIZMOHUB - Starting Application
echo ========================================
echo.

REM Kill old processes
echo Cleaning up old processes...
taskkill /F /IM node.exe /T 2>nul >nul

REM Start Backend
echo.
echo Starting Backend Server...
echo - Port: 5000 (or 5001 if in use)
echo - URL: http://localhost:5001/api
echo.
start /min "Gizmohub Backend" cmd /c "node server.js & pause"
timeout /t 2 /nobreak

REM Start Frontend  
echo Starting Frontend Server...
echo - Port: 3000
echo - URL: http://localhost:3000
echo.
start /min "Gizmohub Frontend" cmd /c "node node_modules/vite/bin/vite.js & pause"
timeout /t 3 /nobreak

REM Open browser
echo.
echo Opening browser...
start http://localhost:3000

echo.
echo ========================================
echo   ✅ APPLICATION STARTED SUCCESSFULLY
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5001/api
echo.
echo Demo Login:
echo   Email: demo@gizmohub.com
echo   Password: demo123
echo.
echo This window will close in 10 seconds...
timeout /t 10

