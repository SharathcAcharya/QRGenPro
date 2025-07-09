import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Globe, Download, Eye, Share2, X } from 'lucide-react';

const QRAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalGenerated: 0,
    totalDownloads: 0,
    popularFormats: { png: 0, svg: 0 },
    dailyGeneration: [],
    topDomains: [],
    colorUsage: {},
    styleUsage: {}
  });

  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('generation');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = () => {
    // Load from localStorage or API
    const history = JSON.parse(localStorage.getItem('qr-history') || '[]');
    const downloads = JSON.parse(localStorage.getItem('qr-downloads') || '[]');
    const settings = JSON.parse(localStorage.getItem('qr-settings') || '{}');

    // Calculate analytics
    const totalGenerated = history.length;
    const totalDownloads = downloads.length;

    // Daily generation data (last 7/30 days)
    const days = timeRange === '7d' ? 7 : 30;
    const dailyData = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const count = history.filter(item => {
        const itemDate = new Date(item.timestamp);
        return itemDate >= dayStart && itemDate <= dayEnd;
      }).length;

      dailyData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count
      });
    }

    // Top domains
    const domainCounts = {};
    history.forEach(item => {
      try {
        const domain = new URL(item.url).hostname;
        domainCounts[domain] = (domainCounts[domain] || 0) + 1;
      } catch (e) {
        // Invalid URL
        domainCounts['Other'] = (domainCounts['Other'] || 0) + 1;
      }
    });

    const topDomains = Object.entries(domainCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, count }));

    // Format usage
    const formatCounts = downloads.reduce((acc, download) => {
      acc[download.format] = (acc[download.format] || 0) + 1;
      return acc;
    }, { png: 0, svg: 0 });

    setAnalytics({
      totalGenerated,
      totalDownloads,
      popularFormats: formatCounts,
      dailyGeneration: dailyData,
      topDomains,
      colorUsage: settings.colorUsage || {},
      styleUsage: settings.styleUsage || {}
    });
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, trend }) => (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          trend && trend > 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900'
        }`}>
          <Icon className={`w-6 h-6 ${
            trend && trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
          }`} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600 dark:text-green-400">
            +{trend}% from last week
          </span>
        </div>
      )}
    </div>
  );

  const BarChart = ({ data, dataKey, color = '#3b82f6' }) => {
    const maxValue = Math.max(...data.map(item => item[dataKey]));
    
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-16 text-sm text-gray-600 dark:text-gray-400">
              {item.date || item.domain}
            </div>
            <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3 relative">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${(item[dataKey] / maxValue) * 100}%`,
                  backgroundColor: color
                }}
              />
            </div>
            <div className="w-8 text-sm font-medium text-gray-900 dark:text-white">
              {item[dataKey]}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                QR Code Analytics
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Track your QR code usage and performance
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Eye}
              title="QR Codes Generated"
              value={analytics.totalGenerated}
              subtitle="Total count"
              trend={12}
            />
            <StatCard
              icon={Download}
              title="Downloads"
              value={analytics.totalDownloads}
              subtitle="All formats"
              trend={8}
            />
            <StatCard
              icon={Share2}
              title="PNG Downloads"
              value={analytics.popularFormats.png}
              subtitle="Most popular format"
            />
            <StatCard
              icon={Globe}
              title="SVG Downloads"
              value={analytics.popularFormats.svg}
              subtitle="Vector format"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Daily Generation Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Daily Generation
                </h3>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <BarChart data={analytics.dailyGeneration} dataKey="count" color="#3b82f6" />
            </div>

            {/* Top Domains */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Top Domains
                </h3>
                <Globe className="w-5 h-5 text-gray-400" />
              </div>
              <BarChart data={analytics.topDomains} dataKey="count" color="#10b981" />
            </div>
          </div>

          {/* Format Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Download Formats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">PNG</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {analytics.popularFormats.png}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">SVG</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {analytics.popularFormats.svg}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Performance Tips
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p>PNG format is preferred for web and social media</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>SVG format scales perfectly for print materials</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <p>Higher error correction helps with damaged codes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRAnalytics;
