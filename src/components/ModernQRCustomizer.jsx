import React, { useState, useEffect } from 'react';
import { Palette, Settings, Sliders, Eye, Image, Layout, RefreshCw, Copy, Check, Save, Sparkles } from 'lucide-react';
import EnhancedColorPicker from './EnhancedColorPicker';

const ModernQRCustomizer = ({ options, onOptionsChange }) => {
  const [activeTab, setActiveTab] = useState('colors');
  const [presetName, setPresetName] = useState('');
  const [savedPresets, setSavedPresets] = useState(() => {
    const saved = localStorage.getItem('qr-presets');
    return saved ? JSON.parse(saved) : [];
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    localStorage.setItem('qr-presets', JSON.stringify(savedPresets));
  }, [savedPresets]);

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

  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    
    const newPreset = {
      id: Date.now(),
      name: presetName,
      options: {
        dotsOptions: options.dotsOptions,
        backgroundOptions: options.backgroundOptions,
        cornersSquareOptions: options.cornersSquareOptions,
        cornersDotOptions: options.cornersDotOptions
      }
    };
    
    setSavedPresets([newPreset, ...savedPresets]);
    setPresetName('');
  };

  const handleApplyPreset = (preset) => {
    onOptionsChange(preset.options);
  };

  const handleDeletePreset = (presetId) => {
    setSavedPresets(savedPresets.filter(preset => preset.id !== presetId));
  };

  const handleCopyStyle = () => {
    const styleData = JSON.stringify({
      dotsOptions: options.dotsOptions,
      backgroundOptions: options.backgroundOptions,
      cornersSquareOptions: options.cornersSquareOptions,
      cornersDotOptions: options.cornersDotOptions
    });
    
    navigator.clipboard.writeText(styleData);
    setCopied(true);
  };

  const tabs = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'styles', label: 'Styles', icon: Settings },
    { id: 'presets', label: 'Presets', icon: Sparkles }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 flex-1 justify-center py-2 px-3 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="card">
            <EnhancedColorPicker
              color={options.dotsOptions.color}
              onChange={(value) => handleColorChange('dotsOptions', value)}
              label="Foreground Color"
              showGradient={true}
              showPresets={true}
              showHistory={true}
            />
          </div>

          <div className="card">
            <EnhancedColorPicker
              color={options.backgroundOptions.color}
              onChange={(value) => handleColorChange('backgroundOptions', value)}
              label="Background Color"
              showGradient={false}
              showPresets={true}
              showHistory={true}
            />
          </div>

          <div className="card">
            <EnhancedColorPicker
              color={options.cornersSquareOptions.color}
              onChange={(value) => handleColorChange('cornersSquareOptions', value)}
              label="Corner Squares Color"
              showGradient={false}
              showPresets={true}
              showHistory={true}
            />
          </div>

          <div className="card">
            <EnhancedColorPicker
              color={options.cornersDotOptions.color}
              onChange={(value) => handleColorChange('cornersDotOptions', value)}
              label="Corner Dots Color"
              showGradient={false}
              showPresets={true}
              showHistory={true}
            />
          </div>
        </div>
      )}

      {/* Styles Tab */}
      {activeTab === 'styles' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Dot Style */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Dot Style
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {['square', 'rounded', 'dots', 'classy', 'classy-rounded'].map((style) => (
                <button
                  key={style}
                  onClick={() => handleDotStyleChange(style)}
                  className={`group p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
                    options.dotsOptions.type === style
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="aspect-square bg-blue-600 dark:bg-blue-400 rounded-md mb-2 w-full"></div>
                  <div className="text-xs font-medium text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {style.charAt(0).toUpperCase() + style.slice(1).replace('-', ' ')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Corner Style */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Layout className="h-5 w-5 mr-2" />
              Corner Style
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {['square', 'extra-rounded', 'dot'].map((style) => (
                <button
                  key={style}
                  onClick={() => handleCornerStyleChange(style)}
                  className={`group p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
                    options.cornersSquareOptions.type === style
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="aspect-square bg-blue-600 dark:bg-blue-400 rounded-md mb-2 w-full"></div>
                  <div className="text-xs font-medium text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {style.charAt(0).toUpperCase() + style.slice(1).replace('-', ' ')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Sliders className="h-5 w-5 mr-2" />
              Size & Settings
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Size: {options.width}px
                  </label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {options.width < 300 ? 'Small' : options.width < 400 ? 'Medium' : 'Large'}
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="500"
                  step="10"
                  value={options.width}
                  onChange={(e) => handleSizeChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>200px</span>
                  <span>350px</span>
                  <span>500px</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Error Correction Level
                </label>
                <select
                  value={options.qrOptions.errorCorrectionLevel}
                  onChange={(e) => handleErrorCorrectionChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                  <option value="L">Low (7% damage recovery)</option>
                  <option value="M">Medium (15% damage recovery)</option>
                  <option value="Q">Quartile (25% damage recovery)</option>
                  <option value="H">High (30% damage recovery)</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Higher correction levels make your QR code more reliable but increase its complexity.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Presets Tab */}
      {activeTab === 'presets' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Save Current Style */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Save className="h-5 w-5 mr-2" />
              Save Current Style
            </h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Preset name"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleSavePreset}
                disabled={!presetName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors"
              >
                Save
              </button>
            </div>
          </div>

          {/* Saved Presets */}
          {savedPresets.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Saved Presets
              </h3>
              <div className="space-y-3">
                {savedPresets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded-md border border-gray-200 dark:border-gray-600"
                        style={{ backgroundColor: preset.options.dotsOptions.color }}
                      ></div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {preset.name}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApplyPreset(preset)}
                        className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Apply preset"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeletePreset(preset.id)}
                        className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete preset"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Copy Style */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Copy className="h-5 w-5 mr-2" />
              Copy Style Configuration
            </h3>
            <button
              onClick={handleCopyStyle}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-600 dark:text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span className="font-medium">Copy JSON Configuration</span>
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Share this configuration with others or save it for future reference.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernQRCustomizer;
