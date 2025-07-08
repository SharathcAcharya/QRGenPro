import React, { useState } from 'react';
import { HelpCircle, X, Lightbulb, Smartphone, Download, Palette, Upload, History } from 'lucide-react';

const HelpModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const features = [
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: 'Quick Start Templates',
      description: 'Use pre-made templates for common use cases like portfolios, social media, and business cards.'
    },
    {
      icon: <Upload className="h-6 w-6" />,
      title: 'Logo Embedding',
      description: 'Upload your logo or brand image to display in the center of your QR code for professional branding.'
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: 'Advanced Customization',
      description: 'Customize colors, dot styles, corner shapes, size, and error correction levels to match your brand.'
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: 'High-Quality Downloads',
      description: 'Download your QR codes in PNG format for web use or SVG format for print and scalability.'
    },
    {
      icon: <History className="h-6 w-6" />,
      title: 'QR History',
      description: 'Keep track of your recently generated QR codes and quickly reuse or modify them.'
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: 'Mobile Responsive',
      description: 'Create and customize QR codes on any device - desktop, tablet, or mobile phone.'
    }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors duration-200 z-50"
        aria-label="Help"
      >
        <HelpCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              How to Use QRGenPro
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Pro Tips:
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Use higher error correction for QR codes that might get damaged</li>
              <li>• Keep logos small (recommended: 40% of QR code size) for better scanning</li>
              <li>• Test your QR codes on different devices before printing</li>
              <li>• Use high contrast colors for better readability</li>
              <li>• SVG format is best for print materials</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
