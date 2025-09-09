"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

export function GoogleAdsenseScript() {
  return (
    <Script
      async
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6524318430609026"
      crossOrigin="anonymous"
    />
  );
}

type GoogleAdsenseProps = {
  adSlot: string;
  adClient?: string;
  adFormat?: string;
  adLayout?: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function GoogleAdsense({
  adSlot,
  adClient = 'ca-pub-6524318430609026',
  adFormat = 'auto',
  adLayout,
  className,
  style,
}: GoogleAdsenseProps) {
  const insRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    try {
      // @ts-ignore
      (adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Adsense error', e);
    }
  }, []);

  return (
    <ins
      ref={insRef as any}
      className={`adsbygoogle${className ? ` ${className}` : ''}`}
      style={style || { display: 'block' }}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      {...(adLayout ? { 'data-ad-layout': adLayout } : {})}
      data-full-width-responsive="true"
    />
  );
}
