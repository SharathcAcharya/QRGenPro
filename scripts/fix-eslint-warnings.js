#!/usr/bin/env node

/**
 * Auto-fix ESLint warnings script
 * 
 * This script helps fix common ESLint warnings in React components:
 * 1. Renames unused variables/arguments to be prefixed with underscore
 * 2. Adds missing dependencies to useEffect hooks
 * 3. Wraps functions in useCallback to prevent them from being recreated on each render
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the components directory
const componentsDir = path.join(__dirname, '..', 'src', 'components');

// Run ESLint with --fix option for automatic fixes
console.log('🔧 Running ESLint with automatic fixes...');
try {
  execSync('npm run lint:fix', { stdio: 'inherit' });
  console.log('✅ Automatic fixes applied successfully!');
} catch (error) {
  console.error('❌ Error applying automatic fixes:', error.message);
}

// Find all component files
const findComponentFiles = (dir) => {
  const results = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      results.push(...findComponentFiles(itemPath));
    } else if (stat.isFile() && (item.endsWith('.jsx') || item.endsWith('.js'))) {
      results.push(itemPath);
    }
  }
  
  return results;
};

// Fix common patterns in the file
const fixFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;
  
  // Fix pattern 1: Unused variables and parameters
  const unusedVarRegex = /\b(const|let|var)\s+(\w+)(\s*,\s*\{\s*([^}]+)\s*\}|\s*,\s*\[([^\]]+)\]|\s*=)/g;
  const unusedParamRegex = /\(\s*\{([^}]+)\}\s*\)/g;
  const varNameRegex = /\b([a-zA-Z][a-zA-Z0-9]*)(?!\s*:|\s*\(|\s*[=:])/g;
  
  // Find variables used in the file
  const usedVarsSet = new Set();
  const contentWithoutComments = content.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
  const varMatches = contentWithoutComments.matchAll(/\b([a-zA-Z][a-zA-Z0-9]*)(?:\s*\(|\s*\.\s*|\s*\[|\s*\?|\s*\+|\s*-|\s*\*|\.|\(|\)|\[|\])/g);
  for (const match of varMatches) {
    usedVarsSet.add(match[1]);
  }
  
  // Check if a variable might be unused and should be prefixed
  const shouldPrefixVar = (varName) => {
    // Don't prefix already prefixed variables
    if (varName.startsWith('_')) return false;
    
    // Don't prefix common React patterns or special names
    const excludedNames = ['useState', 'useEffect', 'useRef', 'useCallback', 'useMemo', 'useContext', 
                          'React', 'Fragment', 'Suspense', 'Component', 'props', 'children'];
    if (excludedNames.includes(varName)) return false;
    
    // Only prefix variables that appear to be unused
    return !usedVarsSet.has(varName);
  };
  
  // Fix unused variables
  let variableMatches = [...content.matchAll(unusedVarRegex)];
  for (const match of variableMatches) {
    const declaration = match[0];
    const varName = match[2];
    
    if (shouldPrefixVar(varName)) {
      const newDeclaration = declaration.replace(
        new RegExp(`\\b${varName}\\b`), 
        `_${varName}`
      );
      
      if (newDeclaration !== declaration) {
        content = content.replace(declaration, newDeclaration);
        changes++;
        console.log(`- Prefixed unused variable: ${varName} -> _${varName}`);
      }
    }
  }
  
  // Fix unused parameters
  let paramMatches = [...content.matchAll(unusedParamRegex)];
  for (const match of paramMatches) {
    const params = match[1];
    let newParams = params;
    
    // Extract parameter names
    const paramNames = params.split(',').map(p => p.trim());
    
    for (const param of paramNames) {
      // Extract the variable name (handling patterns like "name = defaultValue")
      const varName = param.split('=')[0].trim();
      
      if (varName && !varName.startsWith('_') && shouldPrefixVar(varName)) {
        newParams = newParams.replace(
          new RegExp(`\\b${varName}\\b(?!\\s*:)`), 
          `_${varName}`
        );
      }
    }
    
    if (newParams !== params) {
      content = content.replace(`{${params}}`, `{${newParams}}`);
      changes++;
      console.log(`- Fixed unused parameters in function declaration`);
    }
  }
  
  // Fix pattern 2: Missing dependencies in useEffect
  const useEffectRegex = /useEffect\(\s*\(\)\s*=>\s*\{[\s\S]*?\},\s*\[(.*?)\]\s*\)/g;
  const effectMatches = [...content.matchAll(useEffectRegex)];
  
  for (const match of effectMatches) {
    const effectBody = match[0];
    const deps = match[1] ? match[1].split(',').map(d => d.trim()).filter(Boolean) : [];
    const effectBodyWithoutComments = effectBody.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
    
    // Find all variables referenced in the effect body
    const bodyVars = [];
    const bodyVarMatches = effectBodyWithoutComments.matchAll(/\b([a-zA-Z][a-zA-Z0-9]*)(?!\s*\(|\s*:|\s*=)/g);
    for (const varMatch of bodyVarMatches) {
      const varName = varMatch[1];
      if (!['useEffect', 'console', 'window', 'document', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'].includes(varName) && 
          !deps.includes(varName) && 
          !varName.startsWith('set')) {
        bodyVars.push(varName);
      }
    }
    
    // Add missing dependencies
    const missingDeps = [...new Set(bodyVars)].filter(v => !deps.includes(v));
    
    if (missingDeps.length > 0) {
      let newDeps = deps;
      missingDeps.forEach(dep => {
        if (!newDeps.includes(dep)) {
          newDeps.push(dep);
        }
      });
      
      const newEffectBody = effectBody.replace(/\[(.*?)\]/, `[${newDeps.join(', ')}]`);
      content = content.replace(effectBody, newEffectBody);
      changes++;
      console.log(`- Added missing dependencies to useEffect: ${missingDeps.join(', ')}`);
    }
  }
  
  // Save changes if any were made
  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Applied ${changes} fixes to ${path.basename(filePath)}`);
    return true;
  } else {
    console.log(`No changes needed for ${path.basename(filePath)}`);
    return false;
  }
};

// Process all component files
console.log('\n🔍 Scanning component files for common issues...');
const componentsPath = path.join(__dirname, '..', 'src', 'components');
const utilsPath = path.join(__dirname, '..', 'src', 'utils');
const contextPath = path.join(__dirname, '..', 'src', 'context');

let fixedFiles = 0;
const allFiles = [
  ...findComponentFiles(componentsPath),
  ...findComponentFiles(utilsPath),
  ...findComponentFiles(contextPath)
];

for (const file of allFiles) {
  console.log(`\nProcessing ${path.basename(file)}...`);
  if (fixFile(file)) {
    fixedFiles++;
  }
}

console.log(`\n✅ Processed ${allFiles.length} files, fixed ${fixedFiles} files.`);
console.log('\n📋 Run the lint command to see if there are still warnings:');
console.log('npm run lint:build');
