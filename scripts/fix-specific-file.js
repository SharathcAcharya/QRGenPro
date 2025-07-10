#!/usr/bin/env node

/**
 * Script to fix ESLint issues in a specific file
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('❌ Please provide a file path.');
  console.log('Usage: node scripts/fix-specific-file.js <filepath>');
  process.exit(1);
}

// Check if the file exists
if (!fs.existsSync(filePath)) {
  console.error(`❌ File not found: ${filePath}`);
  process.exit(1);
}

// Run ESLint on the specific file to get warnings
console.log(`🔍 Checking ESLint warnings for ${filePath}...`);
try {
  const result = execSync(`npx eslint ${filePath}`, { encoding: 'utf8' });
  console.log('No warnings found in this file! 🎉');
  process.exit(0);
} catch (error) {
  console.log('Found ESLint warnings:');
  console.log(error.stdout);
}

// Read the file content
const content = fs.readFileSync(filePath, 'utf8');

// Common patterns for fixes
const patterns = [
  {
    name: 'Unused variable/parameter',
    regex: /('|")([a-zA-Z0-9]+)('|") is (defined|assigned a value) but never used/g,
    fix: (match, content) => {
      const varName = match[2];
      // Don't prefix already prefixed variables
      if (varName.startsWith('_')) return content;
      
      // Replace the variable name with prefixed version
      const newContent = content.replace(
        new RegExp(`\\b${varName}\\b(?!\\s*:)`, 'g'), 
        `_${varName}`
      );
      return newContent;
    }
  },
  {
    name: 'Missing useEffect dependency',
    regex: /React Hook useEffect has (a missing dependency|missing dependencies): '([^']+)'/g,
    fix: (match, content) => {
      const dependencies = match[2].split("', '");
      // Find the useEffect call
      const useEffectRegex = /useEffect\(\s*\(\)\s*=>\s*\{[\s\S]*?\},\s*\[(.*?)\]\s*\)/g;
      
      return content.replace(useEffectRegex, (fullMatch, deps) => {
        const existingDeps = deps ? deps.split(',').map(d => d.trim()).filter(Boolean) : [];
        const newDeps = [...new Set([...existingDeps, ...dependencies])];
        return fullMatch.replace(/\[(.*?)\]/, `[${newDeps.join(', ')}]`);
      });
    }
  }
];

// Apply fixes
let updatedContent = content;
let changes = 0;

patterns.forEach(pattern => {
  let match;
  while ((match = pattern.regex.exec(error.stdout)) !== null) {
    const newContent = pattern.fix(match, updatedContent);
    if (newContent !== updatedContent) {
      updatedContent = newContent;
      changes++;
    }
  }
});

if (changes > 0) {
  // Write the updated content back to the file
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`✅ Applied ${changes} automatic fixes to ${filePath}`);
  
  // Run ESLint on the file again to see if all issues are fixed
  try {
    execSync(`npx eslint ${filePath}`, { encoding: 'utf8' });
    console.log('All warnings fixed! 🎉');
  } catch (error) {
    console.log('Some warnings still exist:');
    console.log(error.stdout);
    console.log('\nSome warnings may require manual fixes.');
  }
} else {
  console.log('❓ No automatic fixes could be applied. Manual intervention required.');
}
