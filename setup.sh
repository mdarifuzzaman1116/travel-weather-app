#!/bin/bash

echo "🌍 Travel Weather Tracker Setup"
echo "================================"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed. Please install Node.js first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo "✓ npm found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Get a free API key from https://openweathermap.org/api"
    echo "2. Open renderer.js and replace YOUR_API_KEY_HERE with your API key"
    echo "3. Run 'npm start' to launch the app"
    echo ""
    echo "🚀 To start the app now, run: npm start"
else
    echo ""
    echo "❌ Installation failed. Please try again or install manually:"
    echo "   npm install electron@28.0.0 axios@1.6.0"
fi
