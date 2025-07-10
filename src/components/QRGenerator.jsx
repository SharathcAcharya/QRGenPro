import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import QRCodeStyling from 'qr-code-styling';
import QRPreview from './QRPreview';
import { Link, Upload, Sparkles, BarChart3, FileText, Camera, Palette, QrCode, Layers, ScanLine, Brain, Share2, FolderOpen, Users, Box } from 'lucide-react';
import { 
  QR3DPreviewSkeleton, 
  QRCustomizerSkeleton, 
  QRScannerSkeleton,
  LoadingFallback
} from './LoadingSkeletons';

// Lazy loaded components
const QRCustomizer = lazy(() => import('./QRCustomizer'));
const ModernQRCustomizer = lazy(() => import('./ModernQRCustomizer'));
const QRHistory = lazy(() => import('./QRHistory'));
const BatchQRGenerator = lazy(() => import('./BatchQRGenerator'));
const QRTemplates = lazy(() => import('./QRTemplates'));
const QRAnalytics = lazy(() => import('./QRAnalytics'));
const QRScanner = lazy(() => import('./QRScanner'));
const AIQREnhancer = lazy(() => import('./AIQREnhancer'));
const SocialShareWidget = lazy(() => import('./SocialShareWidget'));
const QRLibraryManager = lazy(() => import('./QRLibraryManager'));
const AdvancedDashboard = lazy(() => import('./AdvancedDashboard'));
const CollaborativeWorkspace = lazy(() => import('./CollaborativeWorkspace'));
const QR3DPreview = lazy(() => import('./QR3DPreview'));
const QREnhancedAnalytics = lazy(() => import('./QREnhancedAnalytics'));
const CodeExporter = lazy(() => import('./CodeExporter'));
const VoiceCommandSystem = lazy(() => import('./VoiceCommandSystem'));

