#!/bin/bash

# QRGenPro PWA Setup Script
echo "🚀 Setting up QRGenPro PWA..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Build the application
echo "🔨 Building PWA..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Start preview server
echo "🌐 Starting preview server..."
echo "🔗 Your PWA will be available at: http://localhost:4173"
echo "📱 To install as PWA:"
echo "   - Desktop: Look for install icon in browser address bar"
echo "   - Mobile: Use 'Add to Home Screen' from browser menu"
echo ""
echo "Press Ctrl+C to stop the server"

npm run preview
