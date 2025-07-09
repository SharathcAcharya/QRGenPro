import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import QRCustomizer from './QRCustomizer';
import QRPreview from './QRPreview';
import QRHistory from './QRHistory';
import BatchQRGenerator from './BatchQRGenerator';
import QRTemplates from './QRTemplates';
import QRAnalytics from './QRAnalytics';
import QRScanner from './QRScanner';
import { Link, Upload, Sparkles, BarChart3, FileText, Camera, Palette, QrCode, Layers, ScanLine } from 'lucide-react';

const QRGenerator = ({ onQRGenerated }) => {
  const [url, setUrl] = useState('https://example.com');
  const [qrCode, setQrCode] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [activeTab, setActiveTab] = useState('generator');
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

  // Tab configuration
  const tabs = [
    {
      id: 'generator',
      label: 'QR Generator',
      icon: QrCode,
      description: 'Create single QR codes'
    },
    {
      id: 'batch',
      label: 'Batch Generator',
      icon: Layers,
      description: 'Generate multiple QR codes'
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: FileText,
      description: 'Pre-designed QR templates'
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
      description: 'Usage statistics'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'generator':
        return renderGeneratorContent();
      case 'batch':
        return <BatchQRGenerator onQRGenerated={onQRGenerated} />;
      case 'templates':
        return <QRTemplates onTemplateSelect={(template) => {
          setQrOptions(prev => ({ ...prev, ...template.options }));
          setActiveTab('generator');
        }} />;
      case 'scanner':
        return <QRScanner />;
      case 'analytics':
        return <QRAnalytics />;
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
          <QRCustomizer options={qrOptions} onOptionsChange={handleOptionsChange} />
        </div>

        {/* Right Panel - Preview and History */}
        <div className="space-y-6">
          <QRPreview qrCode={qrCode} qrRef={qrRef} />
          <QRHistory onSelectFromHistory={handleSelectFromHistory} />
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
