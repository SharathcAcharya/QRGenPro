/**
 * Prerendering script for QRloop
 * 
 * This script prerenders key pages as static HTML for improved SEO,
 * faster initial page loads, and better crawler compatibility.
 * 
 * It uses Puppeteer to render the app and capture the HTML output.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

// ES Module __dirname equivalent
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

// Configuration
const config = {
  baseUrl: 'http://localhost:3000', // Local development server
  outputDir: distDir,
  routes: [
    '/',
    '/generator',
    '/analytics', 
    '/library',
    '/features/3d-qr',
    '/features/custom-design',
    '/features/logo-embedding',
    '/docs/getting-started',
    '/docs/advanced-features',
    '/about',
    '/privacy',
    '/terms',
    '/contact'
  ],
  waitForSelector: '#app-ready', // Add this data-attribute to your app when it's ready
  renderTimeout: 10000, // 10 seconds
};

/**
 * Ensure the output directory exists
 */
function ensureOutputDirs() {
  console.log('🔍 Ensuring output directories exist...');
  
  for (const route of config.routes) {
    const outputPath = getOutputPath(route);
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }
}

/**
 * Get the output file path for a route
 */
function getOutputPath(route) {
  const outputPath = route === '/' 
    ? path.join(config.outputDir, 'index.html')
    : path.join(config.outputDir, route, 'index.html');
  
  return outputPath;
}

/**
 * Prerender a specific route
 */
async function prerenderRoute(browser, route) {
  console.log(`🔄 Prerendering ${route}...`);
  
  const page = await browser.newPage();
  
  try {
    // Set viewport for desktop rendering
    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
    });
    
    // Add meta generator for prerendered pages
    await page.evaluateOnNewDocument(() => {
      window.__PRERENDERED = true;
    });
    
    // Navigate to the route
    await page.goto(`${config.baseUrl}${route}`, {
      waitUntil: 'networkidle2',
    });
    
    // Wait for app to be ready or timeout
    try {
      await page.waitForSelector(config.waitForSelector, { 
        timeout: config.renderTimeout 
      });
    } catch (error) {
      console.warn(`⚠️ Timeout waiting for ${config.waitForSelector} on ${route}`);
    }
    
    // Additional wait to ensure dynamic content loads
    await page.waitForTimeout(1000);
    
    // Get the HTML content
    const html = await page.content();
    
    // Add prerender comment
    const prerenderedHtml = html.replace('</head>', 
      `  <!-- Prerendered for SEO on ${new Date().toISOString()} -->\n  </head>`
    );
    
    // Write the HTML to file
    const outputPath = getOutputPath(route);
    fs.writeFileSync(outputPath, prerenderedHtml);
    
    console.log(`✅ Prerendered ${route} to ${outputPath}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to prerender ${route}:`, error);
    return false;
  } finally {
    await page.close();
  }
}

/**
 * Prerender all routes
 */
async function prerenderRoutes() {
  console.log('🚀 Starting prerendering process...');
  
  ensureOutputDirs();
  
  const browser = await puppeteer.launch({
    headless: 'new', // Use new headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  try {
    const results = [];
    
    for (const route of config.routes) {
      const success = await prerenderRoute(browser, route);
      results.push({ route, success });
    }
    
    // Print summary
    console.log('\n📊 Prerendering Summary:');
    const successful = results.filter(r => r.success).length;
    console.log(`✅ Successfully prerendered: ${successful}/${results.length} routes`);
    
    if (successful < results.length) {
      const failed = results.filter(r => !r.success);
      console.log('❌ Failed routes:');
      failed.forEach(f => console.log(`  - ${f.route}`));
    }
  } finally {
    await browser.close();
  }
}

// Execute
prerenderRoutes().catch(error => {
  console.error('❌ Prerendering failed:', error);
  process.exit(1);
});
