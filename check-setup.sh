#!/bin/bash

# Travel Weather App - Setup Script
# This script helps you check if everything is ready

echo "🌍 Travel Weather App - Setup Checker"
echo "======================================"
echo ""

# Check Node.js
echo "1️⃣  Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js installed: $NODE_VERSION"
else
    echo "❌ Node.js not found. Install from: https://nodejs.org"
    exit 1
fi

# Check npm
echo ""
echo "2️⃣  Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✅ npm installed: $NPM_VERSION"
else
    echo "❌ npm not found"
    exit 1
fi

# Check if node_modules exists
echo ""
echo "3️⃣  Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Dependencies not installed"
    echo "   Run: npm install"
fi

# Check for .env file
echo ""
echo "4️⃣  Checking environment configuration..."
if [ -f ".env" ]; then
    echo "✅ .env file found"
    
    # Check if it has the required values
    if grep -q "EXPO_PUBLIC_SUPABASE_URL=your_supabase" .env; then
        echo "⚠️  .env file needs configuration!"
        echo "   Follow QUICKSTART.md to get Supabase credentials"
    else
        echo "✅ .env file configured"
    fi
else
    echo "❌ .env file not found"
    echo "   Copy .env.example to .env and add your Supabase credentials"
    echo "   Run: cp .env.example .env"
fi

# Check Expo CLI
echo ""
echo "5️⃣  Checking Expo CLI (optional)..."
if command -v expo &> /dev/null; then
    EXPO_VERSION=$(expo --version)
    echo "✅ Expo CLI installed: $EXPO_VERSION"
else
    echo "ℹ️  Expo CLI not installed globally (not required)"
    echo "   You can install it with: npm install -g expo-cli"
fi

echo ""
echo "======================================"
echo "📋 Next Steps:"
echo ""

if [ ! -f ".env" ] || grep -q "your_supabase" .env 2>/dev/null; then
    echo "1. Set up Supabase (see QUICKSTART.md)"
    echo "2. Create .env file with credentials"
    echo "3. Run: npm start"
else
    echo "✅ You're all set!"
    echo "   Run: npm start"
fi

echo ""
echo "📚 Documentation:"
echo "   • QUICKSTART.md - 5-minute setup guide"
echo "   • README.md - Full documentation"
echo "   • CONVERSION_SUMMARY.md - What changed"
echo ""
