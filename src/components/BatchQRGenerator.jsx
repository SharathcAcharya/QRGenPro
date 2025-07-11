import React, { useState, useRef } from 'react';
import { Download, Upload, Plus, Trash2, FileText, CheckCircle, X } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import JSZip from 'jszip';
import defaultOptions from '../utils/defaultQROptions';

const BatchQRGenerator = () => {
  const [urls, setUrls] = useState([{ id: 1, url: '', name: '', status: 'pending' }]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodes, setQrCodes] = useState([]);
  const [generatedCount, setGeneratedCount] = useState(0);
  const fileInputRef = useRef(null);

  const addUrl = () => {
    const newId = Math.max(...urls.map(u => u.id)) + 1;
    setUrls([...urls, { id: newId, url: '', name: '', status: 'pending' }]);
  };

  const removeUrl = (id) => {
    setUrls(urls.filter(u => u.id !== id));
  };

  const updateUrl = (id, field, value) => {
    setUrls(urls.map(u => 
      u.id === id ? { ...u, [field]: value } : u
    ));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csv = event.target.result;
        const lines = csv.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',');
        
        const urlColumnIndex = headers.findIndex(h => 
          h.toLowerCase().includes('url') || 
          h.toLowerCase().includes('link')
        );
        const nameColumnIndex = headers.findIndex(h => 
          h.toLowerCase().includes('name') || 
          h.toLowerCase().includes('title')
        );

        if (urlColumnIndex === -1) {
          alert('CSV must contain a URL column');
          return;
        }

        const newUrls = lines.slice(1).map((line, index) => {
          const columns = line.split(',');
          return {
            id: Date.now() + index,
            url: columns[urlColumnIndex]?.trim() || '',
            name: columns[nameColumnIndex]?.trim() || `QR ${index + 1}`,
            status: 'pending'
          };
        }).filter(u => u.url);

        setUrls(newUrls);
      };
      reader.readAsText(file);
    }
  };

  const generateBatchQRCodes = async () => {
    setIsGenerating(true);
    setGeneratedCount(0);
    const generatedCodes = [];

    for (let i = 0; i < urls.length; i++) {
      const urlData = urls[i];
      if (!urlData.url.trim()) continue;

      try {
        updateUrl(urlData.id, 'status', 'generating');
        
        const qrCode = new QRCodeStyling({
          ...defaultOptions,
          data: urlData.url,
          width: 400,
          height: 400
        });

        // Create a temporary container
        const tempDiv = document.createElement('div');
        qrCode.append(tempDiv);

        // Wait for QR code generation
        await new Promise(resolve => setTimeout(resolve, 100));

        generatedCodes.push({
          ...urlData,
          qrCode,
          element: tempDiv
        });

        updateUrl(urlData.id, 'status', 'completed');
        setGeneratedCount(i + 1);
      } catch (error) {
        updateUrl(urlData.id, 'status', 'error');
        console.error('Error generating QR code:', error);
      }
    }

    setQrCodes(generatedCodes);
    setIsGenerating(false);
  };

  const downloadAll = async () => {
    if (qrCodes.length === 0) return;

    const zip = new JSZip();
    
    for (const qrData of qrCodes) {
      try {
        const canvas = qrData.element.querySelector('canvas');
        if (canvas) {
          const dataUrl = canvas.toDataURL('image/png');
          const base64Data = dataUrl.split(',')[1];
          const fileName = qrData.name || `qr-${qrData.id}`;
          zip.file(`${fileName}.png`, base64Data, { base64: true });
        }
      } catch (error) {
        console.error('Error adding QR code to zip:', error);
      }
    }

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `qr-codes-batch-${Date.now()}.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error generating zip file:', error);
    }
  };

  const exportCSV = () => {
    const csvContent = 'Name,URL,Status\n' + 
      urls.map(u => `"${u.name}","${u.url}","${u.status}"`).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `qr-batch-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Batch QR Generator
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Generate multiple QR codes at once from a list of URLs
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            <button
                onClick={addUrl}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add URL</span>
              </button>
              
              <label className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Import CSV</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={exportCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={generateBatchQRCodes}
                disabled={isGenerating || urls.every(u => !u.url.trim())}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                <span>{isGenerating ? 'Generating...' : 'Generate All'}</span>
              </button>

              {qrCodes.length > 0 && (
                <button
                  onClick={downloadAll}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download All</span>
                </button>
              )}
            </div>

            {isGenerating && (
              <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-blue-700 dark:text-blue-300">
                    Generated {generatedCount} of {urls.filter(u => u.url.trim()).length} QR codes...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* URL List */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-3">
              {urls.map((urlData) => (
                <div
                  key={urlData.id}
                  className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Display name (optional)"
                      value={urlData.name}
                      onChange={(e) => updateUrl(urlData.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={urlData.url}
                      onChange={(e) => updateUrl(urlData.id, 'url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {urlData.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {urlData.status === 'generating' && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    )}
                    {urlData.status === 'error' && (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                    
                    <button
                      onClick={() => removeUrl(urlData.id)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default BatchQRGenerator;
