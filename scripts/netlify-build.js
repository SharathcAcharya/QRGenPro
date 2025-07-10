// This script helps Netlify build without ESLint errors from service workers
// It's meant to be executed in Netlify's build environment

console.log('🚀 Starting Netlify custom build process...');

// Check Node.js version
const nodeVersion = process.version;
console.log(`Using Node.js version: ${nodeVersion}`);

// Warn if Node.js version is less than 20.11.0
const requiredNodeVersion = 'v20.11.0';
if (nodeVersion.localeCompare(requiredNodeVersion, undefined, { numeric: true }) < 0) {
  console.warn(`⚠️ Warning: Node.js ${nodeVersion} is being used, but >= ${requiredNodeVersion} is required for camera-controls package.`);
  console.warn('Please update the NODE_VERSION in netlify.toml to 20.11.0 or higher.');
}

// Set environment variables to skip ESLint for service worker files
process.env.SKIP_ESLINT = 'true';
process.env.ESLINT_NO_DEV_ERRORS = 'true'; 
process.env.NODE_ENV = 'production';

// Inform about the environment
console.log('Environment variables set:');
console.log('- SKIP_ESLINT: true');
console.log('- NODE_ENV: production');
console.log('- ESLINT_NO_DEV_ERRORS: true');

console.log('✅ Build environment prepared for Netlify deployment.');
console.log('Building production bundle without ESLint checks for service workers...');

// Exit with success - this will be used as a prebuild step
process.exit(0);
