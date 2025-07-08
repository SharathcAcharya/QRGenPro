import React, { useEffect } from 'react';
import { Download, Eye } from 'lucide-react';

const QRPreview = ({ qrCode, qrRef }) => {
  useEffect(() => {
    if (qrCode && qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.append(qrRef.current);
    }
  }, [qrCode]);

  const handleDownload = (format = 'png') => {
    if (qrCode) {
      qrCode.download({
        name: `qr-code-${Date.now()}`,
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
        <div className="p-4 bg-white rounded-lg shadow-inner border-2 border-gray-100 dark:border-gray-600">
          <div ref={qrRef} className="flex justify-center items-center min-h-[300px]" />
        </div>
      </div>

      {/* Download Options */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900 dark:text-white">
          Download Options
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => handleDownload('png')}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download PNG</span>
          </button>
          <button
            onClick={() => handleDownload('svg')}
            className="btn-secondary flex items-center justify-center space-x-2"
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
            <span className="ml-2 font-medium text-gray-900 dark:text-white">300x300px</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPreview;
