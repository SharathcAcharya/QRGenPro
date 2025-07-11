import React, { useState, useEffect, Suspense, lazy } from 'react';
import DarkModeToggle from './components/DarkModeToggle';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import PWAInstallLogger from './components/PWAInstallLogger';
import InstallButton from './components/InstallButton';
import FloatingActionButton from './components/FloatingActionButton';
import { NotificationProvider } from './context/NotificationProvider';
import { QrCode, Settings, Sparkles, Download } from 'lucide-react';
import SEOHead from './components/SEOHead';
import { DarkModeProvider } from './context/DarkModeContext';

// Lazy loaded components
const QRGenerator = lazy(() => import('./components/QRGenerator'));
const HelpModal = lazy(() => import('./components/HelpModal'));
const SettingsModal = lazy(() => import('./components/SettingsModal'));
const OnboardingTutorial = lazy(() => import('./components/OnboardingTutorial'));
const InstallGuideModal = lazy(() => import('./components/InstallGuideModal'));
const FeatureTour = lazy(() => import('./components/FeatureTour'));
const ParticleBackground = lazy(() => import('./components/ParticleBackground'));
const ModernHeader = lazy(() => import('./components/ModernHeader'));
const VoiceCommandSystem = lazy(() => import('./components/VoiceCommandSystem'));

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [showFeatureTour, setShowFeatureTour] = useState(false);
  const [currentQRTab, setCurrentQRTab] = useState('generator');
  const [totalQRCodes, setTotalQRCodes] = useState(0);

  useEffect(() => {
    // Count total QR codes generated
    const history = JSON.parse(localStorage.getItem('qr-history') || '[]');
    setTotalQRCodes(history.length);
    
    // Check if user should see feature tour
    const hasSeenTour = localStorage.getItem('hasSeenFeatureTour');
    if (!hasSeenTour) {
      setTimeout(() => setShowFeatureTour(true), 2000);
    }
  }, []);

  const handleFeatureTourClose = () => {
    setShowFeatureTour(false);
    localStorage.setItem('hasSeenFeatureTour', 'true');
  };

  const handleFloatingActionSelect = (actionId) => {
    setCurrentQRTab(actionId);
  };

  const handleVoiceCommand = (command) => {
    switch (command) {
      case 'generate':
        setCurrentQRTab('generator');
        break;
      case 'templates':
        setCurrentQRTab('templates');
        break;
      case 'scanner':
        setCurrentQRTab('scanner');
        break;
      case 'history':
        setCurrentQRTab('history');
        break;
      case 'customize':
        setCurrentQRTab('generator');
        // Scroll to customizer section
        setTimeout(() => {
          document.querySelector('.qr-customizer-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        break;
      case 'toggle_dark_mode':
        // We can't call useDarkMode() here, so we'll need a different approach
        document.documentElement.classList.toggle('dark');
        break;
      case 'download_png':
        // Try to find and click the download button
        const downloadButton = document.querySelector('[data-action="download-png"]');
        if (downloadButton) {
          downloadButton.click();
        } else {
          console.log('Download button not found');
        }
        break;
      case 'download_svg':
        // Try to find and click the SVG download button
        const svgButton = document.querySelector('[data-action="download-svg"]');
        if (svgButton) {
          svgButton.click();
        } else {
          console.log('SVG download button not found');
        }
        break;
      case 'add_logo':
        // Try to find and click the add logo button
        const logoButton = document.querySelector('[data-action="add-logo"]');
        if (logoButton) {
          logoButton.click();
        } else {
          console.log('Add logo button not found');
        }
        break;
      case 'change_color':
        setCurrentQRTab('generator');
        // Scroll to color picker section
        setTimeout(() => {
          document.querySelector('.color-picker-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        break;
      case 'change_style':
        setCurrentQRTab('generator');
        // Scroll to style section
        setTimeout(() => {
          document.querySelector('.qr-style-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        break;
      default:
        console.log('Command not handled in App:', command);
    }
  };

  // Fallback loading component
  const LoadingFallback = () => (
    <div className="flex justify-center items-center p-4">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gray-300 dark:bg-gray-700 h-12 w-12"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DarkModeProvider>
      <NotificationProvider>
        {/* Add PWA install logger for debugging */}
        <PWAInstallLogger />
        
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
          {/* SEO Head Component */}
          <SEOHead 
            title="QRloop - Advanced QR Code Generator with 3D Effects & Analytics"
            description="Create beautiful, customizable QR codes with logo embedding, 3D visualization, analytics, and advanced styling options. Generate and track QR codes for websites, WiFi, contacts, and more."
            structuredData={{
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "QRloop",
              "applicationCategory": "UtilitiesApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Create beautiful, customizable QR codes with logo embedding, styling options, and 3D effects",
              "featureList": [
                "Logo embedding in QR codes",
                "3D QR code visualization",
                "Custom colors and styles",
                "Analytics and tracking",
                "Offline usage with PWA"
              ]
            }}
            twitterImage="/images/qrloop-twitter-card.png"
            ogImage="/images/qrloop-social-card.png"
          />

          {/* Animated Background */}
          <Suspense fallback={null}>
            <ParticleBackground />
          </Suspense>
          
          {/* Modern Header */}
          <Suspense fallback={<LoadingFallback />}>
            <ModernHeader 
              onFeatureTour={() => setShowFeatureTour(true)}
              onSettingsOpen={() => setShowSettings(true)}
              onInstallGuide={() => setShowInstallGuide(true)}
              totalQRCodes={totalQRCodes}
              onTabChange={setCurrentQRTab}
              notifications={[]} // Would be populated from a real notification system
            />
          </Suspense>

          {/* Main Content */}
          <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-slide-up">
                Create <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Beautiful</span> QR Codes
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Generate stunning, customizable QR codes with logos, custom colors, and professional styling.
                Perfect for business cards, marketing materials, and personal use.
              </p>

              {/* Voice Command System */}
              <div className="mt-4 flex justify-center">
                <Suspense fallback={null}>
                  <VoiceCommandSystem onCommand={handleVoiceCommand} />
                </Suspense>
              </div>

              {/* Mobile Install Prompt */}
              <div className="mt-6 md:hidden">
                <InstallButton
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg animate-bounce"
                  showText={true}
                  onInstallGuide={() => setShowInstallGuide(true)}
                />
              </div>
            </div>
            
            <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <Suspense fallback={
                <div className="p-8 rounded-lg bg-white dark:bg-gray-800 shadow-lg text-center">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-32 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                    <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading QR Generator...</p>
                </div>
              }>
                <QRGenerator 
                  onQRGenerated={() => setTotalQRCodes(prev => prev + 1)}
                  activeTab={currentQRTab}
                  onTabChange={setCurrentQRTab}
                />
              </Suspense>
            </div>
          </main>

          {/* Footer */}
          <footer className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Built with React, Tailwind CSS, and ❤️ • 
                  <span className="ml-2 inline-flex items-center space-x-1">
                    <span>Made for creators</span>
                    <Sparkles className="w-4 h-4" />
                  </span>
                </p>
              </div>
            </div>
          </footer>

          {/* Modals and Components */}
          <Suspense fallback={null}>
            <HelpModal />
          </Suspense>
          <PWAInstallPrompt />
          <Suspense fallback={null}>
            <OnboardingTutorial />
          </Suspense>
          <Suspense fallback={null}>
            <InstallGuideModal 
              isOpen={showInstallGuide}
              onClose={() => setShowInstallGuide(false)}
            />
          </Suspense>
          <Suspense fallback={null}>
            <SettingsModal 
              isOpen={showSettings} 
              onClose={() => setShowSettings(false)} 
            />
          </Suspense>
          <Suspense fallback={null}>
            <FeatureTour 
              isOpen={showFeatureTour}
              onClose={handleFeatureTourClose}
              onTabChange={setCurrentQRTab}
            />
          </Suspense>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton onActionSelect={handleFloatingActionSelect} />
      </NotificationProvider>
    </DarkModeProvider>
  );
}

export default App;
