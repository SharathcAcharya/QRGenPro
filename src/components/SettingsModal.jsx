import React, { useState, useEffect } from 'react';
import { Settings, X, Palette, Download, Bell, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../App';

const SettingsModal = ({ isOpen, onClose }) => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [settings, setSettings] = useState({
    defaultErrorCorrection: 'M',
    defaultSize: 300,
    defaultForegroundColor: '#000000',
    defaultBackgroundColor: '#ffffff',
    defaultDotType: 'square',
    autoDownload: false,
    showNotifications: true,
    saveHistory: true,
    defaultFormat: 'png'
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('qr-settings');
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('qr-settings', JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    const defaultSettings = {
      defaultErrorCorrection: 'M',
      defaultSize: 300,
      defaultForegroundColor: '#000000',
      defaultBackgroundColor: '#ffffff',
      defaultDotType: 'square',
      autoDownload: false,
      showNotifications: true,
      saveHistory: true,
      defaultFormat: 'png'
    };
    setSettings(defaultSettings);
    localStorage.setItem('qr-settings', JSON.stringify(defaultSettings));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-glass border border-gray-200 dark:border-gray-700 w-full max-w-md max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Appearance */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Palette className="w-4 h-4 mr-2" />
                Appearance
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Dark Mode
                  </label>
                  <button
                    onClick={toggleDarkMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      darkMode ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                    {darkMode ? (
                      <Moon className="absolute left-1 w-3 h-3 text-blue-600" />
                    ) : (
                      <Sun className="absolute right-1 w-3 h-3 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Default QR Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Default QR Settings
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Error Correction
                  </label>
                  <select
                    value={settings.defaultErrorCorrection}
                    onChange={(e) => updateSetting('defaultErrorCorrection', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Default Size
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="800"
                    value={settings.defaultSize}
                    onChange={(e) => updateSetting('defaultSize', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{settings.defaultSize}px</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Foreground Color
                    </label>
                    <input
                      type="color"
                      value={settings.defaultForegroundColor}
                      onChange={(e) => updateSetting('defaultForegroundColor', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={settings.defaultBackgroundColor}
                      onChange={(e) => updateSetting('defaultBackgroundColor', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Dot Style
                  </label>
                  <select
                    value={settings.defaultDotType}
                    onChange={(e) => updateSetting('defaultDotType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="square">Square</option>
                    <option value="dots">Dots</option>
                    <option value="rounded">Rounded</option>
                    <option value="extra-rounded">Extra Rounded</option>
                    <option value="classy">Classy</option>
                    <option value="classy-rounded">Classy Rounded</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Behavior */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Behavior
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Auto Download
                  </label>
                  <button
                    onClick={() => updateSetting('autoDownload', !settings.autoDownload)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.autoDownload ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoDownload ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Show Notifications
                  </label>
                  <button
                    onClick={() => updateSetting('showNotifications', !settings.showNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.showNotifications ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.showNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Save History
                  </label>
                  <button
                    onClick={() => updateSetting('saveHistory', !settings.saveHistory)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.saveHistory ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.saveHistory ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Default Format
                  </label>
                  <select
                    value={settings.defaultFormat}
                    onChange={(e) => updateSetting('defaultFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="png">PNG</option>
                    <option value="svg">SVG</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={resetSettings}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Reset to defaults
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
