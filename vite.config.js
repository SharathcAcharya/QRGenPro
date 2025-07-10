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
    includeAssets: ['icon.svg'],
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
      icons: [
        {
          src: 'icon.svg',
          sizes: '192x192',
          type: 'image/svg+xml',
          purpose: 'any'
        }
      ]
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
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
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
