import React, { useState, useEffect } from 'react';
import { Palette, Sparkles, Copy, Check, RotateCcw, Heart } from 'lucide-react';
import { useDarkMode } from '../App';

const EnhancedColorPicker = ({ 
  color, 
  onChange, 
  label = 'Color',
  showGradient = true,
  showPresets = true,
  presetColors = [],
  showHistory = true
}) => {
  const { darkMode } = useDarkMode();
  const [selectedColor, setSelectedColor] = useState(color);
  const [showGradientPicker, setShowGradientPicker] = useState(false);
  const [gradientStart, setGradientStart] = useState('#3b82f6');
  const [gradientEnd, setGradientEnd] = useState('#8b5cf6');
  const [gradientAngle, setGradientAngle] = useState(45);
  const [colorHistory, setColorHistory] = useState(() => {
    const saved = localStorage.getItem('color-history');
    return saved ? JSON.parse(saved) : [];
  });
  const [copied, setCopied] = useState(false);
  const [favoriteColors, setFavoriteColors] = useState(() => {
    const saved = localStorage.getItem('favorite-colors');
    return saved ? JSON.parse(saved) : [];
  });

  // Default color presets if none provided
  const defaultPresets = [
    { name: 'Black', color: '#000000' },
    { name: 'Navy', color: '#0f172a' },
    { name: 'Blue', color: '#3b82f6' },
    { name: 'Teal', color: '#0d9488' },
    { name: 'Green', color: '#22c55e' },
    { name: 'Yellow', color: '#eab308' },
    { name: 'Orange', color: '#f59e0b' },
    { name: 'Red', color: '#ef4444' },
    { name: 'Pink', color: '#ec4899' },
    { name: 'Purple', color: '#8b5cf6' },
  ];

  const colorPresets = presetColors.length > 0 ? presetColors : defaultPresets;

  // Gradient presets
  const gradientPresets = [
    { name: 'Ocean', start: '#0ea5e9', end: '#3b82f6', angle: 45 },
    { name: 'Sunset', start: '#f59e0b', end: '#ef4444', angle: 45 },
    { name: 'Forest', start: '#10b981', end: '#059669', angle: 45 },
    { name: 'Purple', start: '#8b5cf6', end: '#a855f7', angle: 45 },
    { name: 'Fire', start: '#dc2626', end: '#f59e0b', angle: 45 },
    { name: 'Night', start: '#1f2937', end: '#374151', angle: 45 },
  ];

  useEffect(() => {
    setSelectedColor(color);
  }, [color]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    localStorage.setItem('color-history', JSON.stringify(colorHistory));
  }, [colorHistory]);

  useEffect(() => {
    localStorage.setItem('favorite-colors', JSON.stringify(favoriteColors));
  }, [favoriteColors]);

  const handleColorChange = (newColor) => {
    setSelectedColor(newColor);
    onChange(newColor);
    
    // Add to history if not already present
    if (!colorHistory.includes(newColor)) {
      const updatedHistory = [newColor, ...colorHistory.slice(0, 11)];
      setColorHistory(updatedHistory);
    }
  };

  const handleGradientChange = (start, end, angle) => {
    setGradientStart(start);
    setGradientEnd(end);
    setGradientAngle(angle);
    
    // Create CSS gradient
    const gradient = `linear-gradient(${angle}deg, ${start}, ${end})`;
    onChange(gradient);
  };

  const applyGradientPreset = (preset) => {
    handleGradientChange(preset.start, preset.end, preset.angle);
  };

  const copyColorToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(selectedColor);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleFavorite = (color) => {
    if (favoriteColors.includes(color)) {
      setFavoriteColors(favoriteColors.filter(c => c !== color));
    } else {
      setFavoriteColors([...favoriteColors, color]);
    }
  };

  const resetToDefault = () => {
    handleColorChange('#000000');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <div className="flex items-center space-x-2">
          {showGradient && (
            <button
              onClick={() => setShowGradientPicker(!showGradientPicker)}
              className={`text-xs px-2 py-1 rounded-md transition-colors ${
                showGradientPicker 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {showGradientPicker ? 'Solid Color' : 'Gradient'}
            </button>
          )}
          <button
            onClick={resetToDefault}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Reset to default"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!showGradientPicker ? (
        <div className="space-y-3">
          {/* Color input */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="h-10 w-16 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
              />
              <div className={`absolute inset-0 pointer-events-none rounded border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={selectedColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 dark:bg-gray-700 dark:text-gray-300"
                placeholder="#000000"
              />
              <button
                onClick={copyColorToClipboard}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Copy color code"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Color presets */}
          {showPresets && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Presets</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  <Sparkles className="h-3 w-3 inline" /> Click to apply
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {colorPresets.map((preset) => (
                  <div
                    key={preset.color}
                    className="relative group"
                  >
                    <div 
                      onClick={() => handleColorChange(preset.color)}
                      className="w-full h-8 rounded-md border border-gray-200 dark:border-gray-700 transition-transform group-hover:scale-110 group-hover:shadow-lg cursor-pointer"
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                    ></div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(preset.color);
                      }}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart 
                        className={`h-3 w-3 ${
                          favoriteColors.includes(preset.color) 
                            ? 'text-red-500 fill-red-500' 
                            : 'text-white'
                        }`} 
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Color history */}
          {showHistory && colorHistory.length > 0 && (
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Recent Colors</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {colorHistory.slice(0, 8).map((historyColor, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorChange(historyColor)}
                    className="w-6 h-6 rounded-md border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform"
                    style={{ backgroundColor: historyColor }}
                    title={historyColor}
                  ></button>
                ))}
              </div>
            </div>
          )}

          {/* Favorite colors */}
          {favoriteColors.length > 0 && (
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Favorites</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {favoriteColors.map((favColor, index) => (
                  <div
                    key={index}
                    className="relative group w-6 h-6 rounded-md border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform"
                    style={{ backgroundColor: favColor }}
                  >
                    <div 
                      onClick={() => handleColorChange(favColor)}
                      className="w-full h-full cursor-pointer"
                      title={favColor}
                    ></div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(favColor);
                      }}
                      className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/70 dark:bg-black/70 rounded-full p-0.5"
                    >
                      <Heart className="h-2 w-2 text-red-500 fill-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Gradient picker */}
          <div className="space-y-3">
            <div className="w-full h-10 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div
                className="w-full h-full"
                style={{ background: `linear-gradient(${gradientAngle}deg, ${gradientStart}, ${gradientEnd})` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Start Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={gradientStart}
                    onChange={(e) => handleGradientChange(e.target.value, gradientEnd, gradientAngle)}
                    className="h-8 w-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={gradientStart}
                    onChange={(e) => handleGradientChange(e.target.value, gradientEnd, gradientAngle)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  End Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={gradientEnd}
                    onChange={(e) => handleGradientChange(gradientStart, e.target.value, gradientAngle)}
                    className="h-8 w-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={gradientEnd}
                    onChange={(e) => handleGradientChange(gradientStart, e.target.value, gradientAngle)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
                    placeholder="#8b5cf6"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Angle: {gradientAngle}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={gradientAngle}
                onChange={(e) => handleGradientChange(gradientStart, gradientEnd, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Gradient presets */}
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Gradient Presets</span>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {gradientPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyGradientPreset(preset)}
                  className="group p-1 rounded-md border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all hover:shadow-md"
                  title={preset.name}
                >
                  <div 
                    className="w-full h-8 rounded-md"
                    style={{ background: `linear-gradient(${preset.angle}deg, ${preset.start}, ${preset.end})` }}
                  ></div>
                  <span className="block text-center text-xs text-gray-600 dark:text-gray-400 mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedColorPicker;
