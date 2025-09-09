'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, Search, User, Bell, LogOut, Settings, Sparkles, Zap } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/utils';
import AuthModal from '@/components/auth/AuthModal';
import Button from '@/components/ui/Button';
import logo from '@/assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Only use session after component mounts (client-side)
  const { data: session, status } = useSession();

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for custom auth modal events
  useEffect(() => {
    const handleOpenAuthModal = () => {
      setIsAuthModalOpen(true);
    };

    window.addEventListener('open-auth-modal', handleOpenAuthModal);
    
    return () => {
      window.removeEventListener('open-auth-modal', handleOpenAuthModal);
    };
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'News', href: '/news' },
    { name: 'Music', href: '/music' },
    { name: 'Artists', href: '/artists' },
    { name: 'Events', href: '/events' },
    { name: 'Demand', href: '/demand' },
    { name: 'Newsletter', href: '/newsletter' },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    setShowUserMenu(false);
  };

  const UserMenu = () => (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md border border-gray-200 py-2 z-50">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-900">{session?.user?.name || 'User'}</p>
        <p className="text-xs text-gray-500">{session?.user?.email || ''}</p>
      </div>
      <Link
        href="/profile"
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setShowUserMenu(false)}
      >
        <User className="w-4 h-4 mr-2" />
        Profile
      </Link>
      <Link
        href="/settings"
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setShowUserMenu(false)}
      >
        <Settings className="w-4 h-4 mr-2" />
        Settings
      </Link>
      <button
        onClick={handleSignOut}
        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </button>
    </div>
  );

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-sm border-b border-gray-200' 
          : 'bg-white/95 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src={logo}
                  alt="YaadFeed Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold text-gray-900">YaadFeed</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-logo-primary font-medium transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Menu */}
              {mounted && status === 'authenticated' ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-logo-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {session?.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </button>
                  {showUserMenu && <UserMenu />}
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-logo-primary hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {status === 'authenticated' ? (
                <div className="border-t border-gray-200 pt-2">
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-gray-700 hover:text-logo-primary hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-2">
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-logo-primary hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="absolute inset-0 bg-white border-b border-gray-200 p-4">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles, artists, events..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-logo-primary/30 focus:border-logo-primary"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;
