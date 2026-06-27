'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, User, LogOut, Settings } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import AuthModal from '@/components/auth/AuthModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
    const handleOpenAuthModal = () => setIsAuthModalOpen(true);
    window.addEventListener('open-auth-modal', handleOpenAuthModal);
    return () => window.removeEventListener('open-auth-modal', handleOpenAuthModal);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
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
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    setShowUserMenu(false);
  };

  const UserMenu = () => (
    <div className="absolute right-0 mt-4 w-48 bg-yard-lightgray rounded shadow-lg border border-gray-800 py-2 z-50">
      <div className="px-4 py-3 border-b border-gray-800">
        <p className="text-sm font-semibold text-white">{session?.user?.name || 'User'}</p>
        <p className="text-xs text-gray-400">{session?.user?.email || ''}</p>
      </div>
      <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors" onClick={() => setShowUserMenu(false)}>
        <User className="w-4 h-4 mr-2" />
        Profile
      </Link>
      <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors" onClick={() => setShowUserMenu(false)}>
        <Settings className="w-4 h-4 mr-2" />
        Settings
      </Link>
      <button onClick={handleSignOut} className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-white/5 transition-colors">
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </button>
    </div>
  );

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[200] transition-colors duration-300 ${
        scrolled ? 'bg-yard-dark/95 backdrop-blur-md border-b border-[#1a1a1a]' : 'bg-yard-dark/80 backdrop-blur-sm border-b border-transparent'
      }`}>
        <div className="flex items-center justify-between px-4 sm:px-14 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <svg width="34" height="30" viewBox="0 0 34 30" fill="none" className="transform group-hover:scale-105 transition-transform">
              <rect width="34" height="30" rx="3" fill="#E8B84B"></rect>
              <path d="M9 7 L17 16 L25 7" stroke="#0A0A0A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"></path>
              <line x1="17" y1="16" x2="17" y2="24" stroke="#0A0A0A" strokeWidth="3.5" strokeLinecap="round"></line>
              <circle cx="9" cy="7" r="2.5" fill="#0A0A0A" opacity=".4"></circle>
            </svg>
            <span className="font-bebas text-xl tracking-[3px] text-white mt-1">YARD<span className="text-yard-gold">VYBES</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center gap-7">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[12px] font-semibold tracking-[1.1px] uppercase text-gray-300 hover:text-white transition-colors pb-1 border-b-2 border-transparent hover:border-yard-gold"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-5 flex-shrink-0">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-[#666] hover:text-white transition-colors">
              <Search className="w-[17px] h-[17px]" strokeWidth={2.5} />
            </button>

            {mounted && status === 'authenticated' ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-8 h-8 bg-yard-gold rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <span className="text-yard-dark text-sm font-bold">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </span>
                </button>
                {showUserMenu && <UserMenu />}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-yard-gold text-yard-dark font-sans text-[12px] font-bold tracking-[1px] uppercase border-none py-[9px] px-[22px] hover:bg-white transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-[#666] hover:text-white">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#666] hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-yard-gray border-t border-[#1a1a1a]">
            <div className="px-4 py-4 flex flex-col gap-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-[13px] font-semibold tracking-wide uppercase text-gray-300 hover:text-yard-gold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {status === 'authenticated' ? (
                <div className="border-t border-[#1a1a1a] pt-3 mt-1 flex flex-col gap-3">
                  <Link href="/profile" className="block text-[13px] font-semibold tracking-wide uppercase text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                  <button onClick={handleSignOut} className="block text-left text-[13px] font-semibold tracking-wide uppercase text-red-500 hover:text-red-400">Sign Out</button>
                </div>
              ) : (
                <div className="border-t border-[#1a1a1a] pt-4 mt-2">
                  <button
                    onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }}
                    className="w-full bg-yard-gold text-yard-dark font-sans text-[12px] font-bold tracking-[1px] uppercase py-[10px]"
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
          <div className="absolute inset-0 bg-yard-dark border-b border-[#1a1a1a] p-3 sm:px-14 flex items-center">
            <div className="w-full max-w-3xl mx-auto relative flex items-center">
              <Search className="absolute left-4 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles, artists, events..."
                className="w-full bg-[#111] pl-12 pr-12 py-3 border border-[#222] text-white font-sans text-sm focus:outline-none focus:border-yard-gold"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-4 text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;

