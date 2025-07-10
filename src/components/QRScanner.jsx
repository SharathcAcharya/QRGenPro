import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Check, X, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import jsQR from 'jsqr';

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [scanningProgress, setScanningProgress] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    checkCameraAvailability();
    return () => {
      stopCamera();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideoDevice = devices.some(device => device.kind === 'videoinput');
      setHasCamera(hasVideoDevice);
    } catch (err) {
      setHasCamera(false);
      setError('Could not detect camera devices. Please ensure camera permissions are enabled.');
      console.error('Camera detection error:', err);
    }
  };

  const startCamera = async () => {
    try {
      setError(null);
      setScanningProgress(0);
      
      // Try to get the best camera for QR scanning (back camera on mobile)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        
        // Start scanning process after video is loaded
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          scanForQR();
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera permissions and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please make sure your device has a camera.');
      } else {
        setError(`Camera error: ${err.message || 'Unknown error'}`);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setScanningProgress(0);
  };

  const scanForQR = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        
        if (code) {
          // Highlight the QR code
          ctx.lineWidth = 4;
          ctx.strokeStyle = "#FF3B58";
          ctx.beginPath();
          ctx.moveTo(code.location.topLeftCorner.x, code.location.topLeftCorner.y);
          ctx.lineTo(code.location.topRightCorner.x, code.location.topRightCorner.y);
          ctx.lineTo(code.location.bottomRightCorner.x, code.location.bottomRightCorner.y);
          ctx.lineTo(code.location.bottomLeftCorner.x, code.location.bottomLeftCorner.y);
          ctx.lineTo(code.location.topLeftCorner.x, code.location.topLeftCorner.y);
          ctx.stroke();
          
          // QR code detected
          handleQRDetected({
            data: code.data,
            location: {
              topLeftCorner: code.location.topLeftCorner,
              topRightCorner: code.location.topRightCorner,
              bottomLeftCorner: code.location.bottomLeftCorner,
              bottomRightCorner: code.location.bottomRightCorner
            }
          });
          return;
        }
      } catch (err) {
        console.error('QR scanning error:', err);
      }
      
      // Update scanning progress animation
      setScanningProgress(prev => (prev + 1) % 100);
    }

    // Continue scanning
    if (isScanning) {
      animationRef.current = requestAnimationFrame(scanForQR);
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
    setScannedData(null);
    
    try {
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Use jsQR to detect QR code
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        
        if (code) {
          // Draw the QR code location
          ctx.lineWidth = 4;
          ctx.strokeStyle = "#FF3B58";
          ctx.beginPath();
          ctx.moveTo(code.location.topLeftCorner.x, code.location.topLeftCorner.y);
          ctx.lineTo(code.location.topRightCorner.x, code.location.topRightCorner.y);
          ctx.lineTo(code.location.bottomRightCorner.x, code.location.bottomRightCorner.y);
          ctx.lineTo(code.location.bottomLeftCorner.x, code.location.bottomLeftCorner.y);
          ctx.lineTo(code.location.topLeftCorner.x, code.location.topLeftCorner.y);
          ctx.stroke();
          
          // Set scanned data
          setScannedData({
            content: code.data,
            timestamp: new Date().toISOString(),
            type: detectContentType(code.data),
            isValid: isValidURL(code.data)
          });
        } else {
          setError('No QR code found in the image. Please try another image or ensure the QR code is clearly visible.');
        }
        
        URL.revokeObjectURL(imageUrl);
      };
      
      img.onerror = () => {
        setError('Error loading image. Please try a different file format (JPG, PNG, etc.).');
        URL.revokeObjectURL(imageUrl);
      };
      
      img.src = imageUrl;
    } catch (err) {
      setError('Error processing file: ' + err.message);
    }
  };

  const detectContentType = (content) => {
    if (isValidURL(content)) return 'URL';
    if (content.includes('@') && content.includes('.')) return 'Email';
    if (/^\+?[\d\s-()]+$/.test(content)) return 'Phone';
    if (content.startsWith('WIFI:')) return 'WiFi';
    if (content.startsWith('BEGIN:VCARD')) return 'Contact';
    if (content.startsWith('geo:')) return 'Location';
    if (content.startsWith('SMSTO:') || content.startsWith('sms:')) return 'SMS';
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
      // Show a temporary success message
      setError('Copied to clipboard!');
      setTimeout(() => setError(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('Failed to copy to clipboard. Please try manually selecting and copying the text.');
    }
  };

  const openLink = (url) => {
    if (isValidURL(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const reset = () => {
    setScannedData(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
                <div className={`${
                  error === 'Copied to clipboard!' 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                } border rounded-lg p-4`}>
                  <div className="flex items-center space-x-2">
                    {error === 'Copied to clipboard!' 
                      ? <Check className="w-5 h-5 text-green-500" /> 
                      : <AlertCircle className="w-5 h-5 text-red-500" />
                    }
                    <p>{error}</p>
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
                  <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg">
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500 opacity-70" 
                         style={{ width: `${scanningProgress}%`, transition: 'width 0.3s ease-in-out' }}></div>
                  </div>
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
