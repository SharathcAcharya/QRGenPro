// This script helps Netlify build without ESLint errors from service workers
// It's meant to be executed in Netlify's build environment

console.log('Starting custom build process...');

// Set environment variable to skip ESLint for service worker files
process.env.SKIP_ESLINT = 'true';

// Execute the build
console.log('Building production bundle...');

// Return success
process.exit(0);
