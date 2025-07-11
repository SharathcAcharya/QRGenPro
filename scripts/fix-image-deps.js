#!/usr/bin/env node

/**
 * This script fixes the pngquant-bin installation issue by creating mock binaries
 * and bypassing the post-install hooks. It now works even when packages are not installed.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const nodeModulesDir = path.join(rootDir, 'node_modules');

// Check if node_modules exists
if (!fs.existsSync(nodeModulesDir)) {
  console.log('⚠️ node_modules directory not found, creating it...');
  fs.mkdirSync(nodeModulesDir, { recursive: true });
}

// Dependency paths to fix
const depsToFix = [
  'pngquant-bin',
  'optipng-bin',
  'jpegtran-bin',
  'gifsicle'
];

console.log('🔧 Fixing image optimization dependencies...');

// Function to fix a binary dependency
function fixBinaryDep(depName) {
  const depPath = path.join(nodeModulesDir, depName);
  
  if (!fs.existsSync(depPath)) {
    console.log(`  ⚠️ ${depName} not found, creating mock package...`);
    
    // Create the package directory
    fs.mkdirSync(depPath, { recursive: true });
    
    // Create a mock package.json
    const packageJson = {
      name: depName,
      version: '0.0.0-mock',
      description: 'Mock package to prevent build failures',
      main: 'index.js',
      bin: {
        [depName]: 'bin.js'
      }
    };
    
    fs.writeFileSync(
      path.join(depPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Create a mock lib directory with install.js
    const libDir = path.join(depPath, 'lib');
    fs.mkdirSync(libDir, { recursive: true });
    
    fs.writeFileSync(
      path.join(libDir, 'install.js'),
      `console.log('Mock ${depName} install - skipping binary download');`
    );
    
    // Create a mock binary file
    fs.writeFileSync(
      path.join(depPath, 'bin.js'),
      `#!/usr/bin/env node
console.log('Mock ${depName} binary - does nothing');
process.exit(0);`
    );
    
    // Create a simple index.js
    fs.writeFileSync(
      path.join(depPath, 'index.js'),
      `module.exports = '${depPath}/bin.js';`
    );
    
    console.log(`  ✅ Created mock package for ${depName}`);
    return;
  }

  console.log(`  🔍 ${depName} found, checking if needs fixing...`);

  // Create a dummy lib/install.js file that does nothing
  const installJsPath = path.join(depPath, 'lib', 'install.js');
  
  // Ensure the lib directory exists
  if (!fs.existsSync(path.dirname(installJsPath))) {
    fs.mkdirSync(path.dirname(installJsPath), { recursive: true });
  }
  
  // Create a no-op install.js
  fs.writeFileSync(installJsPath, `
console.log('Skipping binary download for ${depName}');
// This is a no-op script to prevent failures during npm install
`);

  console.log(`  ✅ Fixed ${depName}`);
}

// Fix each dependency
depsToFix.forEach(fixBinaryDep);

console.log('🎉 Done fixing image optimization dependencies');
