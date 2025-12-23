@echo off
REM Add Node.js to PATH
set PATH=C:\Program Files\nodejs;%PATH%

REM Navigate to project directory
cd /d C:\xampp\htdocs\gizmohub-transformation

REM Start development server
echo Starting Gizmohub Frontend Development Server...
echo Port: 3000
echo.

call npm run dev

pause
