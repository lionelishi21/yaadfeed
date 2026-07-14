'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * EffectiveCPM Ad Network Components
 * Temporary alternative while Google AdSense approval is pending.
 * 
 * Ad Units:
 * 1. BannerAd1 - General banner (homepage between sections)
 * 2. BannerAd2 - Secondary banner (article pages)
 * 3. NativeAd  - Native ad with container (in-content / sidebar)
 * 4. SmartLink - Monetized link (sponsored buttons / footer)
 */

// ─── Banner Ad #1 — Best between homepage sections ───
export function EffectiveBannerAd1({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    const script = document.createElement('script');
    script.src = 'https://pl30357558.effectivecpmnetwork.com/0c/37/4a/0c374a1acbf1b10324b793a817601b67.js';
    script.async = true;
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <div className="w-full max-w-4xl">
        <p className="text-[10px] text-white/20 uppercase tracking-[1.5px] text-center mb-2">Sponsored</p>
        <div ref={containerRef} className="min-h-[90px] flex items-center justify-center" />
      </div>
    </div>
  );
}

// ─── Banner Ad #2 — Best in article pages ───
export function EffectiveBannerAd2({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    const script = document.createElement('script');
    script.src = 'https://pl30357559.effectivecpmnetwork.com/89/53/6d/89536d42a461106489c834524298956c.js';
    script.async = true;
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <div className="w-full max-w-4xl">
        <p className="text-[10px] text-white/20 uppercase tracking-[1.5px] text-center mb-2">Sponsored</p>
        <div ref={containerRef} className="min-h-[90px] flex items-center justify-center" />
      </div>
    </div>
  );
}

// ─── Native Ad with Container — Best in-content or sidebar ───
export function EffectiveNativeAd({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    const script = document.createElement('script');
    script.src = 'https://pl30357560.effectivecpmnetwork.com/dbb5da5ded09fd4d6c874d73735f5837/invoke.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <p className="text-[10px] text-white/20 uppercase tracking-[1.5px] text-center mb-2">Sponsored</p>
      <div ref={containerRef}>
        <div id="container-dbb5da5ded09fd4d6c874d73735f5837"></div>
      </div>
    </div>
  );
}

// ─── Smart Link — Monetized sponsored link/button ───
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
