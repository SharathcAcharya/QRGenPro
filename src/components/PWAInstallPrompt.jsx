import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Tablet, Plus } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceType, setDeviceType] = useState('desktop');
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?=.*tablet)|kindle|silk/i.test(userAgent);
    
    if (isMobile && !isTablet) {
      setDeviceType('mobile');
    } else if (isTablet) {
      setDeviceType('tablet');
    } else {
      setDeviceType('desktop');
    }

    const handleBeforeInstallPrompt = (e) => {
      console.log('beforeinstallprompt fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
      
      // Show prompt after a delay if not dismissed recently
      const dismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (!dismissed || Date.now() - parseInt(dismissed) > 24 * 60 * 60 * 1000) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      }
    };

    const handleAppInstalled = () => {
      console.log('App installed');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      setCanInstall(false);
      
      // Show success notification
      if (window.addNotification) {
        window.addNotification({
          type: 'success',
          title: 'App Installed!',
          message: 'QRloop has been installed on your device.'
        });
      }
    };

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone === true ||
                         document.referrer.includes('android-app://');
    
    if (isStandalone) {
      setIsInstalled(true);
    }

    // Listen for events
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For testing: Force show install capability after 5 seconds if no prompt
    const testTimer = setTimeout(() => {
      if (!deferredPrompt && !isStandalone) {
        console.log('No install prompt detected, checking if we can show manual instructions');
        setCanInstall(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(testTimer);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // No install prompt available, show manual instructions
      setShowPrompt(true);
      return;
    }

    try {
      console.log('Triggering install prompt');
      const result = await deferredPrompt.prompt();
      console.log('Install prompt result:', result);
      
      const { outcome } = await deferredPrompt.userChoice;
      console.log('User choice:', outcome);
      
      if (outcome === 'accepted') {
        setShowPrompt(false);
        if (window.addNotification) {
          window.addNotification({
            type: 'success',
            title: 'Installing...',
            message: 'QRloop is being installed on your device.'
          });
        }
      }
    } catch (error) {
      console.error('Install failed:', error);
      // Fallback to manual instructions
      setShowPrompt(true);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setCanInstall(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  const getInstallInstructions = () => {
    switch (deviceType) {
      case 'mobile':
        if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
          return 'Tap Share button (📤) → "Add to Home Screen"';
        }
        return 'Tap menu (⋮) → "Add to Home screen"';
      case 'tablet':
        return 'Use "Add to Home Screen" from browser options';
      default:
        return 'Look for install icon (⊕) in address bar or use browser menu';
    }
  };

  // Don't show if installed
  if (isInstalled) {
    return null;
  }

  // Only show if we have explicit prompt or can install
  if (!showPrompt) {
    return null;
  }

  const DeviceIcon = getDeviceIcon();

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 backdrop-blur-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center animate-pulse-glow">
              <DeviceIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Install QRloop
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
              Get the app on your {deviceType} for quick access and offline use.
            </p>
            
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">
              💡 {getInstallInstructions()}
            </p>
            
            <div className="flex space-x-2">
              {deferredPrompt ? (
                <button
                  onClick={handleInstall}
                  className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all transform hover:scale-105"
                >
                  <Download className="w-3 h-3" />
                  <span>Install Now</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowPrompt(true)}
                  className="flex items-center space-x-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all transform hover:scale-105"
                >
                  <Plus className="w-3 h-3" />
                  <span>Show Guide</span>
                </button>
              )}
              
              <button
                onClick={handleDismiss}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xs px-2 py-1.5 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
