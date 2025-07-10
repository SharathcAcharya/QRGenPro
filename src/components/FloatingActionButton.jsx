import React, { useState, useRef, useEffect } from 'react';
import { Plus, Sparkles, Camera, Download, Share2, FolderOpen, Users, Zap, X } from 'lucide-react';

const FloatingActionButton = ({ onActionSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const fabRef = useRef(null);
  const lastScrollY = useRef(0);

  const actions = [
    {
      id: 'ai-enhance',
      label: 'AI Enhance',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      description: 'AI-powered QR enhancement'
    },
    {
      id: 'scanner',
      label: 'Scan QR',
      icon: Camera,
      color: 'from-green-500 to-emerald-500',
      description: 'Scan and validate QR codes'
    },
    {
      id: 'library',
      label: 'Library',
      icon: FolderOpen,
      color: 'from-blue-500 to-cyan-500',
      description: 'Manage your QR codes'
    },
    {
      id: 'collaborate',
      label: 'Collaborate',
      icon: Users,
      color: 'from-orange-500 to-red-500',
      description: 'Real-time collaboration'
    },
    {
      id: 'share',
      label: 'Share',
      icon: Share2,
      color: 'from-indigo-500 to-blue-500',
      description: 'Social media sharing'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
        setIsOpen(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fabRef.current && !fabRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMainButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleActionClick = (actionId) => {
    onActionSelect(actionId);
    setIsOpen(false);
  };

  return (
    <div 
      ref={fabRef}
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}
    >
      {/* Action Items */}
      <div className="relative">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <div
              key={action.id}
              className={`absolute bottom-16 right-0 transition-all duration-300 ${
                isOpen 
                  ? 'translate-y-0 opacity-100 scale-100' 
                  : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
              }`}
              style={{ 
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                transform: isOpen 
                  ? `translateY(-${(index + 1) * 60}px) scale(1)` 
                  : 'translateY(16px) scale(0.95)'
              }}
            >
              <div className="flex items-center space-x-3 mb-3">
                {/* Label */}
                <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur-sm opacity-0 animate-fade-in whitespace-nowrap">
                  {action.label}
                  <div className="text-xs opacity-70 mt-1">{action.description}</div>
                </div>
                
                {/* Action Button */}
                <button
                  onClick={() => handleActionClick(action.id)}
                  className={`w-12 h-12 bg-gradient-to-r ${action.color} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center group`}
                  title={action.label}
                >
                  <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main FAB Button */}
      <button
        onClick={handleMainButtonClick}
        className={`w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center relative overflow-hidden group ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
      >
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Icon */}
        <div className="relative z-10">
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-200" />
          ) : (
            <Plus className="w-6 h-6 transition-transform duration-200" />
          )}
        </div>
        
        {/* Ripple Effect */}
        <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-200" />
      </button>

      {/* Quick Actions Indicator */}
      {!isOpen && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
          {actions.length}
        </div>
      )}

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FloatingActionButton;
