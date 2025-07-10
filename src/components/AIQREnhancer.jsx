import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Download, Share2, Copy, Check, Eye, Palette, Brain, Wand2, Layout, Star } from 'lucide-react';

const AIQREnhancer = ({ qrCode, onEnhanceComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhancementType, setEnhancementType] = useState('artistic');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [lastEnhancedOptions, setLastEnhancedOptions] = useState(null);
  const canvasRef = useRef(null);

  // Available enhancement categories
  const enhancementTypes = [
    {
      id: 'artistic',
      name: 'Artistic Style',
      description: 'Transform your QR code with artistic patterns and creative designs',
      icon: Palette,
      styles: ['watercolor', 'oil_painting', 'digital_art', 'abstract', 'geometric']
    },
    {
      id: 'branded',
      name: 'Brand Enhancement',
      description: 'Brand consistency and professional styling',
      icon: Sparkles,
      styles: ['corporate', 'modern', 'vintage', 'minimalist', 'luxury']
    },
    {
      id: 'thematic',
      name: 'Thematic Design',
      description: 'Designs based on content context',
      icon: Layout,
      styles: ['tech', 'nature', 'space', 'urban', 'retro']
    }
  ];

  // Smart enhancement suggestions based on design principles
  const smartSuggestions = [
    {
      id: 'readability',
      title: 'Improve Readability',
      description: 'Enhance contrast and scanning reliability',
      impact: 'High',
      action: () => enhanceReadability()
    },
    {
      id: 'aesthetics',
      title: 'Visual Appeal',
      description: 'Apply design principles for better visual hierarchy',
      impact: 'Medium',
      action: () => enhanceAesthetics()
    },
    {
      id: 'branding',
      title: 'Brand Consistency',
      description: 'Brand-aligned color improvements',
      impact: 'High',
      action: () => enhanceBranding()
    }
  ];

  // Apply high contrast settings for maximum readability
  const enhanceReadability = () => {
    setIsProcessing(true);
    
    const enhancedOptions = {
      dotsOptions: {
        color: '#000000',
        type: 'dots'
      },
      backgroundOptions: {
        color: '#FFFFFF'
      },
      cornersSquareOptions: {
        color: '#000000',
        type: 'square'
      },
      cornersDotOptions: {
        color: '#000000',
        type: 'square'
      }
    };
    
    setLastEnhancedOptions(enhancedOptions);
    
    setTimeout(() => {
      setIsProcessing(false);
      onEnhanceComplete(enhancedOptions);
    }, 800);
  };

  // Enhance aesthetics using color theory
  const enhanceAesthetics = () => {
    setIsProcessing(true);
    
    // Generate a color palette based on color theory
    // Using complementary colors for visual appeal
    const baseHue = Math.floor(Math.random() * 360);
    const complementaryHue = (baseHue + 180) % 360;
    
    // Convert HSL to Hex for compatibility with QR code library
    const hslToHex = (h, s, l) => {
      s /= 100;
      l /= 100;
      const a = s * Math.min(l, 1 - l);
      const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    };
    
    const primaryColor = hslToHex(baseHue, 70, 45);
    const secondaryColor = hslToHex(complementaryHue, 70, 50);
    
    const enhancedOptions = {
      dotsOptions: {
        color: primaryColor,
        type: 'rounded'
      },
      backgroundOptions: {
        color: '#FFFFFF'
      },
      cornersSquareOptions: {
        color: secondaryColor,
        type: 'extra-rounded'
      },
      cornersDotOptions: {
        color: secondaryColor,
        type: 'dot'
      }
    };
    
    setLastEnhancedOptions(enhancedOptions);
    
    setTimeout(() => {
      setIsProcessing(false);
      onEnhanceComplete(enhancedOptions);
    }, 800);
  };

  // Apply brand-friendly color schemes
  const enhanceBranding = () => {
    setIsProcessing(true);
    
    // Professional brand color palettes
    const brandPalettes = [
      { 
        name: 'Tech Blue', 
        primary: '#0078D7', 
        secondary: '#106EBE',
        type: 'dots'
      },
      { 
        name: 'Corporate Red', 
        primary: '#E51E3B', 
        secondary: '#C41230',
        type: 'rounded'
      },
      { 
        name: 'Professional Green', 
        primary: '#107C10', 
        secondary: '#0E700E',
        type: 'classy-rounded'
      },
      { 
        name: 'Financial Purple', 
        primary: '#5C2D91', 
        secondary: '#4B2477',
        type: 'classy'
      },
      { 
        name: 'Creative Orange', 
        primary: '#D83B01', 
        secondary: '#CA3700',
        type: 'dots'
      }
    ];
    
    const selectedPalette = brandPalettes[Math.floor(Math.random() * brandPalettes.length)];
    
    const enhancedOptions = {
      dotsOptions: {
        color: selectedPalette.primary,
        type: selectedPalette.type
      },
      backgroundOptions: {
        color: '#FFFFFF'
      },
      cornersSquareOptions: {
        color: selectedPalette.secondary,
        type: 'square'
      },
      cornersDotOptions: {
        color: selectedPalette.secondary,
        type: 'square'
      }
    };
    
    setLastEnhancedOptions(enhancedOptions);
    
    setTimeout(() => {
      setIsProcessing(false);
      onEnhanceComplete(enhancedOptions);
    }, 800);
  };

  // Apply style based on selected theme
  const applyArtisticStyle = (style) => {
    setIsProcessing(true);
    setSelectedStyle(style);
    
    // Art-inspired color palettes and styles
    const artStyles = {
      watercolor: {
        colors: ['#91CDF2', '#EBF4FA', '#305D7A'],
        dotType: 'rounded',
        cornerType: 'dot'
      },
      oil_painting: {
        colors: ['#8A6642', '#F2DFC4', '#593D29'],
        dotType: 'classy',
        cornerType: 'square'
      },
      digital_art: {
        colors: ['#00FFFF', '#121212', '#FF00FF'],
        dotType: 'dots',
        cornerType: 'dot'
      },
      abstract: {
        colors: ['#FF5555', '#FFFFFF', '#5555FF'],
        dotType: 'rounded',
        cornerType: 'extra-rounded'
      },
      geometric: {
        colors: ['#2D2D2D', '#FFFFFF', '#2D2D2D'],
        dotType: 'square',
        cornerType: 'square'
      },
      corporate: {
        colors: ['#1A73E8', '#FFFFFF', '#174EA6'],
        dotType: 'dots',
        cornerType: 'square'
      },
      modern: {
        colors: ['#101010', '#FFFFFF', '#505050'],
        dotType: 'rounded',
        cornerType: 'dot'
      },
      vintage: {
        colors: ['#BA8C63', '#FFF8E1', '#8D6E63'],
        dotType: 'classy',
        cornerType: 'square'
      },
      minimalist: {
        colors: ['#212121', '#FFFFFF', '#212121'],
        dotType: 'square',
        cornerType: 'square'
      },
      luxury: {
        colors: ['#D4AF37', '#000000', '#D4AF37'],
        dotType: 'classy-rounded',
        cornerType: 'dot'
      },
      tech: {
        colors: ['#00B0FF', '#FFFFFF', '#0091EA'],
        dotType: 'dots',
        cornerType: 'square'
      },
      nature: {
        colors: ['#4CAF50', '#F1F8E9', '#2E7D32'],
        dotType: 'rounded',
        cornerType: 'dot'
      },
      space: {
        colors: ['#3F51B5', '#000000', '#7986CB'],
        dotType: 'dots',
        cornerType: 'dot'
      },
      urban: {
        colors: ['#607D8B', '#ECEFF1', '#455A64'],
        dotType: 'rounded',
        cornerType: 'square'
      },
      retro: {
        colors: ['#F44336', '#FFEBEE', '#C62828'],
        dotType: 'classy',
        cornerType: 'square'
      }
    };
    
    const styleConfig = artStyles[style] || artStyles.modern;
    
    const enhancedOptions = {
      dotsOptions: {
        color: styleConfig.colors[0],
        type: styleConfig.dotType
      },
      backgroundOptions: {
        color: styleConfig.colors[1]
      },
      cornersSquareOptions: {
        color: styleConfig.colors[2],
        type: styleConfig.cornerType
      },
      cornersDotOptions: {
        color: styleConfig.colors[2],
        type: styleConfig.cornerType
      }
    };
    
    setLastEnhancedOptions(enhancedOptions);
    
    setTimeout(() => {
      setIsProcessing(false);
      onEnhanceComplete(enhancedOptions);
    }, 1200);
  };

  // Reset to last applied style
  const reapplyLastEnhancement = () => {
    if (lastEnhancedOptions) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        onEnhanceComplete(lastEnhancedOptions);
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card glass-morphism">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              QR Style Enhancer
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enhance your QR code with color theory and design principles
            </p>
          </div>
        </div>

        {/* Quick Enhancement Suggestions */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
            <Wand2 className="w-4 h-4 mr-2" />
            Quick Enhancements
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {smartSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                onClick={suggestion.action}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 transition-all cursor-pointer group hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600">
                    {suggestion.title}
                  </h5>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    suggestion.impact === 'High' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}>
                    {suggestion.impact}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {suggestion.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhancement Types */}
      <div className="card">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
          Enhancement Categories
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {enhancementTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <div
                key={type.id}
                onClick={() => setEnhancementType(type.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  enhancementType === type.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
              >
                <IconComponent className="w-8 h-8 text-purple-600 mb-3" />
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                  {type.name}
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {type.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Style Selection */}
      {enhancementType && (
        <div className="card">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Star className="w-4 h-4 mr-2 text-yellow-500" /> 
            Select Style
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {enhancementTypes.find(t => t.id === enhancementType)?.styles.map((style) => (
              <button
                key={style}
                onClick={() => applyArtisticStyle(style)}
                disabled={isProcessing}
                className={`p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 transition-all ${
                  selectedStyle === style ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className={`w-full h-16 rounded mb-2 ${
                  style === 'watercolor' ? 'bg-gradient-to-br from-blue-300 to-blue-100' :
                  style === 'oil_painting' ? 'bg-gradient-to-br from-amber-700 to-amber-200' :
                  style === 'digital_art' ? 'bg-gradient-to-br from-cyan-400 to-fuchsia-400' :
                  style === 'abstract' ? 'bg-gradient-to-br from-red-400 to-blue-400' :
                  style === 'geometric' ? 'bg-gradient-to-br from-gray-900 to-gray-600' :
                  style === 'corporate' ? 'bg-gradient-to-br from-blue-600 to-blue-400' :
                  style === 'modern' ? 'bg-gradient-to-br from-gray-900 to-gray-600' :
                  style === 'vintage' ? 'bg-gradient-to-br from-amber-600 to-amber-200' :
                  style === 'minimalist' ? 'bg-gradient-to-br from-gray-800 to-gray-400' :
                  style === 'luxury' ? 'bg-gradient-to-br from-yellow-600 to-yellow-300' :
                  style === 'tech' ? 'bg-gradient-to-br from-blue-500 to-blue-300' :
                  style === 'nature' ? 'bg-gradient-to-br from-green-500 to-green-200' :
                  style === 'space' ? 'bg-gradient-to-br from-indigo-600 to-indigo-300' :
                  style === 'urban' ? 'bg-gradient-to-br from-gray-500 to-gray-300' :
                  style === 'retro' ? 'bg-gradient-to-br from-red-500 to-red-200' :
                  'bg-gradient-to-br from-purple-400 to-pink-400'
                }`}></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {style.replace('_', ' ')}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="card text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              Enhancing your QR code...
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Applying design patterns and optimizing visual elements...
          </p>
        </div>
      )}

      {/* Last Applied Enhancement */}
      {lastEnhancedOptions && !isProcessing && (
        <div className="card">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Last Enhancement
            </h4>
            <button
              onClick={reapplyLastEnhancement}
              className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              Reapply
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 flex items-center justify-center">
            <div 
              className="w-16 h-16 rounded"
              style={{
                backgroundColor: lastEnhancedOptions.backgroundOptions.color,
                position: 'relative'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 grid grid-cols-3 grid-rows-3 gap-0.5">
                  {Array(9).fill(0).map((_, i) => (
                    <div 
                      key={i} 
                      className="rounded-sm"
                      style={{
                        backgroundColor: i % 2 === 0 ? lastEnhancedOptions.dotsOptions.color : 'transparent',
                        borderRadius: lastEnhancedOptions.dotsOptions.type === 'rounded' ? '40%' : 
                                      lastEnhancedOptions.dotsOptions.type === 'dots' ? '50%' : '0%'
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="ml-4 text-sm text-gray-600 dark:text-gray-400">
              <div>Dot color: <span style={{color: lastEnhancedOptions.dotsOptions.color}}>{lastEnhancedOptions.dotsOptions.color}</span></div>
              <div>Dot style: {lastEnhancedOptions.dotsOptions.type}</div>
              <div>Background: <span style={{color: lastEnhancedOptions.backgroundOptions.color}}>{lastEnhancedOptions.backgroundOptions.color}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIQREnhancer;
