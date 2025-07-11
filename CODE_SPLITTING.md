# Code Splitting and Performance Optimizations

## Chunk Size Management

To address chunk size warnings and improve application performance, we've implemented the following optimizations:

### 1. Dynamic Imports

We use dynamic imports with React.lazy() for all major components to ensure they're only loaded when needed:

```jsx
// Example from App.jsx
const QRGenerator = lazy(() => import('./components/QRGenerator'));
const QR3DPreview = lazy(() => import('./components/QR3DPreview'));
```

### 2. Component Splitting

Large components like QR3DPreview have been split into smaller sub-components:

- `QR3DCanvas.jsx` - Core 3D rendering
- `QR3DMesh.jsx` - QR code mesh implementation
- `QR3DControls.jsx` - UI controls for 3D view
- `QR3DSettings.jsx` - Settings panel
- `QR3DEnvironment.jsx` - Lighting and environment
- `QR3DErrorBoundary.jsx` - Error handling

### 3. Manual Chunk Configuration

The Vite configuration includes optimized manual chunking to group related dependencies:

```javascript
// vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks: (id) => {
        // React core
        if (id.includes('node_modules/react/') || 
            id.includes('node_modules/react-dom/')) {
          return 'react-core';
        }
        
        // Three.js core
        if (id.includes('node_modules/three/') && !id.includes('examples')) {
          return 'three-core';
        }
        
        // Component-specific chunks
        if (id.includes('/components/QR3DPreview')) {
          return 'qr3d-preview';
        }
        
        // ... additional chunk configuration
      }
    }
  }
}
```

### 4. Performance Settings

- Increased chunk size warning limit to accommodate large libraries
- Configured appropriate loading states and suspense boundaries
- Added performance optimization modes in the UI for mobile devices

## Future Optimization Opportunities

1. **Further Three.js optimization** - Consider using draco compression for 3D models
2. **Worker threads** - Move intensive operations to web workers
3. **Prefetching** - Implement route-based prefetching for common user paths
4. **Image optimization** - Further optimize image assets with modern formats (WebP/AVIF)
5. **Selective imports** - Use more selective imports from large libraries like Three.js

## Monitoring

When adding new features or dependencies:

1. Run `npm run analyze` to visualize bundle sizes
2. Watch for new chunk size warnings during build
3. Test performance on low-end devices
4. Consider code splitting impact on initial load vs. feature responsiveness
