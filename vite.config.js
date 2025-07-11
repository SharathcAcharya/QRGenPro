import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Conditionally import plugins based on environment
const plugins = [react()];

// Add PWA plugin
plugins.push(
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['icon.svg', 'robots.txt', 'apple-touch-icon.png'],
    manifest: {
      name: 'QRloop - Advanced QR Code Generator',
      short_name: 'QRloop',
      description: 'Create beautiful, customizable QR codes with logos, custom colors, and professional styling.',
      theme_color: '#2563eb',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'any',
      scope: '/',
      start_url: '/',
      id: '/',
      icons: [
        {
          src: 'icon.svg',
          sizes: '192x192',
          type: 'image/svg+xml',
          purpose: 'any'
        },
        {
          src: 'icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: 'icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: 'icons/icon-384.png',
          sizes: '384x384',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: 'icons/icon-72.png',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'maskable any'
        }
      ],
      screenshots: [
        {
          src: 'screenshots/desktop.png',
          sizes: '1280x800',
          type: 'image/png',
          form_factor: 'wide',
          label: 'QRloop on Desktop'
        },
        {
          src: 'screenshots/mobile.png',
          sizes: '750x1334',
          type: 'image/png',
          form_factor: 'narrow',
          label: 'QRloop on Mobile'
        }
      ],
      related_applications: [],
      prefer_related_applications: false
    },
    workbox: {
      // Workbox options
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
      // Don't fallback on document based (e.g. `/some-page`) requests
      // Even though this says `null` by default, I had to set this specifically to get it working on Netlify
      navigateFallback: null
    },
    // Enable dev SW on development
    devOptions: {
      enabled: true,
      type: 'module'
    }
  })
);

// Conditionally load imagemin plugin only if not in SKIP_IMAGE_OPTIMIZER mode
if (!process.env.SKIP_IMAGE_OPTIMIZER) {
  try {
    // Comment out the problematic imagemin plugin
    // const imagemin = await import('vite-plugin-imagemin');
    // plugins.push(
    //   imagemin.default({
    //     gifsicle: { optimizationLevel: 3 },
    //     optipng: { optimizationLevel: 5 },
    //     mozjpeg: { quality: 75 },
    //     pngquant: { quality: [0.7, 0.8], speed: 4 },
    //     svgo: { plugins: [{ name: 'removeViewBox', active: false }] },
    //   })
    // );
    console.log('✅ Image optimization disabled - use postbuild script instead');
  } catch (e) {
    console.warn('⚠️ Image optimization setup failed:', e.message);
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins,
  
  // Force rollup to use JS implementation to avoid native dependency issues
  esbuild: {
    target: 'esnext'
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    // Increase chunk size warning limit to avoid warnings for large models
    chunkSizeWarningLimit: 1200, // 1200 KB (1.2 MB)
    
    // Configure Rollup options for better chunking
    rollupOptions: {
      external: (id) => {
        // Ignore problematic native dependencies
        if (id.includes('@rollup/rollup-win32-x64-msvc')) {
          return true;
        }
        return false;
      },
      output: {
        // Configure manual chunks for better code splitting
        manualChunks: (id) => {
          // React core
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          
          // React ecosystem
          if (id.includes('node_modules/react-router') || 
              id.includes('node_modules/react-helmet')) {
            return 'react-ecosystem';
          }
          
          // Three.js core
          if (id.includes('node_modules/three/') && !id.includes('examples')) {
            return 'three-core';
          }
          
          // Three.js examples and extra modules (often large)
          if (id.includes('node_modules/three/examples/')) {
            return 'three-extras';
          }
          
          // React Three Fiber
          if (id.includes('node_modules/@react-three/fiber')) {
            return 'react-three-fiber';
          }
          
          // Drei (split into core and extras)
          if (id.includes('node_modules/@react-three/drei')) {
            // Common smaller components
            if (id.includes('OrbitControls') || 
                id.includes('Html') || 
                id.includes('useTexture')) {
              return 'drei-core';
            }
            // Larger components
            return 'drei-extras';
          }
          
          // Camera controls (isolated)
          if (id.includes('camera-controls')) {
            return 'camera-controls';
          }
          
          // QR libraries
          if (id.includes('qr-code-styling') || id.includes('jsqr')) {
            return 'qr-libs';
          }
          
          // Utility libraries
          if (id.includes('node_modules/jszip') || 
              id.includes('node_modules/lucide-react')) {
            return 'utils';
          }
          
          // App components by feature area
          if (id.includes('/components/QR3DPreview')) {
            return 'qr3d-preview';
          }
          
          if (id.includes('/components/') && 
             (id.includes('Generator') || id.includes('Customizer') || id.includes('Preview'))) {
            return 'qr-generation';
          }
          
          // UI components
          if (id.includes('/components/') && 
             (id.includes('Modal') || id.includes('Button') || id.includes('Toggle'))) {
            return 'ui-components';
          }
        }
      }
    }
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  
  server: {
    port: 3000,
    open: true,
  }
});
