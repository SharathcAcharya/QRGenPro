import React, { useState, useEffect, useCallback } from 'react';
import { History, Clock, ExternalLink, Trash2 } from 'lucide-react';

const QRHistory = ({ onSelectFromHistory }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('qrHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const addToHistory = useCallback((url, timestamp = Date.now()) => {
    const newEntry = { url, timestamp, id: timestamp };
    setHistory(prevHistory => {
      const updatedHistory = [newEntry, ...prevHistory.filter(item => item.url !== url)].slice(0, 10);
      localStorage.setItem('qrHistory', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  }, []);

  const removeFromHistory = (id) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('qrHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('qrHistory');
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Expose addToHistory function to parent component
  useEffect(() => {
    window.addToQRHistory = addToHistory;
  }, [addToHistory]);

  if (history.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <History className="h-5 w-5 mr-2" />
          Recent QR Codes
        </h3>
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No recent QR codes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <History className="h-5 w-5 mr-2" />
          Recent QR Codes
        </h3>
        <button
          onClick={clearHistory}
          className="text-sm text-red-500 hover:text-red-700 transition-colors duration-200"
        >
          Clear All
        </button>
      </div>
      
      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {item.url}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(item.timestamp)}
              </p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onSelectFromHistory(item.url)}
                className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                title="Use this URL"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
              <button
                onClick={() => removeFromHistory(item.id)}
                className="p-1 text-red-500 hover:text-red-700 transition-colors duration-200"
                title="Remove from history"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRHistory;
