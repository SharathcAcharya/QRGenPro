import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Users, Globe, Clock, Calendar, Download, ArrowUpRight, Filter, QrCode, Plus } from 'lucide-react';

// Helper functions for real data processing
const getDailyData = (history, days = 7) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
    
    const count = history.filter(item => {
      const itemDate = new Date(item.timestamp || item.createdAt || item.date || 0);
      return itemDate >= dayStart && itemDate <= dayEnd;
    }).length;

    data.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      count: count
    });
  }
  
  return data;
};

const getDeviceData = (history) => {
  const devices = { Mobile: 0, Desktop: 0, Tablet: 0 };
  
  history.forEach(item => {
    if (item.device) {
      if (item.device.includes('Mobile') || item.device.includes('mobile')) {
        devices.Mobile++;
      } else if (item.device.includes('Tablet') || item.device.includes('tablet')) {
        devices.Tablet++;
      } else {
        devices.Desktop++;
      }
    } else {
      // Default to desktop if no device data
      devices.Desktop++;
    }
  });
  
  // Convert to array format
  return Object.entries(devices).map(([name, value]) => ({ name, value }));
};

const getCountryData = (history) => {
  const countries = {};
  
  history.forEach(item => {
    if (item.country) {
      countries[item.country] = (countries[item.country] || 0) + 1;
    } else {
      countries['Unknown'] = (countries['Unknown'] || 0) + 1;
    }
  });
  
  // Sort by count and take top 5
  const sortedCountries = Object.entries(countries)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  
  // Calculate remaining countries as "Others"
  const otherCount = history.length - sortedCountries.reduce((acc, [, count]) => acc + count, 0);
  
  // Convert to array format and add "Others" if needed
  const result = sortedCountries.map(([name, value]) => ({ name, value }));
  if (otherCount > 0) {
    result.push({ name: 'Others', value: otherCount });
  }
  
  return result;
};

// Helper to get recent activity from QR history
const getRecentActivity = (history, scans, downloads) => {
  // Combine all activities
  const allActivities = [
    ...history.map(item => ({
      type: 'create',
      qrName: item.name || getNameFromURL(item.url),
      timestamp: item.timestamp || item.createdAt || Date.now(),
      device: item.device || 'Desktop',
      location: item.country || 'Unknown'
    })),
    ...scans.map(item => ({
      type: 'scan',
      qrName: item.name || getNameFromURL(item.url),
      timestamp: item.timestamp || item.createdAt || Date.now(),
      device: item.device || 'Mobile',
      location: item.country || 'Unknown'
    })),
    ...downloads.map(item => ({
      type: 'download',
      qrName: item.name || getNameFromURL(item.url),
      timestamp: item.timestamp || item.createdAt || Date.now(),
      device: item.device || 'Desktop',
      location: item.country || 'Unknown'
    }))
  ];
  
  // Sort by timestamp (newest first) and take the top 5
  return allActivities
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5)
    .map(activity => ({
      ...activity,
      time: getTimeAgo(activity.timestamp)
    }));
};

// Helper to get top performing QR codes
const getTopPerformingQRs = (history, scans) => {
  // Group scans by QR code URL or ID
  const qrCounts = {};
  
  scans.forEach(scan => {
    const key = scan.url || scan.id;
    if (key) {
      qrCounts[key] = (qrCounts[key] || 0) + 1;
    }
  });
  
  // If no scans, use history as a fallback
  if (Object.keys(qrCounts).length === 0) {
    history.forEach(item => {
      const key = item.url || item.id;
      if (key) {
        qrCounts[key] = (qrCounts[key] || 0) + 1;
      }
    });
  }
  
  // Get names from history for each URL
  const qrNames = {};
  history.forEach(item => {
    const key = item.url || item.id;
    if (key) {
      qrNames[key] = item.name || getNameFromURL(item.url);
    }
  });
  
  // Calculate growth (mock data but based on real counts)
  const calculateGrowth = (count) => {
    // Simulate growth based on count
    return parseFloat((5 + count * 0.5 + Math.random() * 10).toFixed(1));
  };
  
  // Convert to array, sort by count, and take top 5
  return Object.entries(qrCounts)
    .map(([key, count]) => ({
      key,
      name: qrNames[key] || getNameFromURL(key),
      scans: count,
      growth: calculateGrowth(count)
    }))
    .sort((a, b) => b.scans - a.scans)
    .slice(0, 5);
};

