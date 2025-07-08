import React from 'react';
import { Palette, Settings } from 'lucide-react';

const QRCustomizer = ({ options, onOptionsChange }) => {
  const handleColorChange = (property, value) => {
    onOptionsChange({
      [property]: {
        ...options[property],
        color: value
      }
    });
  };

  const handleDotStyleChange = (type) => {
    onOptionsChange({
      dotsOptions: {
        ...options.dotsOptions,
        type: type
      }
    });
  };

  const handleCornerStyleChange = (type) => {
    onOptionsChange({
      cornersSquareOptions: {
        ...options.cornersSquareOptions,
        type: type
      },
      cornersDotOptions: {
        ...options.cornersDotOptions,
        type: type
      }
    });
  };

  const handleSizeChange = (size) => {
    onOptionsChange({
      width: size,
      height: size
    });
  };

  const handleErrorCorrectionChange = (level) => {
    onOptionsChange({
      qrOptions: {
        ...options.qrOptions,
        errorCorrectionLevel: level
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Colors */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Palette className="h-5 w-5 mr-2" />
          Colors
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Foreground Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={options.dotsOptions.color}
                onChange={(e) => handleColorChange('dotsOptions', e.target.value)}
                className="h-10 w-16 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
              />
              <input
                type="text"
                value={options.dotsOptions.color}
                onChange={(e) => handleColorChange('dotsOptions', e.target.value)}
                className="input-field"
                placeholder="#000000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={options.backgroundOptions.color}
                onChange={(e) => handleColorChange('backgroundOptions', e.target.value)}
                className="h-10 w-16 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
              />
              <input
                type="text"
                value={options.backgroundOptions.color}
                onChange={(e) => handleColorChange('backgroundOptions', e.target.value)}
                className="input-field"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Styles
        </h3>
        <div className="space-y-4">
          {/* Dot Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dot Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['square', 'rounded', 'dots', 'classy', 'classy-rounded'].map((style) => (
                <button
                  key={style}
                  onClick={() => handleDotStyleChange(style)}
                  className={`p-3 text-sm rounded-lg border-2 transition-colors duration-200 ${
                    options.dotsOptions.type === style
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Corner Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Corner Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['square', 'extra-rounded', 'dot'].map((style) => (
                <button
                  key={style}
                  onClick={() => handleCornerStyleChange(style)}
                  className={`p-3 text-sm rounded-lg border-2 transition-colors duration-200 ${
                    options.cornersSquareOptions.type === style
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Size: {options.width}px
            </label>
            <input
              type="range"
              min="200"
              max="500"
              value={options.width}
              onChange={(e) => handleSizeChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Error Correction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Error Correction Level
            </label>
            <select
              value={options.qrOptions.errorCorrectionLevel}
              onChange={(e) => handleErrorCorrectionChange(e.target.value)}
              className="input-field"
            >
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCustomizer;
