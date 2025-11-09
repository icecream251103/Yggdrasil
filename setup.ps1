# Yggdrasil Setup Script (PowerShell)
# Run: .\setup.ps1

Write-Host "🌳 Yggdrasil AR Platform Setup" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Cyan

# Node.js
$nodeVersion = node --version 2>$null
if ($?) {
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Python
$pythonVersion = python --version 2>$null
if ($?) {
    Write-Host "✓ Python: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Python not found. Install from https://python.org" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install root dependencies
Write-Host "Installing root dependencies..." -ForegroundColor Cyan
npm install
if (-not $?) {
    Write-Host "Failed to install root dependencies" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location apps\web
npm install
if (-not $?) {
    Write-Host "Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}
Set-Location ..\..

# Setup Python virtual environment
Write-Host ""
Write-Host "Setting up Python backend..." -ForegroundColor Cyan
Set-Location services\api

if (Test-Path venv) {
    Write-Host "Virtual environment already exists, skipping..." -ForegroundColor Yellow
} else {
    python -m venv venv
}

.\venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt

if (-not $?) {
    Write-Host "Failed to install Python dependencies" -ForegroundColor Red
    exit 1
}

Set-Location ..\..

# Install contracts dependencies
Write-Host ""
Write-Host "Installing contracts dependencies..." -ForegroundColor Cyan
Set-Location contracts
npm install
if (-not $?) {
    Write-Host "Failed to install contracts dependencies" -ForegroundColor Red
    exit 1
}
Set-Location ..

# Setup .env
Write-Host ""
if (Test-Path .env) {
    Write-Host "✓ .env already exists" -ForegroundColor Green
} else {
    Write-Host "Creating .env from .env.example..." -ForegroundColor Cyan
    Copy-Item .env.example .env
    Write-Host "⚠ IMPORTANT: Edit .env and add your PRIVATE_KEY" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env and add your PRIVATE_KEY (testnet)" -ForegroundColor White
Write-Host "2. Start frontend: cd apps\web; npm run dev" -ForegroundColor White
Write-Host "3. Start backend: cd services\api; .\venv\Scripts\Activate.ps1; uvicorn main:app --reload" -ForegroundColor White
Write-Host "4. Deploy contracts: cd contracts; npm run deploy" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see QUICKSTART.md" -ForegroundColor Gray
Write-Host ""
