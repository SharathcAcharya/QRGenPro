import React from 'react';

// Simple loading skeleton for QR preview
export const QRPreviewSkeleton = () => (
  <div className="animate-pulse" role="status" aria-label="Loading QR Preview">
    <div className="flex justify-center mb-6">
      <div className="p-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 h-64"></div>
    </div>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mt-6"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
    </div>
    <span className="sr-only">Loading QR code preview</span>
  </div>
);

// Loading skeleton for QR customizer
export const QRCustomizerSkeleton = () => (
  <div className="animate-pulse" role="status" aria-label="Loading QR Customizer">
    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
    <div className="space-y-6">
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ))}
      </div>
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="grid grid-cols-2 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
    <span className="sr-only">Loading customization options</span>
  </div>
);

// Loading skeleton for 3D preview
export const QR3DPreviewSkeleton = () => (
  <div className="animate-pulse" role="status" aria-label="Loading 3D Preview">
    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
    <div className="flex justify-center mb-4">
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-36"></div>
    </div>
    <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
    <div className="grid grid-cols-3 gap-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      ))}
    </div>
    <span className="sr-only">Loading 3D preview</span>
  </div>
);

// Loading skeleton for scanner
export const QRScannerSkeleton = () => (
  <div className="animate-pulse" role="status" aria-label="Loading QR Scanner">
    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-48"></div>
      </div>
      <div className="flex justify-center">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-48"></div>
      </div>
    </div>
    <span className="sr-only">Loading QR scanner</span>
  </div>
);

// Generic fallback loading component
export const LoadingFallback = ({ message = "Loading..." }) => (
  <div className="flex justify-center items-center p-4" role="status" aria-label={message}>
    <div className="animate-pulse flex space-x-4">
      <div className="rounded-full bg-gray-300 dark:bg-gray-700 h-12 w-12"></div>
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    </div>
    <span className="sr-only">{message}</span>
  </div>
);

// Error state component for 3D preview
export const ThreeJSErrorState = ({ message = "Could not load 3D preview" }) => (
  <div className="flex flex-col items-center justify-center h-full p-6 bg-red-50 dark:bg-red-900/20 rounded-lg" role="alert">
    <div className="text-red-600 dark:text-red-400 font-medium mb-2">3D Preview Error</div>
    <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
      {message}
    </p>
    <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
      Try generating a new QR code or refreshing the page.
    </div>
  </div>
);
