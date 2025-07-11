import React, { useState, useRef, Suspense, lazy } from 'react';
import { Box, RotateCw, Download, Share2, Eye } from 'lucide-react';
import { ThreeJSErrorState } from './LoadingSkeletons';

// Lazy load sub-components to reduce initial bundle size
const QR3DControls = lazy(() => import('./QR3D/QR3DControls'));
const QR3DCanvas = lazy(() => import('./QR3D/QR3DCanvas'));
const QR3DSettings = lazy(() => import('./QR3D/QR3DSettings'));
const QR3DErrorBoundary = lazy(() => import('./QR3D/QR3DErrorBoundary'));

// Loading fallback component
const Loading3D = () => (
  <div className="w-full h-64 md:h-96 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
    <div className="text-center">
      <RotateCw className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-500" />
      <p className="text-gray-600 dark:text-gray-300">Loading 3D viewer...</p>
    </div>
  </div>
);

const QR3DPreview = ({ qrImageUrl, options, onScreenshot }) => {
  const [viewMode, setViewMode] = useState('standard');
  const [animationMode, setAnimationMode] = useState('rotate');
  const [settings, setSettings] = useState({
    scale: 1,
    rotationX: 0,
    rotationY: 0,
    material: 'standard',
    backgroundColor: '#000000',
    showGridHelper: false,
    showShadows: true,
    performance: 'balanced'
  });

  return (
    <div className="qr-3d-preview w-full mb-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center">
          <Box className="mr-2" /> 3D QR Code
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => onScreenshot && onScreenshot()}
            className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            aria-label="Download 3D view"
            title="Download 3D view"
          >
            <Download className="w-5 h-5" />
          </button>
          <button 
            onClick={() => {/* Share functionality */}}
            className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            aria-label="Share 3D view"
            title="Share 3D view"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => {/* Toggle fullscreen */}}
            className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            aria-label="Toggle fullscreen"
            title="Toggle fullscreen"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Suspense fallback={<Loading3D />}>
        <QR3DErrorBoundary>
          <div className="relative">
            <QR3DCanvas 
              qrImageUrl={qrImageUrl} 
              animationMode={animationMode}
              settings={settings}
              viewMode={viewMode}
            />
            
            <QR3DControls
              animationMode={animationMode}
              setAnimationMode={setAnimationMode}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </div>
        </QR3DErrorBoundary>
      </Suspense>

      <Suspense fallback={<div className="p-4">Loading settings...</div>}>
        <QR3DSettings 
          settings={settings}
          setSettings={setSettings}
        />
      </Suspense>
    </div>
  );
};

export default QR3DPreview;
