import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Target, Check, Star } from 'lucide-react';

const FeatureTour = ({ isOpen, onClose, onTabChange }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const tourSteps = [
    {
      id: 'welcome',
      title: 'Welcome to QRloop 2.0!',
      description: 'Discover the new advanced features that make QR code creation more powerful and engaging than ever.',
      target: null,
      action: null,
      highlight: '🚀 New & Improved',
      features: [
        'AI-powered QR enhancement',
        '3D visualizations',
        'Real-time collaboration',
        'Advanced analytics',
        'Social sharing integration'
      ]
    },
    {
      id: '3d-preview',
      title: '3D QR Preview',
      description: 'Experience your QR codes in stunning 3D with interactive animations, effects, and customizable viewing modes.',
      target: '3d-preview',
      action: () => onTabChange('3d-preview'),
      highlight: '✨ Stunning Visuals',
      features: [
        'Interactive 3D rotation',
        'Multiple animation modes',
        'Visual effects (hologram, neon, glass)',
        'Customizable perspectives',
        'Export 3D views'
      ]
    },
    {
      id: 'ai-enhance',
      title: 'AI Enhancement',
      description: 'Let AI transform your QR codes with artistic styles, brand consistency, and smart suggestions for better performance.',
      target: 'ai-enhance',
      action: () => onTabChange('ai-enhance'),
      highlight: '🤖 AI-Powered',
      features: [
        'Artistic style transformations',
        'Brand-aware enhancements',
        'Smart readability suggestions',
        'Context-aware designs',
        'Performance optimization'
      ]
    },
    {
      id: 'collaborate',
      title: 'Real-time Collaboration',
      description: 'Work together with your team in real-time. Share, edit, and discuss QR codes with live updates and team chat.',
      target: 'collaborate',
      action: () => onTabChange('collaborate'),
      highlight: '👥 Team Power',
      features: [
        'Live collaborative editing',
        'Team chat integration',
        'Permission management',
        'Activity tracking',
        'Instant sharing'
      ]
    },
    {
      id: 'library',
      title: 'Smart Library Manager',
      description: 'Organize your QR codes with folders, tags, and powerful search. Never lose track of your creations again.',
      target: 'library',
      action: () => onTabChange('library'),
      highlight: '📁 Organized',
      features: [
        'Folder organization',
        'Tag-based filtering',
        'Advanced search',
        'Favorites system',
        'Bulk operations'
      ]
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description: 'Get deep insights into your QR code performance with real-time analytics, geographic data, and usage trends.',
      target: 'analytics',
      action: () => onTabChange('analytics'),
      highlight: '📊 Data-Driven',
      features: [
        'Real-time scan tracking',
        'Geographic distribution',
        'Device breakdown',
        'Performance metrics',
        'Trend analysis'
      ]
    },
    {
      id: 'share',
      title: 'Social Sharing',
      description: 'Share your QR codes across all major social platforms with customizable messages and tracking.',
      target: 'share',
      action: () => onTabChange('share'),
      highlight: '🔗 Connected',
      features: [
        'Multi-platform sharing',
        'Custom messages',
        'Shareable links',
        'Share analytics',
        'Web Share API support'
      ]
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'Start creating amazing QR codes with these powerful new features. Explore, experiment, and create something extraordinary!',
      target: null,
      action: null,
      highlight: '🎉 Ready to Go',
      features: [
        'Modern responsive design',
        'Dark mode support',
        'PWA capabilities',
        'Offline functionality',
        'Regular updates'
      ]
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNext = () => {
    const step = tourSteps[currentStep];
    if (step.action) {
      step.action();
    }
    
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      setCurrentStep(0);
    }, 300);
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isOpen) return null;

  const currentStepData = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      
      {/* Tour Modal */}
      <div className={`absolute inset-4 md:inset-8 lg:inset-16 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium opacity-90">Step {currentStep + 1} of {tourSteps.length}</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{currentStepData.highlight}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-2">{currentStepData.title}</h2>
          <p className="text-lg opacity-90">{currentStepData.description}</p>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Features List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Key Features
              </h3>
              <div className="space-y-3">
                {currentStepData.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg animate-slide-in-left"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              
              {currentStep === 0 && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900 dark:text-blue-100">What's New</span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    This version includes major UI/UX improvements, new collaboration features, 
                    and AI-powered enhancements that make QR code creation more intuitive and powerful.
                  </p>
                </div>
              )}
              
              {currentStep === tourSteps.length - 1 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900 dark:text-green-100">Pro Tip</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Install QRloop as a PWA for the best experience! Look for the install button in your browser 
                    or check the settings menu.
                  </p>
                </div>
              )}
            </div>

            {/* Visual Preview */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Animated Feature Preview */}
                <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 flex items-center justify-center relative overflow-hidden">
                  {/* Background Animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 animate-gradient-shift" />
                  
                  {/* Feature Icon */}
                  <div className="relative z-10 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 animate-float shadow-lg">
                      {currentStep === 0 && <Sparkles className="w-12 h-12 text-white" />}
                      {currentStep === 1 && <Target className="w-12 h-12 text-white" />}
                      {currentStep === 2 && <Sparkles className="w-12 h-12 text-white" />}
                      {currentStep === 3 && <Target className="w-12 h-12 text-white" />}
                      {currentStep === 4 && <Sparkles className="w-12 h-12 text-white" />}
                      {currentStep === 5 && <Target className="w-12 h-12 text-white" />}
                      {currentStep === 6 && <Sparkles className="w-12 h-12 text-white" />}
                      {currentStep === 7 && <Star className="w-12 h-12 text-white" />}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="w-32 h-3 bg-white/50 rounded-full animate-pulse" />
                      <div className="w-24 h-3 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                      <div className="w-28 h-3 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full animate-bounce-gentle" />
                  <div className="absolute bottom-8 left-8 w-6 h-6 bg-white/15 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }} />
                  <div className="absolute top-1/2 left-4 w-4 h-4 bg-white/25 rounded-full animate-bounce-gentle" style={{ animationDelay: '2s' }} />
                </div>
                
                {/* Step Indicator */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-600">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {currentStepData.highlight}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium transition-colors"
            >
              Skip Tour
            </button>
            
            <div className="flex items-center space-x-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <span>
                  {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                </span>
                {currentStep < tourSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureTour;
