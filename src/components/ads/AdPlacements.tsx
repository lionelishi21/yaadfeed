'use client';

import { useState, useEffect } from 'react';
import GoogleAdsense from './GoogleAdsense';

// Auto Ads default ON unless explicitly disabled with NEXT_PUBLIC_USE_AUTO_ADS="false"
const AUTO_ADS = process.env.NEXT_PUBLIC_USE_AUTO_ADS !== 'false';

// Header Banner Ad (Above Navigation)
export function HeaderBannerAd() {
  if (AUTO_ADS) return null;
  useEffect(() => {
    try {
      // @ts-ignore
      (adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error('Adsense error', e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-6524318430609026"
      data-ad-slot="1234567890"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

// Sidebar Rectangle Ad
export function SidebarRectangleAd({ className = '' }: { className?: string }) {
  if (AUTO_ADS) return null;
  return (
    <div className={`sticky top-4 ${className}`}>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-xs text-gray-500 mb-2 text-center">Advertisement</p>
        <GoogleAdsense
          adSlot="1234567891" // Replace with your actual ad slot ID
          adFormat="rectangle"
          style={{ width: '300px', height: '250px' }}
          className="sidebar-rectangle-ad"
        />
      </div>
    </div>
  );
}

// In-Article Ad (Mobile Optimized)
export function InArticleAd({ 
  className = '',
  paragraphIndex = 3 
}: { 
  className?: string;
  paragraphIndex?: number;
}) {
  if (AUTO_ADS) return null;
  return (
    <div className={`my-8 ${className}`}>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-xs text-gray-500 mb-2 text-center">Advertisement</p>
        <GoogleAdsense
          adSlot="8149208204"
          adFormat="fluid"
          adLayout="in-article"
          style={{ display: 'block', textAlign: 'center' }}
          className="in-article-ad"
        />
      </div>
    </div>
  );
}

// Multiplex Ad (Recommended Content Style)
export function MultiplexAd({ className = '' }: { className?: string }) {
  if (AUTO_ADS) return null;
  return (
    <div className={`my-8 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">You might also like</h3>
      <GoogleAdsense
        adSlot="1234567893" // Replace with your actual ad slot ID
        adFormat="autorelaxed"
        className="multiplex-ad"
        style={{ minHeight: '280px' }}
      />
    </div>
  );
}

// Footer Banner Ad
export function FooterBannerAd() {
  if (AUTO_ADS) return null;
  return (
    <div className="w-full bg-gray-100 py-4 mt-8">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-xs text-gray-500 mb-2 text-center">Advertisement</p>
        <GoogleAdsense
          adSlot="1234567894" // Replace with your actual ad slot ID
          adFormat="horizontal"
          className="footer-banner-ad"
          style={{ minHeight: '90px' }}
        />
      </div>
    </div>
  );
}

// Mobile Sticky Bottom Ad
export function MobileStickyAd() {
  if (AUTO_ADS) return null;
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t">
      <div className="relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-1 right-1 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs"
        >
          ×
        </button>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '60px' }}
          data-ad-client="ca-pub-6524318430609026"
          data-ad-slot="2345678901"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}

// Native Ad Component (Blends with content)
export function NativeAd({ 
  className = '',
  title = "Recommended for you" 
}: { 
  className?: string;
  title?: string;
}) {
  if (AUTO_ADS) return null;
  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      <h4 className="text-sm font-medium text-gray-600 mb-3">{title}</h4>
      <GoogleAdsense
        adSlot="7890123456" // Replace with your ad slot ID
        adFormat="auto"
        adLayout="matched-content"
        className="native-ad"
      />
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
  if (AUTO_ADS) {
    return (
      <div className={`article-content ${className}`}>
        {content.split('\n\n').map((p, i) => (
          <p key={`paragraph-${i}`} className="mb-4">{p}</p>
        ))}
      </div>
    );
  }
  const insertAdsInContent = (content: string) => {
    const paragraphs = content.split('\n\n');
    const result = [];
    
    for (let i = 0; i < paragraphs.length; i++) {
      result.push(
        <p key={`paragraph-${i}`} className="mb-4">
          {paragraphs[i]}
        </p>
      );
      
      // Insert ads after specific paragraphs
      if (i === 2) { // After 3rd paragraph
        result.push(
          <InArticleAd key={`ad-${i}`} className="my-6" />
        );
      }
      
      if (i === Math.floor(paragraphs.length / 2)) { // Middle of article
        result.push(
          <NativeAd key={`native-${i}`} className="my-6" />
        );
      }
    }
    
    return result;
  };

  return (
    <div className={`article-content ${className}`}>
      {insertAdsInContent(content)}
      
      {/* End of article ad */}
      <div className="mt-8">
        <MultiplexAd />
      </div>
    </div>
  );
}

// Ad Blocker Detection
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
          // Ad blocker detected - handle internally
          console.log('Ad blocker detected - showing user message');
          
          // Create a simple notification
          const notification = document.createElement('div');
          notification.innerHTML = `
            <div style="
              position: fixed; 
              top: 60px; 
              right: 20px; 
              background: #1f2937; 
              color: white; 
              padding: 16px; 
              border-radius: 8px; 
              z-index: 10000;
              max-width: 300px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            ">
              <div style="font-weight: bold; margin-bottom: 8px;">
                📢 Support YaadFeed
              </div>
              <div style="font-size: 14px; margin-bottom: 12px;">
                We noticed you're using an ad blocker. Ads help us keep bringing you the latest Jamaica news and music for free!
              </div>
              <button onclick="this.parentElement.parentElement.remove()" style="
                background: #22c55e; 
                color: white; 
                border: none; 
                padding: 6px 12px; 
                border-radius: 4px; 
                cursor: pointer;
              ">
                Got it
              </button>
            </div>
          `;
          
          document.body.appendChild(notification);
          
          // Auto-remove after 10 seconds
          setTimeout(() => {
            if (notification.parentElement) {
              notification.remove();
            }
          }, 10000);
        }
        document.body.removeChild(adTest);
      }, 100);
    };
    
    detectAdBlocker();
  }, []);

  return null;
}

// Lazy Loading Ad Component
export function LazyAd({ 
  adSlot, 
  className = '',
  threshold = 0.1 
}: { 
  adSlot: string;
  className?: string;
  threshold?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref);
        }
      },
      { threshold }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return (
    <div ref={setRef} className={className}>
      {isVisible && (
        <GoogleAdsense
          adSlot={adSlot}
          adFormat="auto"
        />
      )}
    </div>
  );
} 