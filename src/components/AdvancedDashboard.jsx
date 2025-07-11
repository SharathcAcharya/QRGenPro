import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, TrendingUp, Users, Zap, Globe, Smartphone, Eye, Download, Share2, Star, ArrowUpRight, Calendar, Clock, Target } from 'lucide-react';

const AdvancedDashboard = () => {
  const [stats, setStats] = useState({
    totalQRCodes: 0,
    totalScans: 0,
    totalShares: 0,
    avgScanRate: 0,
    topPerformers: [],
    recentActivity: [],
    deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 },
    geographicData: []
  });

  const loadDashboardData = useCallback(() => {
    // Load from localStorage and simulate real-time data
    const qrHistory = JSON.parse(localStorage.getItem('qr-history') || '[]');
    const qrLibrary = JSON.parse(localStorage.getItem('qr-library') || '[]');
    
    // Simulate analytics data
    const totalQRCodes = qrLibrary.length + qrHistory.length;
    const totalScans = Math.floor(totalQRCodes * (Math.random() * 50 + 10));
    const totalShares = Math.floor(totalScans * 0.3);
    const avgScanRate = totalQRCodes > 0 ? (totalScans / totalQRCodes).toFixed(1) : 0;

    setStats({
      totalQRCodes,
      totalScans,
      totalShares,
      avgScanRate,
      topPerformers: generateTopPerformers(qrLibrary),
      recentActivity: generateRecentActivity(),
      deviceBreakdown: generateDeviceBreakdown(),
      geographicData: generateGeographicData()
    });
  }, []);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  const generateTopPerformers = (library) => {
    return library.slice(0, 5).map((qr) => ({
      id: qr.id,
      name: qr.name || `QR Code #${qr.id}`,
      scans: Math.floor(Math.random() * 100 + 10),
      growth: Math.floor(Math.random() * 30 + 5),
      data: qr.data
    }));
  };

  const generateRecentActivity = () => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      action: ['Generated', 'Scanned', 'Shared', 'Downloaded'][Math.floor(Math.random() * 4)],
      target: `QR Code #${Math.floor(Math.random() * 1000)}`,
      time: new Date(Date.now() - Math.random() * 86400000).toLocaleTimeString(),
      icon: [Star, Eye, Share2, Download][Math.floor(Math.random() * 4)]
    }));
  };

  const generateDeviceBreakdown = () => ({
    mobile: Math.floor(Math.random() * 40 + 45),
    desktop: Math.floor(Math.random() * 30 + 25),
    tablet: Math.floor(Math.random() * 20 + 10)
  });

  const generateGeographicData = () => [
    { country: 'United States', scans: Math.floor(Math.random() * 1000 + 500), flag: '🇺🇸' },
    { country: 'United Kingdom', scans: Math.floor(Math.random() * 800 + 300), flag: '🇬🇧' },
    { country: 'Germany', scans: Math.floor(Math.random() * 600 + 200), flag: '🇩🇪' },
    { country: 'France', scans: Math.floor(Math.random() * 500 + 150), flag: '🇫🇷' },
    { country: 'Canada', scans: Math.floor(Math.random() * 400 + 100), flag: '🇨🇦' }
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, gradient, trend }) => (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className="flex items-center space-x-1 text-green-200">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">+{trend}%</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-sm opacity-90">{title}</p>
          {subtitle && <p className="text-xs opacity-70">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const PerformanceChart = () => (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Overview</h3>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">Last 7 days</span>
        </div>
      </div>
      
      {/* Simulated Chart */}
      <div className="h-64 bg-gradient-to-t from-blue-50 to-transparent dark:from-blue-900/20 rounded-lg p-4 relative overflow-hidden">
        <div className="absolute inset-0 flex items-end justify-around p-4">
          {Array.from({ length: 7 }, (_, i) => {
            const height = Math.random() * 80 + 20;
            return (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div 
                  className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-1000 hover:from-purple-500 hover:to-purple-400"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-500">
                  {new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en', { weekday: 'short' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const TopPerformers = () => (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Performing QR Codes</h3>
      <div className="space-y-4">
        {stats.topPerformers.map((performer, _index) => (
          <div key={performer.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                _index === 0 ? 'bg-yellow-500' : _index === 1 ? 'bg-gray-400' : _index === 2 ? 'bg-amber-600' : 'bg-blue-500'
              }`}>
                {_index + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{performer.name}</p>
                <p className="text-sm text-gray-500 truncate max-w-48">{performer.data}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900 dark:text-white">{performer.scans}</p>
              <p className="text-sm text-green-600">+{performer.growth}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const RecentActivity = () => (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {stats.recentActivity.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <IconComponent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">{activity.action}</span> {activity.target}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const DeviceBreakdown = () => (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Device Usage</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Smartphone className="w-5 h-5 text-blue-600" />
            <span className="text-gray-900 dark:text-white">Mobile</span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white">{stats.deviceBreakdown.mobile}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
            style={{ width: `${stats.deviceBreakdown.mobile}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-green-600" />
            <span className="text-gray-900 dark:text-white">Desktop</span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white">{stats.deviceBreakdown.desktop}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-1000" 
            style={{ width: `${stats.deviceBreakdown.desktop}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-purple-600" />
            <span className="text-gray-900 dark:text-white">Tablet</span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white">{stats.deviceBreakdown.tablet}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-1000" 
            style={{ width: `${stats.deviceBreakdown.tablet}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time insights into your QR code performance</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total QR Codes"
          value={stats.totalQRCodes}
          subtitle="Generated this month"
          icon={Star}
          gradient="from-blue-500 to-blue-600"
          trend={12}
        />
        <StatCard
          title="Total Scans"
          value={stats.totalScans.toLocaleString()}
          subtitle="Across all QR codes"
          icon={Eye}
          gradient="from-green-500 to-green-600"
          trend={24}
        />
        <StatCard
          title="Social Shares"
          value={stats.totalShares}
          subtitle="Shared on social media"
          icon={Share2}
          gradient="from-purple-500 to-purple-600"
          trend={8}
        />
        <StatCard
          title="Avg. Scan Rate"
          value={stats.avgScanRate}
          subtitle="Scans per QR code"
          icon={TrendingUp}
          gradient="from-orange-500 to-orange-600"
          trend={15}
        />
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PerformanceChart />
        <DeviceBreakdown />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TopPerformers />
        <RecentActivity />
      </div>

      {/* Geographic Data */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Geographic Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.geographicData.map((geo) => (
            <div key={geo.country} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="text-2xl mb-2">{geo.flag}</div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">{geo.country}</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{geo.scans}</p>
              <p className="text-xs text-gray-500">scans</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedDashboard;
