#!/bin/bash
# Yggdrasil Setup Script (Bash for Linux/Mac)
# Run: chmod +x setup.sh && ./setup.sh

echo "🌳 Yggdrasil AR Platform Setup"
echo "================================"
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# Node.js
if command -v node &> /dev/null; then
    echo "✓ Node.js: $(node --version)"
else
    echo "✗ Node.js not found. Install from https://nodejs.org"
    exit 1
fi

# Python
if command -v python3 &> /dev/null; then
    echo "✓ Python: $(python3 --version)"
else
    echo "✗ Python not found. Install from https://python.org"
    exit 1
fi

echo ""

# Install root dependencies
echo "Installing root dependencies..."
npm install || { echo "Failed to install root dependencies"; exit 1; }

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd apps/web
npm install || { echo "Failed to install frontend dependencies"; exit 1; }
cd ../..

# Setup Python virtual environment
echo ""
echo "Setting up Python backend..."
cd services/api

if [ -d "venv" ]; then
    echo "Virtual environment already exists, skipping..."
else
    python3 -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt || { echo "Failed to install Python dependencies"; exit 1; }
cd ../..

# Install contracts dependencies
echo ""
echo "Installing contracts dependencies..."
cd contracts
npm install || { echo "Failed to install contracts dependencies"; exit 1; }
cd ..

# Setup .env
echo ""
if [ -f ".env" ]; then
    echo "✓ .env already exists"
else
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠ IMPORTANT: Edit .env and add your PRIVATE_KEY"
fi

# Summary
echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your PRIVATE_KEY (testnet)"
echo "2. Start frontend: cd apps/web && npm run dev"
echo "3. Start backend: cd services/api && source venv/bin/activate && uvicorn main:app --reload"
echo "4. Deploy contracts: cd contracts && npm run deploy"
echo ""
echo "For detailed instructions, see QUICKSTART.md"
echo ""
