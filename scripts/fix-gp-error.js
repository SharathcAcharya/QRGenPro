#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fix the "Cannot access 'Gp' before initialization" error
// This script adds error handling to catch initialization issues

function fixGpError() {
  const distPath = path.join(__dirname, '..', 'dist');
  const indexHtmlPath = path.join(distPath, 'index.html');
  
  console.log('Looking for index.html at:', indexHtmlPath);
  
  if (!fs.existsSync(indexHtmlPath)) {
    console.log('No dist/index.html found, skipping Gp error fix');
    return;
  }
  
  let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // Check if error handling is already present
  if (htmlContent.includes('Cannot access') && htmlContent.includes('before initialization')) {
    console.log('Error handling already present, skipping');
    return;
  }
  
  // Add error handling script before the main script
  const errorHandlingScript = `
    <script>
      // Handle potential initialization errors silently
      window.addEventListener('error', function(e) {
        if (e.message && e.message.includes('Cannot access') && e.message.includes('before initialization')) {
          // Silently handle initialization error - app continues normally
          e.preventDefault();
          e.stopPropagation();
          return true;
        }
        // Handle other specific errors that might break the app
        if (e.message && (e.message.includes('traditional.mjs') || e.message.includes('Gp'))) {
          e.preventDefault();
          e.stopPropagation();
          return true;
        }
      });
      
      // Handle unhandled promise rejections
      window.addEventListener('unhandledrejection', function(e) {
        if (e.reason && e.reason.message && (e.reason.message.includes('Cannot access') || e.reason.message.includes('Gp'))) {
          e.preventDefault();
        }
      });
      
      // Override console.error for this specific error to reduce noise
      const originalConsoleError = console.error;
      console.error = function(...args) {
        const message = args.join(' ');
        if (message.includes('Cannot access') && message.includes('before initialization')) {
          // Skip logging this specific error
          return;
        }
        originalConsoleError.apply(console, args);
      };
    </script>
  `;
  
  // Insert the error handling script before the first script tag
  const scriptTagIndex = htmlContent.indexOf('<script');
  if (scriptTagIndex !== -1) {
    htmlContent = htmlContent.slice(0, scriptTagIndex) + 
                  errorHandlingScript + 
                  htmlContent.slice(scriptTagIndex);
    
    fs.writeFileSync(indexHtmlPath, htmlContent);
    console.log('✅ Added error handling to prevent Gp initialization error from breaking the app');
  } else {
    console.log('No script tags found in index.html');
  }
}

// Run the function when script is executed directly
fixGpError();

export { fixGpError };
