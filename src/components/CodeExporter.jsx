import React, { useState, useRef } from 'react';
import { Code, Copy, Check, ArrowDownToLine, GitBranch, Share2, FileText } from 'lucide-react';

const CodeExporter = ({ qrOptions, url }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  const generateHTMLCode = () => {
    return `<!-- QR Code generated with QRloop -->
<div id="qrcode"></div>

<script src="https://unpkg.com/qr-code-styling/lib/qr-code-styling.js"></script>
<script>
  const qrCode = new QRCodeStyling({
    width: ${qrOptions.width},
    height: ${qrOptions.height},
    type: "${qrOptions.type}",
    data: "${url}",
    ${qrOptions.image ? `image: "${qrOptions.image}",` : ''}
    margin: ${qrOptions.margin},
    qrOptions: {
      typeNumber: ${qrOptions.qrOptions.typeNumber},
      mode: "${qrOptions.qrOptions.mode}",
      errorCorrectionLevel: "${qrOptions.qrOptions.errorCorrectionLevel}"
    },
    imageOptions: {
      hideBackgroundDots: ${qrOptions.imageOptions.hideBackgroundDots},
      imageSize: ${qrOptions.imageOptions.imageSize},
      margin: ${qrOptions.imageOptions.margin},
      crossOrigin: "${qrOptions.imageOptions.crossOrigin}"
    },
    dotsOptions: {
      color: "${qrOptions.dotsOptions.color}",
      type: "${qrOptions.dotsOptions.type}"
    },
    backgroundOptions: {
      color: "${qrOptions.backgroundOptions.color}"
    },
    cornersSquareOptions: {
      color: "${qrOptions.cornersSquareOptions.color}",
      type: "${qrOptions.cornersSquareOptions.type}"
    },
    cornersDotOptions: {
      color: "${qrOptions.cornersDotOptions.color}",
      type: "${qrOptions.cornersDotOptions.type}"
    }
  });
  
  qrCode.append(document.getElementById("qrcode"));
</script>`;
  };

  const generateReactCode = () => {
    return `// QR Code component generated with QRloop
import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';

const QRCodeDisplay = () => {
  const qrRef = useRef(null);
  
  useEffect(() => {
    if (!qrRef.current) return;
    
    const qrCode = new QRCodeStyling({
      width: ${qrOptions.width},
      height: ${qrOptions.height},
      type: "${qrOptions.type}",
      data: "${url}",
      ${qrOptions.image ? `image: "${qrOptions.image}",` : ''}
      margin: ${qrOptions.margin},
      qrOptions: {
        typeNumber: ${qrOptions.qrOptions.typeNumber},
        mode: "${qrOptions.qrOptions.mode}",
        errorCorrectionLevel: "${qrOptions.qrOptions.errorCorrectionLevel}"
      },
      imageOptions: {
        hideBackgroundDots: ${qrOptions.imageOptions.hideBackgroundDots},
        imageSize: ${qrOptions.imageOptions.imageSize},
        margin: ${qrOptions.imageOptions.margin},
        crossOrigin: "${qrOptions.imageOptions.crossOrigin}"
      },
      dotsOptions: {
        color: "${qrOptions.dotsOptions.color}",
        type: "${qrOptions.dotsOptions.type}"
      },
      backgroundOptions: {
        color: "${qrOptions.backgroundOptions.color}"
      },
      cornersSquareOptions: {
        color: "${qrOptions.cornersSquareOptions.color}",
        type: "${qrOptions.cornersSquareOptions.type}"
      },
      cornersDotOptions: {
        color: "${qrOptions.cornersDotOptions.color}",
        type: "${qrOptions.cornersDotOptions.type}"
      }
    });
    
    qrRef.current.innerHTML = '';
    qrCode.append(qrRef.current);
    
    return () => {
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
      }
    };
  }, []);
  
  return (
    <div className="qr-code-container">
      <div ref={qrRef} />
    </div>
  );
};

export default QRCodeDisplay;`;
  };

  const generateJSONConfig = () => {
    return JSON.stringify({
      width: qrOptions.width,
      height: qrOptions.height,
      type: qrOptions.type,
      data: url,
      image: qrOptions.image,
      margin: qrOptions.margin,
      qrOptions: qrOptions.qrOptions,
      imageOptions: qrOptions.imageOptions,
      dotsOptions: qrOptions.dotsOptions,
      backgroundOptions: qrOptions.backgroundOptions,
      cornersSquareOptions: qrOptions.cornersSquareOptions,
      cornersDotOptions: qrOptions.cornersDotOptions
    }, null, 2);
  };

  const getCodeForActiveTab = () => {
    switch (activeTab) {
      case 'html':
        return generateHTMLCode();
      case 'react':
        return generateReactCode();
      case 'json':
        return generateJSONConfig();
      default:
        return generateHTMLCode();
    }
  };

  const handleCopyCode = () => {
    const code = getCodeForActiveTab();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const code = getCodeForActiveTab();
    const fileExtension = activeTab === 'json' ? 'json' : activeTab === 'react' ? 'jsx' : 'html';
    const fileName = `qrcode-config.${fileExtension}`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Code className="h-5 w-5 mr-2" />
        Export Code
      </h3>

      <div className="mb-4">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {['html', 'react', 'json'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 font-medium text-sm transition-colors relative ${
                activeTab === tab
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 relative">
        <pre
          ref={codeRef}
          className="text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap font-mono overflow-x-auto max-h-60 overflow-y-auto"
        >
          {getCodeForActiveTab()}
        </pre>

        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            onClick={handleDownloadCode}
            className="p-1.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Download code"
          >
            <ArrowDownToLine className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start">
          <GitBranch className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300">Developer Notes</h4>
            <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
              This code uses the <a href="https://github.com/kozakdenys/qr-code-styling" className="underline" target="_blank" rel="noopener noreferrer">qr-code-styling</a> library. 
              For React projects, install it with <code className="bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded">npm install qr-code-styling</code>
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          className="btn-ghost text-sm flex items-center"
          onClick={() => {
            const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(generateJSONConfig())}`;
            const a = document.createElement('a');
            a.href = dataStr;
            a.download = "qrcode-config.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
        >
          <FileText className="h-4 w-4 mr-1" />
          Save Config
        </button>
        
        <button
          className="btn-ghost text-sm flex items-center"
          onClick={() => {
            const text = `Check out this QR code I created with QRloop! You can recreate it using this config: ${url}`;
            navigator.clipboard.writeText(text);
            // Here you'd typically show a notification
          }}
        >
          <Share2 className="h-4 w-4 mr-1" />
          Share Config
        </button>
      </div>
    </div>
  );
};

export default CodeExporter;
