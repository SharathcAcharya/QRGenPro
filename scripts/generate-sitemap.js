/**
 * Dynamic sitemap generator script
 * Generates sitemap.xml based on the app's routes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module __dirname equivalent
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const robotsPath = path.join(publicDir, 'robots.txt');

// Configuration
const config = {
  baseUrl: 'https://qrloop.app',
  lastmod: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  routes: [
    { path: '/', changefreq: 'weekly', priority: 1.0 },
    { path: '/generator', changefreq: 'weekly', priority: 0.9 },
    { path: '/analytics', changefreq: 'weekly', priority: 0.8 },
    { path: '/library', changefreq: 'weekly', priority: 0.8 },
    { path: '/settings', changefreq: 'monthly', priority: 0.6 },
    { path: '/features/3d-qr', changefreq: 'monthly', priority: 0.7 },
    { path: '/features/custom-design', changefreq: 'monthly', priority: 0.7 },
    { path: '/features/logo-embedding', changefreq: 'monthly', priority: 0.7 },
    { path: '/docs/getting-started', changefreq: 'monthly', priority: 0.6 },
    { path: '/docs/advanced-features', changefreq: 'monthly', priority: 0.5 },
    { path: '/blog', changefreq: 'weekly', priority: 0.7 },
    { path: '/about', changefreq: 'monthly', priority: 0.4 },
    { path: '/privacy', changefreq: 'monthly', priority: 0.4 },
    { path: '/terms', changefreq: 'monthly', priority: 0.4 },
    { path: '/contact', changefreq: 'monthly', priority: 0.5 }
  ],
  // Blog posts - in a real app, these could be fetched from a database or CMS
  blogPosts: [
    { 
      path: '/blog/qr-code-best-practices-2025',
      title: 'QR Code Best Practices for 2025',
      lastmod: '2025-07-05',
      changefreq: 'monthly', 
      priority: 0.7 
    },
    { 
      path: '/blog/how-to-use-3d-qr-codes-effectively',
      title: '3D QR Codes: The Complete Guide',
      lastmod: '2025-07-01',
      changefreq: 'monthly', 
      priority: 0.7 
    },
    { 
      path: '/blog/qr-code-analytics-and-tracking',
      title: 'Mastering QR Code Analytics and Tracking',
      lastmod: '2025-06-22',
      changefreq: 'monthly', 
      priority: 0.7 
    }
  ],
  // Feature pages with extended metadata
  featurePages: [
    {
      path: '/features/animated-qr',
      title: 'Animated QR Codes',
      description: 'Create eye-catching animated QR codes with QRloop',
      lastmod: '2025-07-03',
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      path: '/features/bulk-generator',
      title: 'Bulk QR Code Generator',
      description: 'Generate multiple QR codes in batches for marketing campaigns',
      lastmod: '2025-06-28',
      changefreq: 'monthly',
      priority: 0.8
    }
  ]
};

// Generate sitemap XML
function generateSitemap() {
  console.log('🚀 Generating sitemap...');

  const xmlStart = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  const xmlEnd = `</urlset>`;

  // Generate URLs for main routes
  let urlXml = config.routes
    .map(route => {
      return `  <url>
    <loc>${config.baseUrl}${route.path}</loc>
    <lastmod>${config.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    })
    .join('\n');

  // Add blog posts
  const blogXml = config.blogPosts
    .map(post => {
      return `  <url>
    <loc>${config.baseUrl}${post.path}</loc>
    <lastmod>${post.lastmod || config.lastmod}</lastmod>
    <changefreq>${post.changefreq}</changefreq>
    <priority>${post.priority}</priority>
    <image:image>
      <image:loc>${config.baseUrl}/images/blog/${post.path.split('/').pop()}.jpg</image:loc>
      <image:title>${post.title}</image:title>
    </image:image>
  </url>`;
    })
    .join('\n');

  // Add feature pages
  const featuresXml = config.featurePages
    .map(page => {
      return `  <url>
    <loc>${config.baseUrl}${page.path}</loc>
    <lastmod>${page.lastmod || config.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <image:image>
      <image:loc>${config.baseUrl}/images/features/${page.path.split('/').pop()}.jpg</image:loc>
      <image:title>${page.title}</image:title>
    </image:image>
  </url>`;
    })
    .join('\n');

  // Combine all URLs
  urlXml = [urlXml, blogXml, featuresXml].join('\n');

  const sitemapXml = `${xmlStart}${urlXml}\n${xmlEnd}`;

  try {
    fs.writeFileSync(sitemapPath, sitemapXml);
    console.log(`✅ Sitemap generated at: ${sitemapPath}`);
    
    // Also generate/update robots.txt to reference the sitemap
    generateRobotsTxt();
  } catch (error) {
    console.error('❌ Failed to generate sitemap:', error);
    process.exit(1);
  }
}

// Generate robots.txt with sitemap reference
function generateRobotsTxt() {
  const robotsContent = `# QRloop Website Robots.txt
# https://qrloop.app

User-agent: *
Allow: /

# Disallow admin and system directories
Disallow: /admin/
Disallow: /system/
Disallow: /tmp/
Disallow: /dev-dist/

# Sitemap location
Sitemap: ${config.baseUrl}/sitemap.xml`;

  try {
    fs.writeFileSync(robotsPath, robotsContent);
    console.log(`✅ Robots.txt generated at: ${robotsPath}`);
  } catch (error) {
    console.error('❌ Failed to generate robots.txt:', error);
  }
}

// Create blog image directory if it doesn't exist
function ensureImageDirectories() {
  const blogImagesDir = path.join(publicDir, 'images', 'blog');
  const featureImagesDir = path.join(publicDir, 'images', 'features');
  
  try {
    if (!fs.existsSync(blogImagesDir)) {
      fs.mkdirSync(blogImagesDir, { recursive: true });
      console.log(`✅ Created blog images directory: ${blogImagesDir}`);
    }
    
    if (!fs.existsSync(featureImagesDir)) {
      fs.mkdirSync(featureImagesDir, { recursive: true });
      console.log(`✅ Created feature images directory: ${featureImagesDir}`);
    }
  } catch (error) {
    console.error('❌ Failed to create image directories:', error);
  }
}

// Execute
ensureImageDirectories();
generateSitemap();
