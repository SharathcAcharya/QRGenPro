import React, { createContext, useState, useContext, useEffect } from 'react';
import QRGenerator from './components/QRGenerator';
import DarkModeToggle from './components/DarkModeToggle';
import HelpModal from './components/HelpModal';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import SettingsModal from './components/SettingsModal';
import OnboardingTutorial from './components/OnboardingTutorial';
import InstallGuideModal from './components/InstallGuideModal';
import InstallButton from './components/InstallButton';
import { AnimatedBackground, TypewriterText, AnimatedCounter } from './components/AnimationComponents';
import { NotificationProvider } from './components/NotificationSystem';
import { QrCode, Settings, Sparkles, Download } from 'lucide-react';

// Dark Mode Context
const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [totalQRCodes, setTotalQRCodes] = useState(0);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Count total QR codes generated
    const history = JSON.parse(localStorage.getItem('qr-history') || '[]');
    setTotalQRCodes(history.length);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <NotificationProvider>
      <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
          {/* Animated Background */}
          <AnimatedBackground />
          
          {/* Header */}
          <header className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-glow animate-pulse-glow">
                    <QrCode className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      QRGenPro
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <TypewriterText text="Advanced QR Code Generator" speed={50} />
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {totalQRCodes > 0 && (
                    <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        <AnimatedCounter end={totalQRCodes} /> QR codes created
                      </span>
                    </div>
                  )}

                  {/* Install Button - Desktop */}
                  <InstallButton
                    className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                    showText={true}
                    onInstallGuide={() => setShowInstallGuide(true)}
                  />

                  {/* Install Button - Mobile */}
                  <InstallButton
                    className="md:hidden p-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                    showText={false}
                    onInstallGuide={() => setShowInstallGuide(true)}
                  />
                  
                  <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105"
                    title="Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  
                  <DarkModeToggle />
                </div>
              </div>
            </div>
          </header>

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
              <QRGenerator onQRGenerated={() => setTotalQRCodes(prev => prev + 1)} />
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
          <HelpModal />
          <PWAInstallPrompt />
          <OnboardingTutorial />
          <InstallGuideModal 
            isOpen={showInstallGuide}
            onClose={() => setShowInstallGuide(false)}
          />
          <SettingsModal 
            isOpen={showSettings} 
            onClose={() => setShowSettings(false)} 
          />
        </div>
      </DarkModeContext.Provider>
    </NotificationProvider>
  );
}

export default App;
