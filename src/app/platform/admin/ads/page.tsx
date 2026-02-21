'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
// Using stubs to reduce bundle size
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from '@/lib/stubs/chart';
import { Line, Pie } from '@/lib/stubs/react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

interface AdUnit {
  id: string;
  name: string;
  adSlot: string;
  placement: string;
  format: string;
  active: boolean;
  ctr: number;
  revenue: number;
  impressions: number;
  clicks: number;
}

interface AdAnalytics {
  totalRevenue: number;
  totalImpressions: number;
  totalClicks: number;
  averageCTR: number;
  rpm: number;
  topPerformingAds: AdUnit[];
  revenueData: { date: string; revenue: number }[];
  placementPerformance: { placement: string; revenue: number }[];
}

export default function AdManagementPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'units' | 'analytics' | 'optimization'>('overview');
  const [adUnits, setAdUnits] = useState<AdUnit[]>([]);
  const [analytics, setAnalytics] = useState<AdAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdData();
  }, []);

  const fetchAdData = async () => {
    try {
      // Simulated data - replace with actual API calls
      const mockAdUnits: AdUnit[] = [
        {
          id: '1',
          name: 'Header Banner',
          adSlot: '1234567890',
          placement: 'header',
          format: 'horizontal',
          active: true,
          ctr: 2.5,
          revenue: 156.78,
          impressions: 25000,
          clicks: 625
        },
        {
          id: '2',
          name: 'Sidebar Rectangle',
          adSlot: '2345678901',
          placement: 'sidebar',
          format: 'rectangle',
          active: true,
          ctr: 1.8,
          revenue: 98.45,
          impressions: 18000,
          clicks: 324
        },
        {
          id: '3',
          name: 'In-Article Mobile',
          adSlot: '3456789012',
          placement: 'in-article',
          format: 'auto',
          active: true,
          ctr: 3.2,
          revenue: 234.67,
          impressions: 30000,
          clicks: 960
        },
        {
          id: '4',
          name: 'Footer Banner',
          adSlot: '5678901234',
          placement: 'footer',
          format: 'horizontal',
          active: false,
          ctr: 1.2,
          revenue: 45.23,
          impressions: 8000,
          clicks: 96
        }
      ];

      const mockAnalytics: AdAnalytics = {
        totalRevenue: 534.13,
        totalImpressions: 81000,
        totalClicks: 2005,
        averageCTR: 2.47,
        rpm: 6.59,
        topPerformingAds: mockAdUnits.slice(0, 3),
        revenueData: [
          { date: '2025-01-01', revenue: 45.23 },
          { date: '2025-01-02', revenue: 67.89 },
          { date: '2025-01-03', revenue: 89.45 },
          { date: '2025-01-04', revenue: 123.67 },
          { date: '2025-01-05', revenue: 156.78 },
          { date: '2025-01-06', revenue: 189.34 },
          { date: '2025-01-07', revenue: 234.67 }
        ],
        placementPerformance: [
          { placement: 'in-article', revenue: 234.67 },
          { placement: 'header', revenue: 156.78 },
          { placement: 'sidebar', revenue: 98.45 },
          { placement: 'footer', revenue: 45.23 }
        ]
      };

      setAdUnits(mockAdUnits);
      setAnalytics(mockAnalytics);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch ad data:', error);
      setLoading(false);
    }
  };

  const toggleAdUnit = async (id: string) => {
    setAdUnits(prev => 
      prev.map(unit => 
        unit.id === id ? { ...unit, active: !unit.active } : unit
      )
    );
  };

  const revenueChartData = {
    labels: analytics?.revenueData.map(d => d.date) || [],
    datasets: [
      {
        label: 'Daily Revenue ($)',
        data: analytics?.revenueData.map(d => d.revenue) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const placementPieData = {
    labels: analytics?.placementPerformance.map(p => p.placement) || [],
    datasets: [
      {
        data: analytics?.placementPerformance.map(p => p.revenue) || [],
        backgroundColor: [
          '#ef4444',
          '#f97316',
          '#eab308',
          '#22c55e',
          '#3b82f6',
          '#8b5cf6',
        ],
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ad management data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AdSense Management</h1>
        <p className="mt-2 text-gray-600">Optimize your ad revenue with advanced analytics and controls</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'units', label: 'Ad Units' },
            { key: 'analytics', label: 'Analytics' },
            { key: 'optimization', label: 'Optimization' },
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

      {/* Overview Tab */}
      {activeTab === 'overview' && analytics && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-600">${analytics.totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-gray-400">Last 7 days</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Impressions</h3>
              <p className="text-2xl font-bold text-blue-600">{analytics.totalImpressions.toLocaleString()}</p>
              <p className="text-sm text-gray-400">+12% from last week</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Clicks</h3>
              <p className="text-2xl font-bold text-purple-600">{analytics.totalClicks.toLocaleString()}</p>
              <p className="text-sm text-gray-400">+8% from last week</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Average CTR</h3>
              <p className="text-2xl font-bold text-orange-600">{analytics.averageCTR}%</p>
              <p className="text-sm text-gray-400">Above industry avg</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">RPM</h3>
              <p className="text-2xl font-bold text-red-600">${analytics.rpm}</p>
              <p className="text-sm text-gray-400">Revenue per mille</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
              <Line data={revenueChartData} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Revenue by Placement</h3>
              <Pie data={placementPieData} />
            </div>
          </div>
        </div>
      )}

      {/* Ad Units Tab */}
      {activeTab === 'units' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Ad Units Management</h3>
              <p className="text-gray-600">Configure and monitor your ad placements</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ad Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Placement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adUnits.map((unit) => (
                    <tr key={unit.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{unit.name}</div>
                          <div className="text-sm text-gray-500">Slot: {unit.adSlot}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {unit.placement}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>CTR: {unit.ctr}%</div>
                        <div className="text-gray-500">{unit.impressions.toLocaleString()} impressions</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ${unit.revenue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          unit.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {unit.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => toggleAdUnit(unit.id)}
                          className={`mr-2 px-3 py-1 rounded text-xs font-medium ${
                            unit.active
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {unit.active ? 'Disable' : 'Enable'}
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Top Performing Ad Units</h3>
            <div className="space-y-4">
              {analytics.topPerformingAds.map((ad, index) => (
                <div key={ad.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium">{ad.name}</h4>
                      <p className="text-sm text-gray-500">{ad.placement} • CTR: {ad.ctr}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${ad.revenue.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{ad.clicks} clicks</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Optimization Tab */}
      {activeTab === 'optimization' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Revenue Optimization Recommendations</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-green-800">High-performing placement detected</h4>
                <p className="text-sm text-gray-600">In-article ads are generating 44% of your revenue. Consider adding more in-article placements.</p>
                <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                  Add In-Article Ads
                </button>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium text-yellow-800">Low CTR Alert</h4>
                <p className="text-sm text-gray-600">Footer banner has low CTR (1.2%). Consider A/B testing different formats.</p>
                <button className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700">
                  Start A/B Test
                </button>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-blue-800">Mobile optimization opportunity</h4>
                <p className="text-sm text-gray-600">68% of your traffic is mobile. Enable sticky mobile ads for better revenue.</p>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Enable Mobile Ads
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Auto-Optimization Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto Ad Insertion</h4>
                  <p className="text-sm text-gray-600">Automatically insert ads in optimal positions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Lazy Loading</h4>
                  <p className="text-sm text-gray-600">Load ads only when visible to improve page speed</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Ad Blocker Detection</h4>
                  <p className="text-sm text-gray-600">Show messages to users with ad blockers</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 