import React, { useEffect } from 'react';

/**
 * Component that logs PWA installability information for debugging
 */
const PWAInstallLogger = () => {
  useEffect(() => {
    // Check if installed as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator.standalone === true);
    
    // Get browser info
    const ua = navigator.userAgent;
    const browser = {
      isChrome: /chrome/i.test(ua) && !/edge|edg/i.test(ua),
      isEdge: /edge|edg/i.test(ua),
      isFirefox: /firefox/i.test(ua),
      isSafari: /safari/i.test(ua) && !/chrome|edge|edg/i.test(ua),
      isIOS: /iphone|ipad|ipod/i.test(ua),
      isAndroid: /android/i.test(ua)
    };
    
    // Log information for debugging
    console.group('PWA Installation Status');
    console.log('Running as installed PWA:', isStandalone);
    console.log('Browser information:', browser);
    console.log('Service Worker API available:', 'serviceWorker' in navigator);
    
    // Check for BeforeInstallPrompt support
    console.log('BeforeInstallPrompt supported:', 
      typeof window.BeforeInstallPromptEvent !== 'undefined' || 
      ('onbeforeinstallprompt' in window));
    
    // Check for display-mode media query support
    console.log('display-mode media query supported:', 
      window.matchMedia('(display-mode: browser)').matches || 
      window.matchMedia('(display-mode: standalone)').matches);
    
    // Check installability criteria
    const installabilityCriteria = [
      { name: "Has manifest with required fields", 
        pass: !!document.querySelector('link[rel="manifest"]') },
      { name: "Served over HTTPS", 
        pass: window.location.protocol === 'https:' },
      { name: "Has registered service worker", 
        pass: 'serviceWorker' in navigator },
      { name: "Has appropriate icons", 
        pass: !!document.querySelector('link[rel="apple-touch-icon"]') }
    ];
    
    console.table(installabilityCriteria);
    console.groupEnd();
    
    // Listen for installation events
    window.addEventListener('appinstalled', (event) => {
      console.log('App was successfully installed!', event);
    });
    
    // Check for updates to service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        console.log('Service Worker ready:', registration.scope);
      }).catch(error => {
        console.error('Service Worker registration failed:', error);
      });
    }
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default PWAInstallLogger;
