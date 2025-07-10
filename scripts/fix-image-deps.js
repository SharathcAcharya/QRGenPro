#!/usr/bin/env node

/**
 * This script fixes the pngquant-bin installation issue by skipping binary downloads
 * and bypassing the post-install hooks.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Paths to fix
const pngquantBinPath = path.join(rootDir, 'node_modules', 'pngquant-bin');
const optipngPath = path.join(rootDir, 'node_modules', 'optipng-bin');
const jpegtranPath = path.join(rootDir, 'node_modules', 'jpegtran-bin');
const gifsiclePathPath = path.join(rootDir, 'node_modules', 'gifsicle');

// Array of paths to fix
const pathsToFix = [pngquantBinPath, optipngPath, jpegtranPath, gifsiclePathPath];

console.log('🔧 Fixing image optimization dependencies...');

// Function to fix a binary dependency
function fixBinaryDep(depPath) {
  if (!fs.existsSync(depPath)) {
    console.log(`  ⚠️ ${path.basename(depPath)} not found, skipping`);
    return;
  }

  // Create a dummy lib/install.js file that does nothing
  const installJsPath = path.join(depPath, 'lib', 'install.js');
  
  // Ensure the lib directory exists
  if (!fs.existsSync(path.dirname(installJsPath))) {
    fs.mkdirSync(path.dirname(installJsPath), { recursive: true });
  }
  
  // Create a no-op install.js
  fs.writeFileSync(installJsPath, `
console.log('Skipping binary download for ${path.basename(depPath)}');
// This is a no-op script to prevent failures during npm install
`);

  console.log(`  ✅ Fixed ${path.basename(depPath)}`);
}

// Fix each dependency
pathsToFix.forEach(fixBinaryDep);

console.log('🎉 Done fixing image optimization dependencies');
