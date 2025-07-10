import React, { useState, useRef } from 'react';
import { Share2, Copy, Check, Facebook, Twitter, Linkedin, Instagram, MessageCircle, Download, Globe, QrCode } from 'lucide-react';

const SocialShareWidget = ({ qrCode, qrData, customMessage }) => {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const canvasRef = useRef(null);

  const socialPlatforms = [
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-500',
      shareUrl: (text, url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      defaultMessage: 'Check out this QR code I created with QRloop! 🚀'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      shareUrl: (text, url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      defaultMessage: 'Created this awesome QR code with QRloop!'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700',
      shareUrl: (text, url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
      defaultMessage: 'Professional QR code created with QRloop'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500',
      shareUrl: (text, url) => `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      defaultMessage: 'Check out this QR code!'
    },
    {
      id: 'instagram',
      name: 'Instagram Story',
      icon: Instagram,
      color: 'bg-gradient-to-br from-purple-600 to-pink-600',
      action: 'download', // Instagram requires image download
      defaultMessage: 'Share to Instagram Story'
    }
  ];

  const generateShareableLink = async () => {
    setIsGeneratingLink(true);
    
    // Simulate API call to generate shareable link
    setTimeout(() => {
      const mockShareId = Math.random().toString(36).substr(2, 9);
      const generatedLink = `https://qrloop.app/share/${mockShareId}`;
      setShareLink(generatedLink);
      setIsGeneratingLink(false);
    }, 1500);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToSocial = (platform) => {
    const message = customMessage || platform.defaultMessage;
    const url = shareLink || window.location.href;
    
    if (platform.action === 'download') {
      // For Instagram, download the QR code image
      downloadQRImage();
      return;
    }
    
    const shareUrl = platform.shareUrl(message, url);
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const downloadQRImage = () => {
    if (qrCode && canvasRef.current) {
      qrCode.download({ name: 'qrcode-social', extension: 'png' });
    }
  };

  const shareViaWebAPI = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QRloop - QR Code',
          text: customMessage || 'Check out this QR code I created!',
          url: shareLink || window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const copyQRData = () => {
    copyToClipboard(qrData);
  };

  const copyShareLink = () => {
    if (shareLink) {
      copyToClipboard(shareLink);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card glass-morphism">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Social Media Sharing
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Share your QR code across social platforms
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={shareViaWebAPI}
            className="flex items-center justify-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Quick Share</span>
          </button>
          <button
            onClick={copyQRData}
            className="flex items-center justify-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy URL'}</span>
          </button>
        </div>
      </div>

      {/* Shareable Link Generation */}
      <div className="card">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
          Generate Shareable Link
        </h4>
        {!shareLink ? (
          <button
            onClick={generateShareableLink}
            disabled={isGeneratingLink}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
          >
            {isGeneratingLink ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Globe className="w-4 h-4" />
                <span>Create Share Link</span>
              </>
            )}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Globe className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none"
              />
              <button
                onClick={copyShareLink}
                className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Share this link to let others view and download your QR code
            </p>
          </div>
        )}
      </div>

      {/* Social Media Platforms */}
      <div className="card">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
          Share on Social Media
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {socialPlatforms.map((platform) => {
            const IconComponent = platform.icon;
            return (
              <button
                key={platform.id}
                onClick={() => shareToSocial(platform)}
                className={`flex items-center space-x-2 p-3 text-white rounded-lg hover:opacity-90 transition-all transform hover:scale-105 ${platform.color}`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{platform.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Message */}
      <div className="card">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
          Customize Share Message
        </h4>
        <div className="space-y-3">
          <textarea
            placeholder="Add a custom message to share with your QR code..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            defaultValue={customMessage}
          />
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Tip: Include hashtags and mentions for better reach</span>
            <span>0/280</span>
          </div>
        </div>
      </div>

      {/* Share Analytics Preview */}
      <div className="card bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
          Share Analytics
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Scans</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Shares</div>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
          Analytics will be available after generating a shareable link
        </p>
      </div>

      {/* Hidden canvas for QR code rendering */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default SocialShareWidget;
