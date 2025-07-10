import React, { useState, useEffect, useCallback } from 'react';
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
  // Not currently used but will be used for future analytics filtering
  const [_selectedMetric, _setSelectedMetric] = useState('generation');

  const loadAnalytics = useCallback(() => {
    // Load from localStorage or API
    const history = JSON.parse(localStorage.getItem('qr-history') || '[]');
    const downloads = JSON.parse(localStorage.getItem('qr-downloads') || '[]');

    // Calculate analytics
    const totalGenerated = history.length;
    const totalDownloads = downloads.length;

    // Popular download formats
    const formatCounts = { png: 0, svg: 0, pdf: 0 };
    downloads.forEach(item => {
      const format = item.format || 'png';
      formatCounts[format] = (formatCounts[format] || 0) + 1;
    });

    // Daily generation counts
    const now = new Date();
    const days = timeRange === '7d' ? 7 : 30;
    const dailyGeneration = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      const count = history.filter(item => {
        const itemDate = new Date(item.createdAt || 0);
        return itemDate >= date && itemDate < nextDay;
      }).length;
      
      const dateStr = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      dailyGeneration.unshift({
        date: dateStr,
        count
      });
    }

    // Top domains
    const domainCounts = {};
    history.forEach(item => {
      try {
        const domain = new URL(item.url).hostname;
        domainCounts[domain] = (domainCounts[domain] || 0) + 1;
      } catch (_unused) {
        // Invalid URL
        domainCounts['Other'] = (domainCounts['Other'] || 0) + 1;
      }
    });

    const topDomains = Object.entries(domainCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, count }));

    // Color and style usage
    const colorUsage = {};
    const styleUsage = {};
    
    history.forEach(item => {
      if (item.options) {
        // Count dot colors
        const dotColor = item.options.dotsOptions?.color;
        if (dotColor) {
          colorUsage[dotColor] = (colorUsage[dotColor] || 0) + 1;
        }
        
        // Count dot styles
        const dotStyle = item.options.dotsOptions?.type;
        if (dotStyle) {
          styleUsage[dotStyle] = (styleUsage[dotStyle] || 0) + 1;
        }
      }
    });

    // Update state
    setAnalytics({
      totalGenerated,
      totalDownloads,
      popularFormats: formatCounts,
      dailyGeneration,
      topDomains,
      colorUsage,
      styleUsage
    });
  }, [timeRange]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Stat Card component
  const StatCard = ({ icon: Icon, title, value, subtitle, trend }) => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${
            trend && trend > 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900'
          }`}>
            <Icon className={`w-6 h-6 ${
              trend && trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
            }`} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</div>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600 dark:text-green-400">
            +{trend || 5}% from last week
          </span>
        </div>
      </div>
    );
  };

  // Bar Chart component
  const BarChart = ({ data, dataKey, color = '#3b82f6' }) => {
    if (!data || data.length === 0) return null;
    
    const maxValue = Math.max(...data.map(item => item[dataKey]));
    
    return (
      <div className="space-y-3">
        {data.map((item, _index) => (
          <div key={item.date || item.domain} className="flex items-center space-x-3">
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
              icon={Calendar}
              title="Active Days"
              value={analytics.dailyGeneration.filter(day => day.count > 0).length}
              subtitle="Days with activity"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Generation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Daily Activity
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      QR codes generated per day
                    </p>
                  </div>
                </div>
              </div>
              
              <BarChart 
                data={analytics.dailyGeneration} 
                dataKey="count" 
                color="#3b82f6"
              />
            </div>
            
            {/* Top Domains */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Top Domains
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Most frequently used websites
                    </p>
                  </div>
                </div>
              </div>
              
              <BarChart 
                data={analytics.topDomains} 
                dataKey="count" 
                color="#8b5cf6"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRAnalytics;
