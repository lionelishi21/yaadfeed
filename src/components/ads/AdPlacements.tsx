'use client';

import { useState, useEffect } from 'react';
import EzoicAd from './EzoicAd';

// Header Banner Ad (Above Navigation / Content Top)
export function HeaderBannerAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full max-w-7xl mx-auto px-4 py-2 ${className}`}>
      <EzoicAd />
    </div>
  );
}

// Sidebar Rectangle Ad
export function SidebarRectangleAd({ className = '' }: { className?: string }) {
  return (
    <div className={`sticky top-28 ${className}`}>
      <div className="bg-[#090909] p-4 rounded-xl border border-white/10 text-center">
        <EzoicAd />
      </div>
    </div>
  );
}

// In-Article Ad (Between Paragraphs)
export function InArticleAd({ className = '' }: { className?: string }) {
  return (
    <div className={`my-8 ${className}`}>
      <div className="bg-[#090909]/60 p-4 rounded-lg border border-white/5">
        <EzoicAd />
      </div>
    </div>
  );
}

// Multiplex Ad (Recommended Content Style)
export function MultiplexAd({ className = '' }: { className?: string }) {
  return (
    <div className={`my-8 ${className}`}>
      <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-4">
        You Might Also Like
      </h3>
      <div className="bg-[#090909] p-4 rounded-xl border border-white/10">
        <EzoicAd />
      </div>
    </div>
  );
}

// Footer Banner Ad (Bottom of Page)
export function FooterBannerAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full bg-[#050505] py-4 mt-8 border-t border-white/5 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <EzoicAd />
      </div>
    </div>
  );
}

// Mobile Sticky Bottom Ad
export function MobileStickyAd() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (!isMobile || !isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0B0B] border-t border-white/10 p-2 shadow-2xl">
      <div className="relative max-w-md mx-auto">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-3 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10"
        >
          ×
        </button>
        <EzoicAd className="my-0" />
      </div>
    </div>
  );
}

// Native Ad Component
export function NativeAd({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-[#090909] rounded-lg border border-white/10 p-4 ${className}`}>
      <EzoicAd />
    </div>
  );
}

// Auto-Inserting Article Ads
export function ArticleWithAds({
  content,
  className = ''
}: {
  content: string;
  className?: string;
}) {
  const paragraphs = content.split('\n\n');
  const midPoint = Math.floor(paragraphs.length / 2);

  return (
    <div className={`article-content ${className}`}>
      {paragraphs.map((p, i) => (
        <div key={`p-wrapper-${i}`}>
          <p className="mb-4">{p}</p>
          {i === 1 && <InArticleAd />}
          {i === midPoint && i > 1 && <InArticleAd />}
        </div>
      ))}
      <div className="mt-8">
        <EzoicAd />
      </div>
    </div>
  );
}

// Ad Blocker Detector
export function AdBlockerDetector() {
  useEffect(() => {
    const detectAdBlocker = () => {
      const adTest = document.createElement('div');
      adTest.innerHTML = '&nbsp;';
      adTest.className = 'adsbox';
      adTest.style.position = 'absolute';
      adTest.style.left = '-9999px';
      document.body.appendChild(adTest);

      setTimeout(() => {
        if (adTest.offsetHeight === 0) {
          console.log('Ad blocker detected');
        }
        if (adTest.parentElement) {
          document.body.removeChild(adTest);
        }
      }, 100);
    };

    detectAdBlocker();
  }, []);

  return null;
}