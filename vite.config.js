import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
  ],
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  
  server: {
    port: 3000,
    open: true,
  }
});
