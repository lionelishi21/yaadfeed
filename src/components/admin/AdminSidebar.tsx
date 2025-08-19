'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BarChart3, 
  Image, 
  DollarSign,
  Menu,
  X,
  LogOut,
  Shield,
  Newspaper,
  Music,
  TrendingUp
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/platform/admin/dashboard',
    icon: LayoutDashboard,
    description: 'Overview & Analytics'
  },
  {
    title: 'Articles',
    href: '/platform/admin/articles',
    icon: FileText,
    description: 'Content Management'
  },
  {
    title: 'Ad Management',
    href: '/platform/admin/ads',
    icon: DollarSign,
    description: 'Revenue & AdSense'
  },
  {
    title: 'Images',
    href: '/platform/admin/images',
    icon: Image,
    description: 'AI Image Generation'
  },
  {
    title: 'Analytics',
    href: '/platform/admin/analytics',
    icon: BarChart3,
    description: 'Traffic & Performance'
  },
  {
    title: 'Users',
    href: '/platform/admin/users',
    icon: Users,
    description: 'User Management'
  },
  {
    title: 'News Feed',
    href: '/platform/admin/news',
    icon: Newspaper,
    description: 'News Articles'
  },
  {
    title: 'Music & Artists',
    href: '/platform/admin/music',
    icon: Music,
    description: 'Artist Profiles'
  },
  {
    title: 'SEO & Growth',
    href: '/platform/admin/seo',
    icon: TrendingUp,
    description: 'SEO Optimization'
  },
  {
    title: 'Settings',
    href: '/platform/admin/settings',
    icon: Settings,
    description: 'System Configuration'
  }
];

interface AdminSidebarProps {
  className?: string;
}

export default function AdminSidebar({ className = '' }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/platform/admin' });
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 
        ${isCollapsed ? 'w-16' : 'w-64'} 
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out
        ${className}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">YaadFeed</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            {/* Desktop Collapse Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            >
              <Menu className="w-4 h-4" />
            </button>
            
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center space-x-3 p-3 rounded-lg transition-colors group
                  ${isActive 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-green-700' : 'text-gray-400 group-hover:text-gray-600'}`} />
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    <p className="text-xs text-gray-500 truncate">{item.description}</p>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className={`
              w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">Sign Out</span>}
          </button>
          
          {!isCollapsed && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                YaadFeed Admin v1.0
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 