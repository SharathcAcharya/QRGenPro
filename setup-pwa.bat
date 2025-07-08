@echo off
REM QRGenPro PWA Setup Script for Windows

echo 🚀 Setting up QRGenPro PWA...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Build the application
echo 🔨 Building PWA...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build completed successfully

REM Start preview server
echo 🌐 Starting preview server...
echo 🔗 Your PWA will be available at: http://localhost:4173
echo 📱 To install as PWA:
echo    - Desktop: Look for install icon in browser address bar
echo    - Mobile: Use 'Add to Home Screen' from browser menu
echo.
echo Press Ctrl+C to stop the server

npm run preview
pause
