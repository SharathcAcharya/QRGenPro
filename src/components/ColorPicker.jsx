import React, { useState, useEffect, useRef } from 'react';

const ColorPicker = ({ color, onChange, label, showGradient = false, gradientStart, gradientEnd, onGradientChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);
  const [presetColors, setPresetColors] = useState([
    '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', 
    '#10b981', '#6366f1', '#000000', '#ffffff', '#64748b'
  ]);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setCurrentColor(color);
  }, [color]);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);
    onChange(newColor);
  };

  const handlePresetClick = (presetColor) => {
    setCurrentColor(presetColor);
    onChange(presetColor);
  };

  const handleAddPreset = () => {
    if (!presetColors.includes(currentColor)) {
      const newPresets = [...presetColors, currentColor].slice(-10); // Keep only the last 10 presets
      setPresetColors(newPresets);
      localStorage.setItem('colorPresets', JSON.stringify(newPresets));
    }
  };

  return (
    <div className="relative" ref={pickerRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="h-10 w-10 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          style={{
            background: showGradient 
              ? `linear-gradient(${gradientStart}, ${gradientEnd})`
              : currentColor
          }}
          aria-label={`Choose ${label}`}
        />
        <input
          type="text"
          value={currentColor}
          onChange={handleColorChange}
          className="input-field flex-1"
          placeholder="#000000"
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-64 animate-scale-in">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <input
              type="color"
              value={currentColor}
              onChange={handleColorChange}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>

          {showGradient && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gradient
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Start</label>
                  <input
                    type="color"
                    value={gradientStart}
                    onChange={(e) => onGradientChange('start', e.target.value)}
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">End</label>
                  <input
                    type="color"
                    value={gradientEnd}
                    onChange={(e) => onGradientChange('end', e.target.value)}
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Presets
              </label>
              <button 
                onClick={handleAddPreset}
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Save Current
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map((presetColor, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePresetClick(presetColor)}
                  className={`h-6 w-6 rounded-md hover:scale-110 transition-transform ${
                    presetColor === currentColor ? 'ring-2 ring-blue-500 ring-offset-1' : 'ring-1 ring-gray-300 dark:ring-gray-600'
                  }`}
                  style={{ backgroundColor: presetColor }}
                  aria-label={`Color: ${presetColor}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
