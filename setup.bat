@echo off
REM File Integrity Monitoring System - Startup Script (Windows)
REM This script helps set up and run both the frontend and backend

echo.
echo ================================================================================
echo        File Integrity Monitoring System (FIMS) - Setup & Run Script
echo ================================================================================
echo.

REM Check if this is the first run
if not exist "venv" (
    echo [STEP 1] Creating Python virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        echo Make sure Python is installed and in your PATH
        pause
        exit /b 1
    )
    echo [OK] Virtual environment created
    echo.
)

REM Activate virtual environment
echo [STEP 2] Activating Python virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)
echo [OK] Virtual environment activated
echo.

REM Install Python dependencies
echo [STEP 3] Installing Python dependencies...
pip install -q -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)
echo [OK] Python dependencies installed
echo.

REM Install Node dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo [STEP 4] Installing Node.js dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install Node dependencies
        pause
        exit /b 1
    )
    echo [OK] Node.js dependencies installed
    echo.
)

echo ================================================================================
echo                         SYSTEM READY TO START
echo ================================================================================
echo.
echo The File Integrity Monitoring System is ready to run!
echo.
echo Next steps:
echo 1. Open TWO terminal windows
echo.
echo Terminal 1 - Frontend (Vite Dev Server):
echo   Run: npm run dev
echo   This will start on: http://localhost:5173
echo.
echo Terminal 2 - Backend (Flask Server):
echo   Run: python src/python/backend.py
echo   This will start on: http://localhost:5000
echo.
echo Make sure BOTH servers are running before using the application.
echo.
pause
