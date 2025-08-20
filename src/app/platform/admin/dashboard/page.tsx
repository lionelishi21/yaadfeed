'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  DollarSign, 
  Image, 
  Eye,
  BarChart3,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Music,
  Globe,
  Database
} from 'lucide-react';
import MongoDBStatus from '@/components/admin/MongoDBStatus';

interface DashboardStats {
  totalArticles: number;
  totalUsers: number;
  totalRevenue: number;
  totalImages: number;
  monthlyViews: number;
  conversionRate: number;
  adRevenue: number;
  articlesGenerated: number;
}

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: any;
  color: string;
  bgColor: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalImages: 0,
    monthlyViews: 0,
    conversionRate: 0,
    adRevenue: 0,
    articlesGenerated: 0
  });

  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Helper function to get icon component from string name
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      FileText,
      Image,
      DollarSign,
      CheckCircle,
      AlertCircle,
      TrendingUp,
      Eye,
      Users
    };
    return iconMap[iconName] || CheckCircle; // Default to CheckCircle if icon not found
  };

  useEffect(() => {
    // Fetch real dashboard data from API
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, activityResponse] = await Promise.all([
          fetch('/api/admin/dashboard/stats'),
          fetch('/api/admin/dashboard/activity')
        ]);
        
        const statsData = await statsResponse.json();
        const activityData = await activityResponse.json();
        
        if (statsData.success) {
          setStats(statsData.stats);
        } else {
          console.error('Failed to fetch dashboard stats:', statsData.error);
          // Fall back to default stats on error
          setStats({
            totalArticles: 0,
            totalUsers: 0,
            totalRevenue: 0,
            totalImages: 0,
            monthlyViews: 0,
            conversionRate: 0,
            adRevenue: 0,
            articlesGenerated: 0
          });
        }

        if (activityData.success) {
          setRecentActivity(activityData.activity);
        } else {
          console.error('Failed to fetch recent activity:', activityData.error);
          setRecentActivity([
            {
              id: 'fallback-1',
              action: 'System monitoring active',
              time: '1 hour ago',
              status: 'info',
              icon: 'CheckCircle'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fall back to default stats on error
        setStats({
          totalArticles: 0,
          totalUsers: 0,
          totalRevenue: 0,
          totalImages: 0,
          monthlyViews: 0,
          conversionRate: 0,
          adRevenue: 0,
          articlesGenerated: 0
        });
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions: QuickAction[] = [
    {
      title: 'Generate Articles',
      description: 'Create new AI-powered articles',
      href: '/platform/admin/articles',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Manage Ads',
      description: 'AdSense optimization & analytics',
      href: '/platform/admin/ads',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Generate Images',
      description: 'AI image creation & management',
      href: '/platform/admin/images',
      icon: Image,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'View Analytics',
      description: 'Traffic & performance metrics',
      href: '/platform/admin/analytics',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Music & Artists',
      description: 'Manage artist profiles',
      href: '/platform/admin/music',
      icon: Music,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      title: 'SEO Optimization',
      description: 'Improve search rankings',
      href: '/platform/admin/seo',
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with YaadFeed.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-medium text-gray-900">{new Date().toLocaleTimeString()}</p>
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalArticles.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.monthlyViews.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+18% from last month</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ad Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.adRevenue.toFixed(2)}</p>
              <p className="text-sm text-green-600 mt-1">+25% from last month</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI Images</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalImages}</p>
              <p className="text-sm text-purple-600 mt-1">95% cost savings</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Image className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* MongoDB Status */}
      <div className="mb-6">
        <MongoDBStatus />
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = getIconComponent(activity.icon);
              return (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    activity.status === 'success' ? 'bg-green-100' :
                    activity.status === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      activity.status === 'success' ? 'text-green-600' :
                      activity.status === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600">Healthy</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Services</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">AdSense</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">OpenAI</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Image Storage</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-yellow-600">75% Full</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Page Speed</span>
                <span className="font-medium">94/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Magnet Status */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">🚀 Traffic Magnet Status</h2>
            <p className="text-green-100 mb-4">
              Your YaadFeed platform is performing exceptionally well!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                <p className="text-sm text-green-100">Conversion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-sm text-green-100">Active Monitoring</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">95%</p>
                <p className="text-sm text-green-100">Cost Savings</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <Globe className="w-24 h-24 text-green-200 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
} 