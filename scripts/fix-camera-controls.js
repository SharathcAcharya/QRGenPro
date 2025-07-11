#!/usr/bin/env node

/**
 * This script helps manage compatibility issues with the camera-controls package.
 * It temporarily modifies the package.json of camera-controls to remove the engine requirements.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Path to camera-controls package.json
const cameraControlsPath = path.join(rootDir, 'node_modules', 'camera-controls', 'package.json');

console.log('🔧 Checking camera-controls package...');

if (!fs.existsSync(cameraControlsPath)) {
  console.log('⚠️ camera-controls package.json not found, skipping');
  process.exit(0);
}

try {
  // Read the package.json
  const packageJson = JSON.parse(fs.readFileSync(cameraControlsPath, 'utf8'));
  
  // Back up the original package.json if not already backed up
  const backupPath = cameraControlsPath + '.backup';
  if (!fs.existsSync(backupPath)) {
    fs.writeFileSync(backupPath, JSON.stringify(packageJson, null, 2));
    console.log('📦 Created backup of camera-controls package.json');
  }
  
  // Check if engines field exists
  if (packageJson.engines) {
    console.log('🔄 Temporarily removing engine requirements from camera-controls');
    
    // Remove the engines field
    delete packageJson.engines;
    
    // Write the modified package.json
    fs.writeFileSync(cameraControlsPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Successfully modified camera-controls package.json');
  } else {
    console.log('✅ No engine requirements found in camera-controls package.json');
  }
} catch (error) {
  console.error('❌ Error modifying camera-controls package.json:', error);
  process.exit(1);
}

console.log('🎉 Done checking camera-controls package');
