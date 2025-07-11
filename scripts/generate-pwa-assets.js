/**
 * Simple script to generate PWA icons and splash screens
 * This helps ensure the PWA can be installed properly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const iconsDir = path.join(publicDir, 'icons');
const screenshotsDir = path.join(publicDir, 'screenshots');
const splashDir = path.join(publicDir, 'splash');

// Create directories if they don't exist
[iconsDir, screenshotsDir, splashDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Generate placeholder PWA icons if they don't exist
const iconSizes = [72, 96, 128, 144, 152, 167, 180, 192, 384, 512];
const placeholderIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#2563eb" />
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="100" fill="white">QR</text>
  <rect x="156" y="156" width="200" height="200" stroke="white" stroke-width="20" fill="none" />
  <rect x="206" y="206" width="100" height="100" fill="white" />
</svg>
`;

// Create placeholder icons
iconSizes.forEach(size => {
  const iconPath = path.join(iconsDir, `icon-${size}.png`);
  if (!fs.existsSync(iconPath)) {
    console.log(`Creating placeholder icon: ${iconPath}`);
    fs.writeFileSync(path.join(iconsDir, `icon-${size}.svg`), placeholderIcon);
    console.log(`⚠️ Note: Convert the SVG to PNG manually with size ${size}x${size}`);
  }
});

// Create placeholder screenshots if they don't exist
const screenshots = [
  { name: 'desktop.png', width: 1280, height: 800 },
  { name: 'mobile.png', width: 750, height: 1334 }
];

const placeholderScreenshot = (width, height) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#f8fafc" />
  <rect x="0" y="0" width="${width}" height="80" fill="#2563eb" />
  <text x="50%" y="50" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="30" fill="white">QRloop Screenshot</text>
  <text x="50%" y="${height/2}" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="40" fill="#2563eb">Replace with actual screenshot</text>
</svg>
`;

// Create placeholder screenshots
screenshots.forEach(({name, width, height}) => {
  const screenshotPath = path.join(screenshotsDir, name);
  if (!fs.existsSync(screenshotPath)) {
    console.log(`Creating placeholder screenshot: ${screenshotPath}`);
    fs.writeFileSync(path.join(screenshotsDir, `${name.replace('.png', '.svg')}`), placeholderScreenshot(width, height));
    console.log(`⚠️ Note: Convert the SVG to PNG manually with size ${width}x${height}`);
  }
});

// Create apple splash screens
const splashScreens = [
  { name: 'apple-splash-2048-2732.png', width: 2048, height: 2732 }, // iPad Pro 12.9"
  { name: 'apple-splash-1668-2388.png', width: 1668, height: 2388 }, // iPad Pro 11"
  { name: 'apple-splash-1536-2048.png', width: 1536, height: 2048 }, // iPad Air
  { name: 'apple-splash-1125-2436.png', width: 1125, height: 2436 }, // iPhone X/XS
  { name: 'apple-splash-750-1334.png', width: 750, height: 1334 }    // iPhone 8
];

const placeholderSplash = (width, height) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#2563eb" />
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="${Math.floor(width/10)}" fill="white">QRloop</text>
</svg>
`;

// Create placeholder splash screens
splashScreens.forEach(({name, width, height}) => {
  const splashPath = path.join(splashDir, name);
  if (!fs.existsSync(splashPath)) {
    console.log(`Creating placeholder splash screen: ${splashPath}`);
    fs.writeFileSync(path.join(splashDir, `${name.replace('.png', '.svg')}`), placeholderSplash(width, height));
    console.log(`⚠️ Note: Convert the SVG to PNG manually with size ${width}x${height}`);
  }
});

console.log('✅ PWA assets generation completed!');
console.log('🔔 Remember to replace the placeholder SVGs with actual PNGs for production use.');
