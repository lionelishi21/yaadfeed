'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, ArrowUpRight, Sparkles } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
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
  };

  const socials = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/yaadfeed', hoverClass: 'hover:text-blue-400' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/yaadfeed', hoverClass: 'hover:text-sky-400' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/yaadfeed', hoverClass: 'hover:text-pink-400' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/yaadfeed', hoverClass: 'hover:text-red-400' },
  ];

  return (
    <footer className="bg-gray-950 text-white">
      {/* Top divider glow */}
      <div className="h-px bg-gradient-to-r from-transparent via-logo-primary/40 to-transparent" />

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Brand — 2 cols */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-5 group">
              <div className="w-9 h-9 rounded-xl bg-logo-primary/20 border border-logo-primary/30 flex items-center justify-center">
                <span className="text-logo-primary font-black text-lg leading-none">Y</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                Yaad<span className="text-logo-primary">Feed</span>
              </span>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Jamaica's premier platform for news, music, and cultural content. Connecting the diaspora with the heartbeat of Jamaica.
            </p>

            <div className="space-y-2 mb-8">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                <span>Kingston, Jamaica</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Mail className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                <a href="mailto:hello@yaadfeed.com" className="hover:text-white transition-colors">hello@yaadfeed.com</a>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className={`w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-gray-500 ${s.hoverClass} hover:border-white/15 hover:bg-white/8 transition-all duration-200`}
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { heading: 'Platform', items: links.platform },
            { heading: 'Company', items: links.company },
            { heading: 'Support', items: links.support },
          ].map(({ heading, items }) => (
            <div key={heading}>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500 mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group"
                    >
                      {item.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {currentYear} YaadFeed. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Sparkles className="w-3 h-3 text-logo-secondary" />
            <span>Made with love for the Jamaican diaspora</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