const QRGenerator = ({ onQRGenerated, activeTab: externalActiveTab, onTabChange }) => {
  const [url, setUrl] = useState('https://example.com');
  const [qrCode, setQrCode] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [activeTab, setActiveTab] = useState(externalActiveTab || 'generator');
  const [qrOptions, setQrOptions] = useState({
    width: 300,
    height: 300,
    type: 'svg',
    data: 'https://example.com',
    image: '',
    margin: 10,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'Q'
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.6,
      margin: 15,
      crossOrigin: 'anonymous'
    },
    dotsOptions: {
      color: '#000000',
      type: 'rounded'
    },
    backgroundOptions: {
      color: '#FFFFFF'
    },
    cornersSquareOptions: {
      color: '#000000',
      type: 'square'
    },
    cornersDotOptions: {
      color: '#000000',
      type: 'square'
    }
  });

  const qrRef = useRef(null);

  // Sample URLs for quick testing
  const sampleUrls = [
    { label: 'Portfolio', url: 'https://yourportfolio.com' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/yourprofile' },
    { label: 'GitHub', url: 'https://github.com/yourusername' },
    { label: 'Business', url: 'https://yourbusiness.com' },
  ];

  useEffect(() => {
    const newQrCode = new QRCodeStyling(qrOptions);
    setQrCode(newQrCode);
  }, []);

  useEffect(() => {
    if (qrCode) {
      qrCode.update({
        ...qrOptions,
        data: url,
        image: logoImage
      });
    }
  }, [qrCode, url, logoImage, qrOptions]);

  // Sync external activeTab changes
  useEffect(() => {
    if (externalActiveTab && externalActiveTab !== activeTab) {
      setActiveTab(externalActiveTab);
    }
  }, [externalActiveTab]);

  // Notify parent of tab changes
  useEffect(() => {
    if (onTabChange && activeTab !== externalActiveTab) {
      onTabChange(activeTab);
    }
  }, [activeTab, onTabChange]);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleUrlSubmit = () => {
    if (url && url.trim() && window.addToQRHistory) {
      window.addToQRHistory(url.trim());
      if (onQRGenerated) onQRGenerated();
    }
  };

  const handleSelectFromHistory = (historyUrl) => {
    setUrl(historyUrl);
  };

  const handleSampleUrl = (sampleUrl) => {
    setUrl(sampleUrl);
    if (window.addToQRHistory) {
      window.addToQRHistory(sampleUrl);
      if (onQRGenerated) onQRGenerated();
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOptionsChange = (newOptions) => {
    setQrOptions(prev => ({ ...prev, ...newOptions }));
  };

  const handleDownload = (format = 'png') => {
    if (!qrCode) return;

    const downloadOptions = { name: `qrcode-${Date.now()}`, extension: format };
    
    // Get the file name based on the URL
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace('www.', '');
      downloadOptions.name = `qrcode-${hostname}`;
    } catch (e) {
      // Use default name if URL parsing fails
    }
    
    // Trigger download
    qrCode.download(downloadOptions);
    
    // Add to history
    if (url && url.trim() && window.addToQRHistory) {
      window.addToQRHistory(url.trim());
    }
    
    // Notify parent component
    if (onQRGenerated) {
      onQRGenerated();
    }
  };

  // Tab configuration
  const tabs = [
    {
      id: 'generator',
      label: 'QR Generator',
      icon: QrCode,
      description: 'Create single QR codes'
    },
    {
      id: '3d-preview',
      label: '3D Preview',
      icon: Box,
      description: '3D QR code visualization'
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: FileText,
      description: 'Pre-designed QR templates'
    },
    {
      id: 'ai-enhance',
      label: 'AI Enhance',
      icon: Brain,
      description: 'AI-powered QR enhancement'
    },
    {
      id: 'batch',
      label: 'Batch Generator',
      icon: Layers,
      description: 'Generate multiple QR codes'
    },
    {
      id: 'library',
      label: 'Library',
      icon: FolderOpen,
      description: 'Manage your QR codes'
    },
    {
      id: 'collaborate',
      label: 'Collaborate',
      icon: Users,
      description: 'Real-time collaboration'
    },
    {
      id: 'share',
      label: 'Share',
      icon: Share2,
      description: 'Social media sharing'
    },
    {
      id: 'scanner',
      label: 'Scanner',
      icon: ScanLine,
      description: 'Scan & validate QR codes'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Advanced analytics dashboard'
    },
    {
      id: 'code-export',
      label: 'Export Code',
      icon: FileText,
      description: 'Export as code or configuration'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'generator':
        return renderGeneratorContent();
      case '3d-preview':
        return (
          <Suspense fallback={<QR3DPreviewSkeleton />}>
            {qrCode ? (
              <QR3DPreview 
                qrCode={qrCode} 
                qrRef={qrRef} 
                options={qrOptions}
                url={url}
                logoImage={logoImage}
              />
            ) : (
              <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
                <div className="text-yellow-600 dark:text-yellow-400 font-medium mb-2">QR Code Not Generated</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please generate a QR code first before viewing it in 3D.
                </p>
                <button
                  onClick={() => setActiveTab('generator')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Return to Generator
                </button>
              </div>
            )}
          </Suspense>
        );
      case 'templates':
        return (
          <Suspense fallback={<LoadingFallback message="Loading templates..." />}>
            <QRTemplates onTemplateSelect={(template) => {
              setQrOptions(prev => ({ ...prev, ...template.options }));
              setActiveTab('generator');
            }} />
          </Suspense>
        );
      case 'ai-enhance':
        return (
          <Suspense fallback={<LoadingFallback message="Loading AI enhancer..." />}>
            <AIQREnhancer 
              qrCode={qrCode} 
              onEnhanceComplete={(enhancedOptions) => {
                setQrOptions(prev => ({ ...prev, ...enhancedOptions }));
                setActiveTab('generator');
              }} 
            />
          </Suspense>
        );
      case 'batch':
        return (
          <Suspense fallback={<div className="p-8 text-center">Loading Batch Generator...</div>}>
            <BatchQRGenerator onQRGenerated={onQRGenerated} />
          </Suspense>
        );
      case 'library':
        return (
          <Suspense fallback={<div className="p-8 text-center">Loading Library...</div>}>
            <QRLibraryManager 
              onQRSelect={(qrData) => {
                setUrl(qrData.data);
                setQrOptions(prev => ({ ...prev, ...qrData.options }));
                setActiveTab('generator');
              }} 
            />
          </Suspense>
        );
      case 'collaborate':
        return (
          <Suspense fallback={<div className="p-8 text-center">Loading Workspace...</div>}>
            <CollaborativeWorkspace 
              qrCode={qrCode} 
              onQRUpdate={(newOptions) => {
                setQrOptions(prev => ({ ...prev, ...newOptions }));
              }}
            />
          </Suspense>
        );
      case 'share':
        return (
          <Suspense fallback={<div className="p-8 text-center">Loading Share Options...</div>}>
            <SocialShareWidget 
              qrCode={qrCode} 
              qrData={url}
              customMessage={`Check out this QR code I created with QRloop!`}
            />
          </Suspense>
        );
      case 'scanner':
        return (
          <Suspense fallback={<QRScannerSkeleton />}>
            <QRScanner />
          </Suspense>
        );
      case 'analytics':
        return (
          <Suspense fallback={<LoadingFallback message="Loading analytics..." />}>
            <QREnhancedAnalytics />
          </Suspense>
        );
      case 'code-export':
        return (
          <Suspense fallback={<div className="p-8 text-center">Loading Code Export...</div>}>
            <CodeExporter qrOptions={qrOptions} url={url} />
          </Suspense>
        );
      default:
        return renderGeneratorContent();
    }
  };

  const renderGeneratorContent = () => (
    <>
      {/* Quick Templates */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          Quick Start Templates
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {sampleUrls.map((sample) => (
            <button
              key={sample.label}
              onClick={() => handleSampleUrl(sample.url)}
              className="p-3 text-sm bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors duration-200"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* URL Input */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Link className="h-5 w-5 mr-2" />
              URL Input
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter URL or Text
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={handleUrlChange}
                    onBlur={handleUrlSubmit}
                    placeholder="https://your-website.com"
                    className="input-field flex-1"
                  />
                  <button
                    onClick={handleUrlSubmit}
                    className="btn-primary"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Logo Upload
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Logo (Optional)
                </label>
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0
                           file:text-sm file:font-medium
                           file:bg-blue-50 file:text-blue-700
                           dark:file:bg-blue-900 dark:file:text-blue-300
                           hover:file:bg-blue-100 dark:hover:file:bg-blue-800
                           transition-colors duration-200"
                />
              </div>
              {logoImage && (
                <div className="flex items-center space-x-3">
                  <img src={logoImage} alt="Logo preview" className="h-20 w-20 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600" />
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Logo uploaded</span>
                    <button
                      onClick={() => setLogoImage(null)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customization Options */}
          <Suspense fallback={<QRCustomizerSkeleton />}>
            <ModernQRCustomizer options={qrOptions} onOptionsChange={handleOptionsChange} />
          </Suspense>
        </div>

        {/* Right Panel - Preview and History */}
        <div className="space-y-6">
          <QRPreview 
            qrCode={qrCode} 
            qrRef={qrRef}
            on3DPreviewClick={() => setActiveTab('3d-preview')}
            onEnhanceClick={() => setActiveTab('ai-enhance')}
            onShareClick={() => setActiveTab('share')}
            onSaveToLibrary={() => {
              // Save current QR to library
              const qrData = {
                id: Date.now(),
                data: url,
                options: qrOptions,
                createdAt: new Date().toISOString(),
                name: `QR Code - ${new Date().toLocaleDateString()}`
              };
              const library = JSON.parse(localStorage.getItem('qr-library') || '[]');
              library.unshift(qrData);
              localStorage.setItem('qr-library', JSON.stringify(library));
              // Show notification or switch to library tab
              setActiveTab('library');
            }}
          />
          <Suspense fallback={
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-1/3"></div>
              <div className="flex flex-wrap gap-2">
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          }>
            <QRHistory onSelectFromHistory={handleSelectFromHistory} />
          </Suspense>
          
          {/* Voice Command Help */}
          <div className="card bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                Voice Commands
              </h3>
              <Suspense fallback={<div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>}>
                <VoiceCommandSystem 
                  onCommand={(command) => {
                    switch(command) {
                      case 'generate':
                        handleUrlSubmit();
                        break;
                      case 'add_logo':
                        document.getElementById('logo').click();
                        break;
                      case 'download_png':
                        // Trigger download
                        if (qrCode) {
                          qrCode.download({
                            name: `qr-code-${Date.now()}`,
                            extension: 'png'
                          });
                        }
                        break;
                      default:
                        // Other commands will be handled by parent components
                        break;
                    }
                  }} 
                />
              </Suspense>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Try saying "Generate QR", "Download PNG", or "Add Logo" to control with your voice.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="card">
        <div className="flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600/50'
                }`}
                title={tab.description}
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default QRGenerator;
