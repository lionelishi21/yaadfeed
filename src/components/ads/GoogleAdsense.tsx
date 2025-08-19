'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface GoogleAdsenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal' | 'autorelaxed';
  adLayout?: string;
  adLayoutKey?: string;
  className?: string;
  style?: React.CSSProperties;
  responsive?: boolean;
  fullWidthResponsive?: boolean;
  adTest?: 'on' | 'off';
}

export default function GoogleAdsense({
  adSlot,
  adFormat = 'auto',
  adLayout,
  adLayoutKey,
  className = '',
  style = {},
  responsive = true,
  fullWidthResponsive = true,
  adTest = 'off'
}: GoogleAdsenseProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (error) {
        console.error('Error loading AdSense ad:', error);
      }
    }
  }, []);

  const adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;

  if (!adClient) {
    // Silently return null instead of showing a warning
    return null;
  }

  return (
    <div className={`adsense-wrapper ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive={fullWidthResponsive}
        data-adtest={adTest}
      />
    </div>
  );
}

// Global AdSense Script Component
export function GoogleAdsenseScript() {
  const adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
  
  if (!adClient) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
} 