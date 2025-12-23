@echo off
REM Add Node.js to PATH
set PATH=C:\Program Files\nodejs;%PATH%

cd /d C:\xampp\htdocs\gizmohub-transformation

echo ================================
echo GIZMOHUB STARTUP SCRIPT
echo ================================
echo.

REM Kill any existing node processes
echo Cleaning up existing processes...
taskkill /F /IM node.exe /T 2>nul
timeout /t 1 /nobreak

REM Start backend server
echo.
echo Starting Backend Server (Port 5000)...
start "Gizmohub Backend" "C:\Program Files\nodejs\node.exe" server.js

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak

REM Start frontend dev server  
echo.
echo Starting Frontend Dev Server (Port 3000)...
start "Gizmohub Frontend" cmd /c "set PATH=C:\Program Files\nodejs;%PATH% && npm run dev"

timeout /t 2 /nobreak

echo.
echo ================================
echo SERVERS STARTED SUCCESSFULLY
echo ================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Opening browser...
start http://localhost:3000
echo.
pause
