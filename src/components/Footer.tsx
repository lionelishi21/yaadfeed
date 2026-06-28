'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'News', href: '/news' },
      { name: 'Artists', href: '/artists' },
      { name: 'Events', href: '/events' },
      { name: 'Newsletter', href: '/newsletter' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Media Kit', href: '/media-kit' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
    categories: [
      { name: 'Politics', href: '/news?category=politics' },
      { name: 'Entertainment', href: '/news?category=entertainment' },
      { name: 'Sports', href: '/news?category=sports' },
      { name: 'Business', href: '/news?category=business' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, href: 'https://facebook.com/yaadfeed', color: 'hover:text-yard-gold' },
    { name: 'Twitter', icon: FaTwitter, href: 'https://twitter.com/yaadfeed', color: 'hover:text-yard-gold' },
    { name: 'Instagram', icon: FaInstagram, href: 'https://instagram.com/yaadfeed', color: 'hover:text-yard-gold' },
    { name: 'YouTube', icon: FaYoutube, href: 'https://youtube.com/yaadfeed', color: 'hover:text-yard-gold' },
  ];

  return (
    <footer className="bg-yard-gray text-white border-t border-[#1a1a1a]">
      {/* Newsletter Signup Section */}
      <div className="bg-yard-dark py-16 border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="font-bebas text-4xl tracking-wide text-white mb-4">NEVER MISS A BEAT</h3>
            <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto font-sans">
              Subscribe to our newsletter for exclusive content, breaking news, and the latest from Jamaica's vibrant culture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-[#111] border border-[#222] text-white font-sans text-sm focus:outline-none focus:border-yard-gold rounded-none"
              />
              <button className="bg-yard-gold text-yard-dark font-sans text-[12px] font-bold tracking-[1px] uppercase border-none py-[14px] px-[30px] hover:bg-white transition-colors">
                Subscribe Free
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-4">Free forever. No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-6 group">
                <svg width="34" height="30" viewBox="0 0 34 30" fill="none">
                  <rect width="34" height="30" rx="3" fill="#E8B84B"></rect>
                  <path d="M9 7 L17 16 L25 7" stroke="#0A0A0A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"></path>
                  <line x1="17" y1="16" x2="17" y2="24" stroke="#0A0A0A" strokeWidth="3.5" strokeLinecap="round"></line>
                  <circle cx="9" cy="7" r="2.5" fill="#0A0A0A" opacity=".4"></circle>
                </svg>
                <span className="font-bebas text-xl tracking-[3px] text-white mt-1">YARD<span className="text-yard-gold">VYBES</span></span>
              </div>
              <p className="text-gray-400 mb-8 max-w-xs text-sm leading-relaxed">
                Jamaica's premier platform for news, music, and cultural content. 
                Connecting the diaspora with the heartbeat of Jamaica.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 text-sm text-gray-500">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-yard-gold" />
                  <span>Kingston, Jamaica</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-yard-gold" />
                  <span>hello@yardvybes.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-yard-gold" />
                  <span>+1 (876) 555-YARD</span>
                </div>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="font-bebas tracking-wider text-xl text-white mb-5">PLATFORM</h4>
              <ul className="space-y-3">
                {footerLinks.platform.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-yard-gold transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-bebas tracking-wider text-xl text-white mb-5">COMPANY</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-yard-gold transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-bebas tracking-wider text-xl text-white mb-5">SUPPORT</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-yard-gold transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-bebas tracking-wider text-xl text-white mb-5">CATEGORIES</h4>
              <ul className="space-y-3">
                {footerLinks.categories.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-yard-gold transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-[#1a1a1a] mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-500 text-sm">
                © {currentYear} YardVybes. All rights reserved.
              </div>
              
              {/* Social Links */}
              <div className="flex gap-5">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-500 ${social.color} transition-colors`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
