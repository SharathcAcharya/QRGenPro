import React, { useEffect } from 'react';
import { Download, Eye, Share2, Brain, Save, Box } from 'lucide-react';

const QRPreview = ({ qrCode, qrRef, onEnhanceClick, onShareClick, onSaveToLibrary, on3DPreviewClick }) => {
  useEffect(() => {
    if (qrCode && qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.append(qrRef.current);
    }
  }, [qrCode, qrRef]);

  const handleDownload = (format = 'png') => {
    if (qrCode) {
      // Get the content of the QR code to use in the filename
      const qrContent = qrCode._options?.data || 'qrcode';
      let fileName;
      
      try {
        // If not a URL, use the first few characters
        fileName = qrContent.substring(0, 15).replace(/[^a-z0-9]/gi, '-');
      } catch (_unused) {
        // If not a URL, use the first few characters
        fileName = qrContent.substring(0, 15).replace(/[^a-z0-9]/gi, '-');
      }
      
      qrCode.download({
        name: `qrcode-${fileName}-${Date.now()}`,
        extension: format
      });
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Eye className="h-5 w-5 mr-2" />
        QR Code Preview
      </h3>
      
      {/* QR Code Display */}
      <div className="flex justify-center mb-6">
        <div className="p-6 bg-white rounded-lg shadow-inner border-2 border-gray-100 dark:border-gray-600">
          <div ref={qrRef} className="flex justify-center items-center min-h-[400px]" />
        </div>
      </div>

      {/* Download Options */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900 dark:text-white">
          Quick Actions
        </h4>
        
        {/* Primary Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <button
            onClick={on3DPreviewClick}
            className="btn-gradient flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
            aria-label="3D Preview"
            data-action="3d-preview"
          >
            <Box className="h-4 w-4" />
            <span>3D View</span>
          </button>
          <button
            onClick={onEnhanceClick}
            className="btn-gradient flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            aria-label="AI Enhance"
            data-action="ai-enhance"
          >
            <Brain className="h-4 w-4" />
            <span>AI Enhance</span>
          </button>
          <button
            onClick={onShareClick}
            className="btn-gradient flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
            aria-label="Share QR Code"
            data-action="share-qr"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
          <button
            onClick={onSaveToLibrary}
            className="btn-gradient flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            aria-label="Save to Library"
            data-action="save-to-library"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
        </div>

        <h4 className="text-md font-medium text-gray-900 dark:text-white mt-6">
          Download Options
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => handleDownload('png')}
            className="btn-primary flex items-center justify-center space-x-2"
            aria-label="Download as PNG"
            data-action="download-png"
          >
            <Download className="h-4 w-4" />
            <span>Download PNG</span>
          </button>
          <button
            onClick={() => handleDownload('svg')}
            className="btn-secondary flex items-center justify-center space-x-2"
            aria-label="Download as SVG"
            data-action="download-svg"
          >
            <Download className="h-4 w-4" />
            <span>Download SVG</span>
          </button>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          PNG files are great for print and web use. SVG files are vector-based and scale perfectly.
        </div>
      </div>

      {/* QR Code Info */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Format:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">QR Code</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Size:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">400x400px</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPreview;
