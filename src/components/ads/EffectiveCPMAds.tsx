'use client';

import React from 'react';

/**
 * EffectiveCPM Ad Network Components
 * Using iframes to prevent React DOM conflicts and allow document.write()
 * which many third-party ad networks require.
 */

export function EffectiveBannerAd1({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full flex flex-col items-center justify-center ${className}`}>
      <p className="text-[10px] text-white/20 uppercase tracking-[1.5px] text-center mb-2">Sponsored</p>
      <iframe
        src="/ads/banner1.html"
        width="100%"
        height="250"
        style={{ border: 'none', overflow: 'hidden', maxWidth: '300px' }}
        scrolling="no"
        title="Advertisement"
      />
    </div>
  );
}

export function EffectiveBannerAd2({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full flex flex-col items-center justify-center ${className}`}>
      <p className="text-[10px] text-white/20 uppercase tracking-[1.5px] text-center mb-2">Sponsored</p>
      <iframe
        src="/ads/banner2.html"
        width="100%"
        height="250"
        style={{ border: 'none', overflow: 'hidden', maxWidth: '300px' }}
        scrolling="no"
        title="Advertisement"
      />
    </div>
  );
}

export function EffectiveNativeAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full ${className}`}>
      <p className="text-[10px] text-white/20 uppercase tracking-[1.5px] text-center mb-2">Sponsored</p>
      <iframe
        src="/ads/native.html"
        width="100%"
        height="250"
        style={{ border: 'none', overflow: 'hidden' }}
        scrolling="no"
        title="Advertisement"
      />
    </div>
  );
}

const SMART_LINK_URL = 'https://www.effectivecpmnetwork.com/bq9t6rgsg?key=6e361d111ba7846a44c39319d5ea94b8';

export function EffectiveSmartLink({ 
  className = '',
  children,
  variant = 'button'
}: { 
  className?: string;
  children?: React.ReactNode;
  variant?: 'button' | 'text' | 'card';
}) {
  if (variant === 'card') {
    return (
      <a
        href={SMART_LINK_URL}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`block border border-yard-gold/20 bg-yard-gold/5 p-5 hover:bg-yard-gold/10 transition-colors ${className}`}
      >
        <div className="text-[9px] text-yard-gold/60 uppercase tracking-[1.5px] mb-2">Sponsored</div>
        <div className="font-bebas text-[22px] text-white tracking-[0.5px] mb-1">
          {children || 'Exclusive Deals & Offers'}
        </div>
        <div className="text-[12px] text-[#666]">Check out the latest promotions →</div>
      </a>
    );
  }

  if (variant === 'text') {
    return (
      <a
        href={SMART_LINK_URL}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`text-yard-gold hover:text-yard-gold/80 transition-colors text-sm ${className}`}
      >
        {children || 'Sponsored Content →'}
      </a>
    );
  }

  return (
    <a
      href={SMART_LINK_URL}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-block bg-yard-gold/10 border border-yard-gold/30 text-yard-gold text-[11px] font-bold tracking-[1px] uppercase px-5 py-2.5 hover:bg-yard-gold/20 transition-colors ${className}`}
    >
      {children || 'Special Offers →'}
    </a>
  );
}
