@echo off
REM Check if servers are running

echo.
echo ====================================
echo   GIZMOHUB CONNECTION STATUS
echo ====================================
echo.

REM Check Backend
echo Checking Backend (Port 5001)...
netstat -ano | findstr :5001 | findstr LISTENING >nul
if %errorlevel% == 0 (
    echo [OK] Backend Server is RUNNING on port 5001
) else (
    echo [ERROR] Backend Server is NOT RUNNING
)

REM Check Frontend
echo.
echo Checking Frontend (Port 3000)...
netstat -ano | findstr :3000 | findstr LISTENING >nul
if %errorlevel% == 0 (
    echo [OK] Frontend Server is RUNNING on port 3000
) else (
    echo [ERROR] Frontend Server is NOT RUNNING
)

echo.
echo ====================================
echo   ACCESS YOUR APP
echo ====================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5001/api
echo.

pause
