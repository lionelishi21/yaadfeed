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
  const { data: session, status } = useSession();

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
    <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 py-2 z-50 animate-fade-in">
      <div className="px-4 py-3 border-b border-gray-100/50">
        <p className="text-sm font-bold text-gray-900">{session?.user?.name}</p>
        <p className="text-xs text-gray-500">{session?.user?.email}</p>
      </div>
      <Link
        href="/profile"
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-purple-50 transition-all duration-200"
        onClick={() => setShowUserMenu(false)}
      >
        <User className="w-4 h-4 mr-2" />
        Profile
      </Link>
      <Link
        href="/settings"
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-purple-50 transition-all duration-200"
        onClick={() => setShowUserMenu(false)}
      >
        <Settings className="w-4 h-4 mr-2" />
        Settings
      </Link>
      <button
        onClick={handleSignOut}
        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
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
          ? 'bg-white/95 backdrop-blur-lg shadow-2xl border-b border-white/30' 
          : 'bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Enhanced Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="flex flex-col">
                   <Image src={logo} alt="Jamaica's Voice Logo" width={200} height={80} />
                </div>
              </Link>
            </div>

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-cyan-600 font-semibold transition-all duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </nav>

            {/* Enhanced Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Enhanced Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-600 hover:text-cyan-600 transition-all duration-300 hover:scale-110 relative group"
                aria-label="Search"
              >
                <Search className="w-5 h-5 group-hover:animate-pulse" />
                <span className="absolute inset-0 bg-cyan-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>

              {/* Enhanced Notifications */}
              <button
                className="p-2 text-gray-600 hover:text-cyan-600 transition-all duration-300 hover:scale-110 relative group"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 group-hover:animate-pulse" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></span>
              </button>

              {/* Enhanced Authentication Section */}
              {status === 'loading' ? (
                <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
              ) : session?.user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-cyan-600 transition-all duration-300 hover:scale-110"
                  >
                    {session.user.image ? (
                      <div className="relative">
                        <img
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-200 hover:ring-cyan-400 transition-all duration-300"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                  {showUserMenu && <UserMenu />}
                </div>
              ) : (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                >
                  <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  Sign In
                </Button>
              )}

              {/* Enhanced Subscribe Button */}
              <Link
                href="/newsletter"
                className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <Sparkles className="w-4 h-4 inline mr-2 group-hover:animate-pulse" />
                Subscribe
              </Link>
            </div>

            {/* Enhanced Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-cyan-600 transition-all duration-300 hover:scale-110"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          {isSearchOpen && (
            <div className="py-4 border-t border-gray-100/50 animate-slide-up">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search news, artists, events..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none shadow-lg backdrop-blur-sm"
                  />
                </div>
                <button className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Search
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100/50 animate-slide-up bg-white/95 backdrop-blur-lg">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-cyan-600 font-semibold py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-cyan-50 hover:to-purple-50 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsSearchOpen(!isSearchOpen)}
                      className="p-2 text-gray-600 hover:text-cyan-600 transition-all duration-300 hover:scale-110"
                      aria-label="Search"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                    
                    <button
                      className="p-2 text-gray-600 hover:text-cyan-600 transition-all duration-300 hover:scale-110 relative"
                      aria-label="Notifications"
                    >
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></span>
                    </button>
                    
                    {session?.user ? (
                      <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="p-2 text-gray-600 hover:text-cyan-600 transition-all duration-300 hover:scale-110"
                        aria-label="Account"
                      >
                        {session.user.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || 'User'}
                            className="w-6 h-6 rounded-full object-cover ring-2 ring-cyan-200"
                          />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </button>
                    ) : (
                      <Button
                        onClick={() => setIsAuthModalOpen(true)}
                        size="sm"
                        className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 text-white"
                      >
                        <Zap className="w-4 h-4 mr-1" />
                        Sign In
                      </Button>
                    )}
                  </div>
                  
                  <Link
                    href="/newsletter"
                    className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    Subscribe
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}/>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
};

export default Header;
