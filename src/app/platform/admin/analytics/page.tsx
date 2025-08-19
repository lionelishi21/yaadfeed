'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  Globe, 
  Smartphone,
  Monitor,
  MapPin,
  RefreshCw,
  Target,
  Share2
} from 'lucide-react';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: string;
  bounceRate: number;
  topPages: { page: string; views: number; percentage: number }[];
  deviceBreakdown: { device: string; percentage: number; users: number }[];
  trafficSources: { source: string; percentage: number; visitors: number }[];
  geographicData: { country: string; percentage: number; visitors: number }[];
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'traffic' | 'content' | 'audience'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [analytics] = useState<AnalyticsData>({
    pageViews: 234567,
    uniqueVisitors: 45678,
    avgSessionDuration: '3m 42s',
    bounceRate: 32.5,
    topPages: [
      { page: '/news/vybz-kartel-new-release', views: 15643, percentage: 6.7 },
      { page: '/artists/shenseea', views: 12890, percentage: 5.5 },
      { page: '/politics/tourism-record-high', views: 11234, percentage: 4.8 },
      { page: '/music/dancehall-top-10', views: 9876, percentage: 4.2 },
      { page: '/news/blue-mountain-coffee', views: 8765, percentage: 3.7 }
    ],
    deviceBreakdown: [
      { device: 'Mobile', percentage: 68, users: 31061 },
      { device: 'Desktop', percentage: 24, users: 10963 },
      { device: 'Tablet', percentage: 8, users: 3654 }
    ],
    trafficSources: [
      { source: 'Organic Search', percentage: 45, visitors: 20555 },
      { source: 'Direct', percentage: 28, visitors: 12790 },
      { source: 'Social Media', percentage: 15, visitors: 6852 },
      { source: 'Referral', percentage: 8, visitors: 3654 },
      { source: 'Email', percentage: 4, visitors: 1827 }
    ],
    geographicData: [
      { country: 'Jamaica', percentage: 42, visitors: 19185 },
      { country: 'United States', percentage: 25, visitors: 11420 },
      { country: 'United Kingdom', percentage: 12, visitors: 5481 },
      { country: 'Canada', percentage: 8, visitors: 3654 },
      { country: 'Trinidad & Tobago', percentage: 6, visitors: 2740 },
      { country: 'Barbados', percentage: 4, visitors: 1827 }
    ]
  });
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to refresh analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600">Track your website performance and user engagement</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={refreshData}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Page Views</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.pageViews.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+18% from last period</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.uniqueVisitors.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+12% from last period</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Session Duration</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.avgSessionDuration}</p>
              <p className="text-sm text-green-600 mt-1">+8% from last period</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.bounceRate}%</p>
              <p className="text-sm text-red-600 mt-1">-5% from last period</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'traffic', label: 'Traffic Sources' },
            { key: 'content', label: 'Content Performance' },
            { key: 'audience', label: 'Audience Insights' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <h2 className="text-xl font-semibold mb-2">🚀 Traffic Growth</h2>
            <p className="text-green-100 mb-4">
              Your YaadFeed platform is experiencing exceptional growth across all metrics!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">+18%</p>
                <p className="text-sm text-green-100">Page Views Growth</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">68%</p>
                <p className="text-sm text-green-100">Mobile Traffic</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">42%</p>
                <p className="text-sm text-green-100">Jamaica Visitors</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
              <div className="space-y-4">
                {analytics.deviceBreakdown.map((device) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {device.device === 'Mobile' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                      <span className="font-medium">{device.device}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-12 text-right">
                        {device.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Top Content</h3>
              <div className="space-y-3">
                {analytics.topPages.slice(0, 5).map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-sm truncate max-w-xs">{page.page}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {page.views.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'traffic' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analytics.trafficSources.map((source, index) => (
                <div key={source.source} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{source.source}</h4>
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      {index === 0 ? <Target className="w-4 h-4 text-blue-600" /> : <Globe className="w-4 h-4 text-blue-600" />}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Visitors</span>
                      <span className="text-sm font-medium">{source.visitors.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Share</span>
                      <span className="text-sm font-medium">{source.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Top Performing Content</h3>
            <div className="space-y-4">
              {analytics.topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium truncate max-w-xs">{page.page}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{page.views.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{page.percentage}% of traffic</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audience' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
            <div className="space-y-4">
              {analytics.geographicData.map((country) => (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{country.country}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${country.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-10 text-right">
                      {country.percentage}%
                    </span>
                    <span className="text-sm text-gray-500 w-16 text-right">
                      {country.visitors.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 