# File Integrity Monitoring System - Startup Script (PowerShell)
# This script helps set up and run both the frontend and backend

Write-Host ""
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "        File Integrity Monitoring System (FIMS) - Setup & Run Script" -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
$pythonCheck = python --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Python is not installed or not in PATH" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Node.js is installed
$nodeCheck = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Node.js is not installed or not in PATH" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "[STEP 1] Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to create virtual environment" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "[OK] Virtual environment created" -ForegroundColor Green
    Write-Host ""
}

# Activate virtual environment
Write-Host "[STEP 2] Activating Python virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to activate virtual environment" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Virtual environment activated" -ForegroundColor Green
Write-Host ""

# Install Python dependencies
Write-Host "[STEP 3] Installing Python dependencies..." -ForegroundColor Yellow
pip install -q -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to install Python dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Python dependencies installed" -ForegroundColor Green
Write-Host ""

# Install Node dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "[STEP 4] Installing Node.js dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install Node dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "[OK] Node.js dependencies installed" -ForegroundColor Green
    Write-Host ""
}

Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "                         SYSTEM READY TO START" -ForegroundColor Green
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "The File Integrity Monitoring System is ready to run!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Open TWO PowerShell terminal windows" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 1 - Frontend (Vite Dev Server):" -ForegroundColor Cyan
Write-Host "   Run: npm run dev" -ForegroundColor White
Write-Host "   This will start on: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 - Backend (Flask Server):" -ForegroundColor Cyan
Write-Host "   Run: python src/python/backend.py" -ForegroundColor White
Write-Host "   This will start on: http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "Make sure BOTH servers are running before using the application." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit this setup script"
