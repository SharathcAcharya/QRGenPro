import React, { useState, useEffect } from 'react';
import { Download, Plus } from 'lucide-react';

const InstallButton = ({ className, showText = true, onInstallGuide }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone === true ||
                         document.referrer.includes('android-app://');
    
    setIsInstalled(isStandalone);

    const handleBeforeInstallPrompt = (e) => {
      console.log('Install prompt available');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('App installed successfully');
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        console.log('Triggering install prompt...');
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('Install outcome:', outcome);
        
        if (outcome === 'accepted') {
          console.log('User accepted installation');
        } else {
          console.log('User dismissed installation');
        }
        
        setDeferredPrompt(null);
        setIsInstallable(false);
      } catch (error) {
        console.error('Installation failed:', error);
        // Fallback to install guide
        if (onInstallGuide) {
          onInstallGuide();
        }
      }
    } else {
      console.log('No install prompt available, showing guide');
      // Show install guide if no prompt available
      if (onInstallGuide) {
        onInstallGuide();
      }
    }
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  const buttonText = deferredPrompt ? 
    (showText ? 'Install for Offline Use' : '') : 
    (showText ? 'Get Install Guide' : '');

  const icon = deferredPrompt ? Download : Plus;
  const IconComponent = icon;

  return (
    <button
      onClick={handleInstall}
      className={className}
      title={deferredPrompt ? 'Install QRGenPro as an app' : 'Show installation instructions'}
    >
      <IconComponent className="w-4 h-4 md:w-5 md:h-5" />
      {showText && buttonText && (
        <span className="text-sm font-medium">{buttonText}</span>
      )}
    </button>
  );
};

export default InstallButton;