// Helper to get a readable name from a URL
const getNameFromURL = (url) => {
  if (!url) return 'Unnamed QR';
  
  try {
    const urlObj = new URL(url);
    // If it's a website, use the hostname
    const hostname = urlObj.hostname.replace('www.', '');
    
    // Check if it's a common domain
    if (hostname.includes('facebook.com')) return 'Facebook Page';
    if (hostname.includes('instagram.com')) return 'Instagram Profile';
    if (hostname.includes('linkedin.com')) return 'LinkedIn Profile';
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'Twitter Profile';
    if (hostname.includes('youtube.com')) return 'YouTube Video';
    if (hostname.includes('github.com')) return 'GitHub Repository';
    
    // Use the domain name
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }
    
    return hostname;
  } catch (_unused) {
    // If not a valid URL, return a portion of the text
    return url.substring(0, 20) + '...';
  }
};

// Helper to get time ago string
const getTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
  
  const months = Math.floor(days / 30);
  return `${months} month${months !== 1 ? 's' : ''} ago`;
};

const QREnhancedAnalytics = () => {
  const [dailyData, setDailyData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [totalScans, setTotalScans] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [topQRCodes, setTopQRCodes] = useState([]);

  useEffect(() => {
    // Load real data from localStorage
    const history = JSON.parse(localStorage.getItem('qr-history') || '[]');
    const scans = JSON.parse(localStorage.getItem('qr-scans') || '[]');
    const downloads = JSON.parse(localStorage.getItem('qr-downloads') || '[]');
    
    // Set days range based on timeRange
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    
    // Process daily data
    setDailyData(getDailyData(history, days));
    
    // Process device data
    setDeviceData(getDeviceData(scans.length > 0 ? scans : history));
    
    // Process country data
    setCountryData(getCountryData(scans.length > 0 ? scans : history));
    
    // Calculate total scans
    setTotalScans(scans.length || history.length);
    
    // Calculate total downloads
    setTotalDownloads(downloads.length);
    
    // Calculate conversion rate (if we have both scans and some action like downloads)
    if (scans.length > 0 && downloads.length > 0) {
      setConversionRate(Math.round((downloads.length / scans.length) * 100));
    } else if (history.length > 0 && downloads.length > 0) {
      setConversionRate(Math.round((downloads.length / history.length) * 100));
    } else {
      // Default conversion rate if we can't calculate
      setConversionRate(0);
    }
    
    // Process recent activity
    setRecentActivity(getRecentActivity(history, scans, downloads));
    
    // Process top performing QR codes
    setTopQRCodes(getTopPerformingQRs(history, scans));
  }, [timeRange]);

  // Calculate max value for daily data to normalize chart heights
  const maxDailyCount = Math.max(...dailyData.map(item => item.count));

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">QR Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track performance and engagement metrics of your QR codes
          </p>
        </div>
        
        <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              timeRange === 'week' 
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              timeRange === 'month' 
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              timeRange === 'year' 
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-none">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 font-medium">Total Scans</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalScans}</h3>
              {totalScans > 0 && (
                <p className="text-green-600 dark:text-green-400 text-sm font-medium mt-2 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  Active QR codes
                </p>
              )}
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-800/30 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-none">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 font-medium">Conversion Rate</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{conversionRate}%</h3>
              {conversionRate > 0 && (
                <p className="text-green-600 dark:text-green-400 text-sm font-medium mt-2 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  Scans to downloads
                </p>
              )}
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-800/30 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-none">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 font-medium">Total Downloads</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalDownloads}</h3>
              {totalDownloads > 0 && (
                <p className="text-green-600 dark:text-green-400 text-sm font-medium mt-2 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  {((totalDownloads / Math.max(totalScans, 1)) * 100).toFixed(1)}% of scans
                </p>
              )}
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-800/30 rounded-xl">
              <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Scans Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Daily Scans
            </h3>
            
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          
          <div className="h-60 flex items-end space-x-2">
            {dailyData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full">
                  <div 
                    className="w-full bg-blue-500 dark:bg-blue-600 rounded-t-md group-hover:bg-blue-600 dark:group-hover:bg-blue-500 transition-all duration-200"
                    style={{ height: `${(item.count / maxDailyCount) * 180}px` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count} scans
                    </div>
                  </div>
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-2">
                  {item.date}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Device Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
              Device Distribution
            </h3>
            
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-around h-60">
            <div className="relative w-40 h-40">
              {deviceData.length === 0 || deviceData.every(item => item.value === 0) ? (
                <div className="flex items-center justify-center h-full w-full text-gray-400 dark:text-gray-500 text-sm">
                  No device data available
                </div>
              ) : (
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {deviceData.map((entry, index) => {
                    const total = deviceData.reduce((sum, item) => sum + item.value, 0);
                    
                    // Handle case when total is zero to prevent NaN values
                    if (total === 0) {
                      return null;
                    }
                    
                    const percentage = (entry.value / total) * 100;
                    
                    // Calculate segments for the donut chart
                    let previousPercentage = 0;
                    for (let i = 0; i < index; i++) {
                      previousPercentage += (deviceData[i].value / total) * 100;
                    }
                    
                    const startAngle = (previousPercentage / 100) * 360;
                    const endAngle = ((previousPercentage + percentage) / 100) * 360;
                    
                    // Convert angles to radians and calculate coordinates
                    const startRad = (startAngle - 90) * (Math.PI / 180);
                    const endRad = (endAngle - 90) * (Math.PI / 180);
                    
                    const x1 = 50 + 40 * Math.cos(startRad);
                    const y1 = 50 + 40 * Math.sin(startRad);
                    const x2 = 50 + 40 * Math.cos(endRad);
                    const y2 = 50 + 40 * Math.sin(endRad);
                    
                    // Create the arc path
                    const largeArcFlag = percentage > 50 ? 1 : 0;
                    const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                    
                    const colors = ['#8b5cf6', '#3b82f6', '#06b6d4'];
                    
                    return (
                      <path
                        key={index}
                        d={pathData}
                        fill={colors[index % colors.length]}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        <title>{entry.name}: {entry.value} ({percentage.toFixed(1)}%)</title>
                      </path>
                    );
                  })}
                  <circle cx="50" cy="50" r="25" fill="white" className="dark:fill-gray-800" />
                </svg>
              )}
            </div>
            
            <div className="space-y-3 mt-4 md:mt-0">
              {deviceData.length === 0 || deviceData.every(item => item.value === 0) ? (
                <div className="text-gray-400 dark:text-gray-500 text-sm">
                  No device data available
                </div>
              ) : (
                deviceData.map((entry, index) => {
                  const colors = ['bg-purple-500', 'bg-blue-500', 'bg-cyan-500'];
                  const total = deviceData.reduce((sum, item) => sum + item.value, 0);
                  
                  // Handle case when total is zero to prevent NaN values
                  if (total === 0) {
                    return null;
                  }
                  
                  const percentage = ((entry.value / total) * 100).toFixed(1);
                
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {entry.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {percentage}% ({entry.value})
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        
        {/* Geographic Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Globe className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
              Geographic Distribution
            </h3>
            
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {countryData.map((entry, index) => {
              const total = countryData.reduce((sum, item) => sum + item.value, 0);
              const percentage = (entry.value / total) * 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {entry.name}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {entry.value} ({percentage.toFixed(1)}%)
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Top Performing QR Codes */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" />
              Top Performing QR Codes
            </h3>
            
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {topQRCodes.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.scans} scans
                    </div>
                  </div>
                </div>
                <div className="text-green-500 dark:text-green-400 text-sm font-medium flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  {item.growth}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Activity Feed */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Recent Activity
          </h3>
        </div>
        
        <div className="space-y-6">
          {recentActivity.map((activity, index) => {
            const getActivityIcon = (type) => {
              switch (type) {
                case 'scan': return <QrCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
                case 'create': return <Plus className="w-4 h-4 text-green-600 dark:text-green-400" />;
                case 'download': return <Download className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
                default: return <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
              }
            };
            
            const getActivityColor = (type) => {
              switch (type) {
                case 'scan': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
                case 'create': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
                case 'download': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
                default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
              }
            };
            
            return (
              <div key={index} className="flex">
                <div className="mr-4 flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getActivityColor(activity.type)}`}>
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {activity.qrName}
                  </p>
                  <div className="flex mt-1 space-x-4 text-xs text-gray-600 dark:text-gray-400">
                    {activity.device !== '-' && (
                      <div className="flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1 text-gray-500 dark:text-gray-400" />
                        {activity.device}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Globe className="w-3.5 h-3.5 mr-1 text-gray-500 dark:text-gray-400" />
                      {activity.location}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QREnhancedAnalytics;
