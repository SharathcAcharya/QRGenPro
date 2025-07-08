import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, X, QrCode, Palette, Download, Sparkles } from 'lucide-react';

const OnboardingTutorial = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to QRloop!",
      description: "Create beautiful, customizable QR codes in seconds",
      icon: QrCode,
      content: (
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            QRloop is the most advanced QR code generator with professional styling,
            custom logos, and beautiful animations.
          </p>
        </div>
      )
    },
    {
      title: "Enter Your URL",
      description: "Start by entering any URL you want to encode",
      icon: ArrowRight,
      content: (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="https://example.com"
              className="w-full px-4 py-3 border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              disabled
            />
            <div className="absolute inset-0 bg-blue-100/50 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-medium">Enter your URL here</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You can also use our quick templates for common URLs like LinkedIn, GitHub, or business sites.
          </p>
        </div>
      )
    },
    {
      title: "Customize Your QR Code",
      description: "Make it unique with colors, styles, and logos",
      icon: Palette,
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Colors</h4>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-black rounded border-2 border-blue-500"></div>
              <div className="w-8 h-8 bg-blue-600 rounded"></div>
              <div className="w-8 h-8 bg-purple-600 rounded"></div>
              <div className="w-8 h-8 bg-green-600 rounded"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Styles</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-xs">
                Square
              </div>
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-xs">
                Rounded
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Download & Share",
      description: "Export in PNG or SVG format",
      icon: Download,
      content: (
        <div className="text-center space-y-4">
          <div className="flex justify-center space-x-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <Download className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-blue-600">PNG</span>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <Download className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-purple-600">SVG</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Download your QR codes in high quality for printing or web use.
            Your history is automatically saved for future reference.
          </p>
        </div>
      )
    },
    {
      title: "You're All Set!",
      description: "Start creating amazing QR codes",
      icon: Sparkles,
      content: (
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-gentle">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You're ready to create professional QR codes! 
            Check out the settings for more customization options.
          </p>
          <div className="flex justify-center space-x-2">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm">
              Pro Tip: Use dark mode for a sleek experience
            </span>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('onboarding-completed', 'true');
    onClose();
  };

  if (!isOpen) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <step.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {step.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {step.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step.content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-blue-600' 
                    : index < currentStep 
                      ? 'bg-blue-300' 
                      : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105"
              >
                <span>Get Started</span>
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;
