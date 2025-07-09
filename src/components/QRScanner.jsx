import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Check, X, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const [hasCamera, setHasCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    checkCameraAvailability();
    return () => {
      stopCamera();
    };
  }, []);

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideoDevice = devices.some(device => device.kind === 'videoinput');
      setHasCamera(hasVideoDevice);
    } catch (err) {
      setHasCamera(false);
    }
  };

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        
        // Start scanning process
        setTimeout(scanForQR, 100);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions and try again.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const scanForQR = async () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        // In a real implementation, you would use a QR code library like jsQR
        // For this demo, we'll simulate QR detection
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Simulate QR code detection (replace with real QR library)
        if (Math.random() > 0.95) { // Simulate occasional detection
          const mockQRData = {
            data: 'https://example.com',
            location: {
              topLeftCorner: { x: 100, y: 100 },
              topRightCorner: { x: 200, y: 100 },
              bottomLeftCorner: { x: 100, y: 200 },
              bottomRightCorner: { x: 200, y: 200 }
            }
          };
          handleQRDetected(mockQRData);
          return;
        }
      } catch (err) {
        console.error('QR scanning error:', err);
      }
    }

    // Continue scanning
    if (isScanning) {
      requestAnimationFrame(scanForQR);
    }
  };

  const handleQRDetected = (qrData) => {
    setScannedData({
      content: qrData.data,
      timestamp: new Date().toISOString(),
      type: detectContentType(qrData.data),
      isValid: isValidURL(qrData.data)
    });
    stopCamera();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    
    try {
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Simulate QR detection from image
        // In real implementation, use jsQR or similar library
        setTimeout(() => {
          const mockData = 'https://github.com/user/repo'; // Simulate detected data
          setScannedData({
            content: mockData,
            timestamp: new Date().toISOString(),
            type: detectContentType(mockData),
            isValid: isValidURL(mockData)
          });
        }, 1000);
        
        URL.revokeObjectURL(imageUrl);
      };
      
      img.src = imageUrl;
    } catch (err) {
      setError('Failed to process image. Please try another image.');
    }
  };

  const detectContentType = (content) => {
    if (isValidURL(content)) return 'URL';
    if (content.includes('@') && content.includes('.')) return 'Email';
    if (/^\+?[\d\s-()]+$/.test(content)) return 'Phone';
    if (content.startsWith('WIFI:')) return 'WiFi';
    return 'Text';
  };

  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openLink = (url) => {
    if (isValidURL(url)) {
      window.open(url, '_blank');
    }
  };

  const reset = () => {
    setScannedData(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              QR Scanner & Validator
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Scan QR codes using your camera or upload an image file
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {!scannedData && !isScanning && (
            <div className="space-y-6">
              {/* Camera Section */}
              {hasCamera && (
                <div className="text-center">
                  <button
                    onClick={startCamera}
                    className="flex items-center space-x-2 mx-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Start Camera Scan</span>
                  </button>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Point your camera at a QR code
                  </p>
                </div>
              )}

              {/* File Upload Section */}
              <div className="text-center">
                <label className="flex items-center space-x-2 mx-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors cursor-pointer">
                  <Upload className="w-5 h-5" />
                  <span>Upload QR Image</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Select an image file containing a QR code
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Camera View */}
          {isScanning && (
            <div className="space-y-4">
              <div className="relative bg-gray-900 rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg"></div>
                </div>
              </div>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Stop Scanner
                </button>
              </div>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Position the QR code within the dashed square
              </p>
            </div>
          )}

          {/* Scan Results */}
          {scannedData && (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold text-green-700 dark:text-green-300">
                    QR Code Detected
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Content Type
                    </label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {scannedData.type}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Content
                    </label>
                    <div className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                      <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                        {scannedData.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => copyToClipboard(scannedData.content)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Copy
                    </button>
                    
                    {scannedData.isValid && (
                      <button
                        onClick={() => openLink(scannedData.content)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open</span>
                      </button>
                    )}
                    
                    <button
                      onClick={reset}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Scan Another</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hidden Canvas for Image Processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
