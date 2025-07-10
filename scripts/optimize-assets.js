/**
 * Asset optimization script for production builds
 * This script optimizes assets after the build process
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { minify } from 'html-minifier-terser';

// ES Module __dirname equivalent
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

// Configuration
const config = {
  images: {
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
    quality: 85,
    skipOptimized: true // Skip files that contain .min. or .opt. in filename
  },
  html: {
    extensions: ['.html'],
    options: {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true
    }
  }
};

console.log('🚀 Starting post-build optimization...');

/**
 * Optimize images using Sharp
 * @param {string} filePath - Path to the image file
 */
async function optimizeImage(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  
  // Skip already optimized images
  if (config.images.skipOptimized && 
      (filePath.includes('.min.') || filePath.includes('.opt.'))) {
    return;
  }
  
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    let optimizedImage;
    
    switch (extension) {
      case '.jpg':
      case '.jpeg':
        optimizedImage = image.jpeg({ quality: config.images.quality });
        break;
      case '.png':
        optimizedImage = image.png({ quality: config.images.quality });
        break;
      case '.webp':
        optimizedImage = image.webp({ quality: config.images.quality });
        break;
      default:
        return; // Unsupported format
    }
    
    await optimizedImage.toBuffer().then(data => {
      fs.writeFileSync(filePath, data);
      console.log(`✅ Optimized: ${path.relative(distDir, filePath)}`);
    });
  } catch (error) {
    console.error(`❌ Error optimizing ${filePath}:`, error.message);
  }
}

/**
 * Minify HTML files
 * @param {string} filePath - Path to the HTML file
 */
async function minifyHtml(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const minified = await minify(content, config.html.options);
    fs.writeFileSync(filePath, minified);
    console.log(`✅ Minified: ${path.relative(distDir, filePath)}`);
  } catch (error) {
    console.error(`❌ Error minifying ${filePath}:`, error.message);
  }
}

/**
 * Process a file based on its extension
 * @param {string} filePath - Path to the file
 */
async function processFile(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  
  if (config.images.extensions.includes(extension)) {
    await optimizeImage(filePath);
  } else if (config.html.extensions.includes(extension)) {
    await minifyHtml(filePath);
  }
}

/**
 * Recursively walk directory and process files
 * @param {string} dir - Directory to process
 */
async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else {
      await processFile(filePath);
    }
  }
}

// Start optimization
(async () => {
  try {
    if (!fs.existsSync(distDir)) {
      console.error(`❌ Distribution directory not found: ${distDir}`);
      process.exit(1);
    }
    
    console.log(`📂 Processing directory: ${distDir}`);
    await processDirectory(distDir);
    console.log('✨ Post-build optimization complete!');
  } catch (error) {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
  }
})();
