import React, { useState, useEffect } from 'react';
import DarkModeToggle from './DarkModeToggle';
import InstallButton from './InstallButton';
import { QrCode, Menu, X, Bell, User, Search, Settings, Sparkles } from 'lucide-react';
import VoiceCommandSystem from './VoiceCommandSystem';

const ModernHeader = ({ 
  onFeatureTour, 
  onSettingsOpen, 
  onInstallGuide, 
  _totalQRCodes, // Prefixed with _ to indicate intentionally unused
  onTabChange,
  notifications = [] 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleVoiceCommand = (command) => {
    switch (command) {
      case 'generate':
        onTabChange('generator');
        break;
      case 'customize':
        onTabChange('generator');
        break;
      case 'templates':
        onTabChange('templates');
        break;
      case 'scanner':
        onTabChange('scanner');
        break;
      case 'toggle_dark_mode':
        // This will be handled by the DarkModeToggle component
        document.querySelector('[aria-label*="dark mode" i]').click();
        break;
      default:
        console.log('Command not implemented:', command);
    }
  };

  return (
    <header 
      className={`sticky top-0 z-30 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-md' 
          : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm'
      } border-b border-gray-200/50 dark:border-gray-700/50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-glow animate-pulse-glow">
              <QrCode className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                QRloop
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Advanced QR Generator
              </p>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onTabChange('generator')}
              className="px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Create
            </button>
            <button
              onClick={() => onTabChange('templates')}
              className="px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Templates
            </button>
            <button
              onClick={() => onTabChange('batch')}
              className="px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Batch
            </button>
            <button
              onClick={() => onTabChange('scanner')}
              className="px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Scanner
            </button>
            <button
              onClick={() => onTabChange('analytics')}
              className="px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Analytics
            </button>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Search Input (conditional) */}
            {isSearchOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 animate-fade-in">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl p-4 animate-scale-in">
                  <div className="flex items-center">
                    <Search className="h-5 w-5 text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Search QR codes, templates, history..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white"
                      autoFocus
                    />
                    <button
                      onClick={() => setIsSearchOpen(false)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Search results would go here */}
                  <div className="mt-4 max-h-96 overflow-y-auto">
                    {searchQuery ? (
                      <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                        No results found for "{searchQuery}"
                      </div>
                    ) : (
                      <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                        Type to search...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Voice Commands */}
            <div className="hidden sm:block">
              <VoiceCommandSystem onCommand={handleVoiceCommand} />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-10 animate-scale-in">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
                    <button className="text-xs text-blue-600 dark:text-blue-400">Mark all as read</button>
                  </div>
                  
                  {notifications.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto">
                      {/* Notification items would go here */}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                      No new notifications
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Feature Tour */}
            <button
              onClick={onFeatureTour}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Feature Tour"
            >
              <Sparkles className="h-5 w-5" />
            </button>

            {/* Settings */}
            <button
              onClick={onSettingsOpen}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Install Button */}
            <InstallButton
              className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              showText={true}
              onInstallGuide={onInstallGuide}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            <button
              onClick={() => {
                onTabChange('generator');
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                onTabChange('templates');
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Templates
            </button>
            <button
              onClick={() => {
                onTabChange('batch');
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Batch
            </button>
            <button
              onClick={() => {
                onTabChange('scanner');
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Scanner
            </button>
            <button
              onClick={() => {
                onTabChange('analytics');
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Analytics
            </button>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <InstallButton
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                  showText={true}
                  onInstallGuide={onInstallGuide}
                />
                
                <div className="flex items-center space-x-2">
                  <VoiceCommandSystem onCommand={handleVoiceCommand} />
                  <DarkModeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default ModernHeader;
