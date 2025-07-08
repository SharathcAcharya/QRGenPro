import React, { useState } from 'react';
import { X, Smartphone, Monitor, Tablet, Chrome, Download, Plus, Share, HomeIcon } from 'lucide-react';

const InstallGuideModal = ({ isOpen, onClose }) => {
  const [selectedDevice, setSelectedDevice] = useState('desktop');

  const deviceGuides = {
    desktop: {
      icon: Monitor,
      title: 'Desktop Installation',
      browsers: [
        {
          name: 'Chrome',
          icon: Chrome,
          steps: [
            'Open QRGenPro in Chrome browser',
            'Look for the install icon (⊕) in the address bar',
            'Click the install icon',
            'Click "Install" in the popup dialog',
            'QRGenPro will appear as a desktop app'
          ]
        },
        {
          name: 'Edge',
          icon: Monitor,
          steps: [
            'Open QRGenPro in Microsoft Edge',
            'Click the three dots menu (⋯)',
            'Select "Apps" → "Install this site as an app"',
            'Choose a name and click "Install"',
            'The app will launch in its own window'
          ]
        }
      ]
    },
    mobile: {
      icon: Smartphone,
      title: 'Mobile Installation',
      browsers: [
        {
          name: 'Chrome (Android)',
          icon: Chrome,
          steps: [
            'Open QRGenPro in Chrome mobile',
            'Tap the three dots menu (⋮)',
            'Select "Add to Home screen"',
            'Choose a name and tap "Add"',
            'Find QRGenPro on your home screen'
          ]
        },
        {
          name: 'Safari (iOS)',
          icon: Share,
          steps: [
            'Open QRGenPro in Safari',
            'Tap the Share button (📤)',
            'Scroll down and tap "Add to Home Screen"',
            'Edit the name if needed and tap "Add"',
            'QRGenPro icon will appear on your home screen'
          ]
        }
      ]
    },
    tablet: {
      icon: Tablet,
      title: 'Tablet Installation',
      browsers: [
        {
          name: 'Chrome (Android Tablet)',
          icon: Chrome,
          steps: [
            'Open QRGenPro in Chrome',
            'Tap the three dots menu',
            'Select "Add to Home screen"',
            'Confirm the installation',
            'Access from home screen or app drawer'
          ]
        },
        {
          name: 'Safari (iPad)',
          icon: Share,
          steps: [
            'Open QRGenPro in Safari',
            'Tap the Share button',
            'Select "Add to Home Screen"',
            'Customize the name and tap "Add"',
            'Find the app on your iPad home screen'
          ]
        }
      ]
    }
  };

  const benefits = [
    {
      icon: Download,
      title: 'Offline Access',
      description: 'Use QRGenPro even without internet connection'
    },
    {
      icon: HomeIcon,
      title: 'Home Screen Access',
      description: 'Quick access directly from your device home screen'
    },
    {
      icon: Monitor,
      title: 'Native App Feel',
      description: 'Runs in its own window like a native app'
    },
    {
      icon: Plus,
      title: 'No App Store',
      description: 'Install directly from the web, no app store needed'
    }
  ];

  if (!isOpen) return null;

  const selectedGuide = deviceGuides[selectedDevice];
  const DeviceIcon = selectedGuide.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[85vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Download className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Install QRGenPro
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          {/* Device Selection */}
          <div className="lg:w-1/4 p-6 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Choose Your Device
            </h3>
            <div className="space-y-2">
              {Object.entries(deviceGuides).map(([key, guide]) => {
                const Icon = guide.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDevice(key)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      selectedDevice === key
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{guide.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Benefits */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Why Install?
              </h4>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <benefit.icon className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-gray-900 dark:text-white">
                        {benefit.title}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {benefit.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Installation Instructions - Scrollable */}
          <div className="lg:w-3/4 flex-1 min-h-0 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <DeviceIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedGuide.title}
                </h3>
              </div>

            <div className="space-y-6">
              {selectedGuide.browsers.map((browser, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <browser.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {browser.name}
                    </h4>
                  </div>
                  <ol className="space-y-2">
                    {browser.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                          {stepIndex + 1}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>

              {/* Additional Tips */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                  💡 Pro Tips
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Once installed, QRGenPro works offline</li>
                  <li>• You can uninstall anytime from your device settings</li>
                  <li>• The app automatically updates in the background</li>
                  <li>• All your QR history and settings are preserved</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex-shrink-0">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Having trouble? Try refreshing the page or check your browser settings.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallGuideModal;
