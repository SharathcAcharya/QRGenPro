#!/usr/bin/env node

/**
 * Script to fix useCallback issues in React components
 * 
 * This script helps identify functions that should be wrapped in useCallback
 * to prevent them from being recreated on each render and causing dependency
 * issues with useEffect hooks.
 */

const fs = require('fs');
const path = require('path');

// Get the file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('❌ Please provide a file path.');
  console.log('Usage: node scripts/fix-use-callback.js <filepath>');
  process.exit(1);
}

// Check if the file exists
if (!fs.existsSync(filePath)) {
  console.error(`❌ File not found: ${filePath}`);
  process.exit(1);
}

// Read the file content
let content = fs.readFileSync(filePath, 'utf8');
const originalContent = content;

console.log(`🔍 Analyzing ${path.basename(filePath)} for useCallback opportunities...`);

// Find useEffect hooks and their dependencies
const useEffectRegex = /useEffect\(\s*\(\)\s*=>\s*\{[\s\S]*?\},\s*\[(.*?)\]\s*\)/g;
const effectMatches = [...content.matchAll(useEffectRegex)];

// Find functions that are referenced in useEffect dependencies
const functionDepsSet = new Set();
for (const match of effectMatches) {
  const deps = match[1] ? match[1].split(',').map(d => d.trim()).filter(Boolean) : [];
  deps.forEach(dep => functionDepsSet.add(dep));
}

// Find function declarations that should be wrapped in useCallback
const functionRegex = /const\s+([a-zA-Z][a-zA-Z0-9]*)\s*=\s*(?:\(\s*(?:\{[^}]*\}|\[[^\]]*\]|[^)]*)\s*\)|[^=>]*)\s*=>\s*\{/g;
const functionMatches = [...content.matchAll(functionRegex)];

let changes = 0;

for (const match of functionMatches) {
  const fullMatch = match[0];
  const functionName = match[1];
  
  // Check if this function is used in any useEffect dependencies
  if (functionDepsSet.has(functionName)) {
    // Find the end of the function (matching the closing brace)
    const startIndex = match.index;
    let openBraces = 1;
    let endIndex = startIndex + fullMatch.length;
    
    while (openBraces > 0 && endIndex < content.length) {
      if (content[endIndex] === '{') openBraces++;
      if (content[endIndex] === '}') openBraces--;
      endIndex++;
    }
    
    if (openBraces === 0) {
      // Extract the full function
      const fullFunction = content.substring(startIndex, endIndex);
      
      // Check if it's already wrapped in useCallback
      if (!fullFunction.includes('useCallback')) {
        // Find all variable references in the function body
        const functionBody = fullFunction.substring(fullMatch.length, fullFunction.length - 1);
        const varReferences = [];
        const varRegex = /\b([a-zA-Z][a-zA-Z0-9]*)(?!\s*\(|\s*:|\s*=)/g;
        const bodyVarMatches = [...functionBody.matchAll(varRegex)];
        
        for (const varMatch of bodyVarMatches) {
          const varName = varMatch[1];
          if (!['console', 'window', 'document', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'].includes(varName) && 
              !varName.startsWith('set')) {
            varReferences.push(varName);
          }
        }
        
        // Create unique list of dependencies
        const deps = [...new Set(varReferences)];
        
        // Create the useCallback version of the function
        const useCallbackFunction = `const ${functionName} = useCallback(${fullFunction.substring(fullMatch.length - 1)}, [${deps.join(', ')}])`;
        
        // Replace the original function with the useCallback version
        content = content.substring(0, startIndex) + useCallbackFunction + content.substring(endIndex);
        
        changes++;
        console.log(`✅ Wrapped ${functionName} in useCallback with dependencies: [${deps.join(', ')}]`);
      }
    }
  }
}

// Make sure useCallback is imported if we made changes
if (changes > 0) {
  if (!content.includes('useCallback')) {
    // Find the React import
    const reactImportRegex = /import React,\s*\{\s*([^}]+)\s*\} from ['"]react['"];/;
    const reactImportMatch = content.match(reactImportRegex);
    
    if (reactImportMatch) {
      const imports = reactImportMatch[1];
      if (!imports.includes('useCallback')) {
        const newImports = imports.split(',').map(i => i.trim()).filter(Boolean);
        newImports.push('useCallback');
        const newImportStatement = `import React, { ${newImports.join(', ')} } from 'react';`;
        content = content.replace(reactImportRegex, newImportStatement);
      }
    } else {
      // Handle case where import might be in a different format
      const altReactImportRegex = /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]react['"];/;
      const altReactImportMatch = content.match(altReactImportRegex);
      
      if (altReactImportMatch) {
        const imports = altReactImportMatch[1];
        if (!imports.includes('useCallback')) {
          const newImports = imports.split(',').map(i => i.trim()).filter(Boolean);
          newImports.push('useCallback');
          const newImportStatement = `import { ${newImports.join(', ')} } from 'react';`;
          content = content.replace(altReactImportRegex, newImportStatement);
        }
      } else {
        // Add a new import if no React import is found
        content = `import { useCallback } from 'react';\n${content}`;
      }
    }
  }
  
  // Save the changes
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Applied ${changes} useCallback fixes to ${path.basename(filePath)}`);
} else {
  console.log(`No useCallback fixes needed for ${path.basename(filePath)}`);
}
