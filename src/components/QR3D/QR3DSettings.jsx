import React from 'react';
import { Settings, AlertCircle, BarChart3, Check, X } from 'lucide-react';

const QR3DSettings = ({ settings, setSettings }) => {
  const [showSettings, setShowSettings] = React.useState(false);
  
  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  return (
    <div className="border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="w-full p-3 flex items-center justify-between text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          3D Settings
        </span>
        <span className="text-gray-400">
          {showSettings ? 
            <X className="w-5 h-5" /> : 
            <BarChart3 className="w-5 h-5" />
          }
        </span>
      </button>
      
      {showSettings && (
        <div className="p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
          {/* Scale slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Scale
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.scale}
              onChange={(e) => handleSettingChange('scale', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0.5x</span>
              <span>1x</span>
              <span>2x</span>
            </div>
          </div>
          
          {/* Material selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Material Type
            </label>
            <select
              value={settings.material}
              onChange={(e) => handleSettingChange('material', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="standard">Standard</option>
              <option value="basic">Basic</option>
              <option value="phong">Phong</option>
              <option value="toon">Toon</option>
              <option value="physical">Physical</option>
            </select>
          </div>
          
          {/* Background color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                className="h-8 w-8 border-0 rounded-full cursor-pointer"
              />
              <input
                type="text"
                value={settings.backgroundColor}
                onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          
          {/* Performance settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Performance Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['low', 'balanced', 'high'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleSettingChange('performance', mode)}
                  className={`py-2 px-3 rounded-md flex items-center justify-center capitalize
                    ${settings.performance === mode 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  {settings.performance === mode && <Check className="w-4 h-4 mr-1" />}
                  {mode}
                </button>
              ))}
            </div>
          </div>
          
          {/* Toggle options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Show Grid Helper
              </label>
              <button
                onClick={() => handleSettingChange('showGridHelper', !settings.showGridHelper)}
                className={`w-12 h-6 rounded-full p-1 transition-colors
                  ${settings.showGridHelper 
                    ? 'bg-blue-500' 
                    : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform
                  ${settings.showGridHelper ? 'translate-x-6' : ''}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Shadows
              </label>
              <button
                onClick={() => handleSettingChange('showShadows', !settings.showShadows)}
                className={`w-12 h-6 rounded-full p-1 transition-colors
                  ${settings.showShadows 
                    ? 'bg-blue-500' 
                    : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform
                  ${settings.showShadows ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Performance warning */}
          <div className="mt-2 flex items-start p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>
              Higher quality settings may affect performance on mobile devices. 
              Choose 'Low' for better performance on older devices.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QR3DSettings;
