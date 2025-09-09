"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

export function GoogleAdsenseScript() {
  return (
    <script
      async
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
    const ensureScriptLoaded = (): Promise<void> => {
      return new Promise((resolve) => {
        const w = window as any;
        // If adsbygoogle array is present, assume script is ready or will be soon
        if (w.adsbygoogle && Array.isArray(w.adsbygoogle)) {
          resolve();
          return;
        }
        // Load script if not present
        const existing = document.querySelector('script[data-yaadfeed-adsbygoogle]') as HTMLScriptElement | null;
        if (existing) {
          existing.addEventListener('load', () => resolve());
          // Also resolve after a short delay in case load already fired
          setTimeout(() => resolve(), 500);
          return;
        }
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
        script.crossOrigin = 'anonymous';
        script.setAttribute('data-yaadfeed-adsbygoogle', 'true');
        script.addEventListener('load', () => resolve());
        document.head.appendChild(script);
        // Fallback resolve
        setTimeout(() => resolve(), 1500);
      });
    };

    const tryPushAd = () => {
      try {
        const el = insRef.current as any;
        if (!el) return false;
        const width = (el as HTMLElement).offsetWidth;
        if (!width || width < 10) return false;
        // @ts-ignore
        (adsbygoogle = (window as any).adsbygoogle || []).push({});
        return true;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Adsense error', e);
        return false;
      }
    };

    let observer: IntersectionObserver | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let cancelled = false;

    ensureScriptLoaded().then(() => {
      if (cancelled) return;
      const el = insRef.current as any;
      if (!el) return;

      const attempt = () => {
        if (cancelled) return;
        if (tryPushAd()) {
          // success, disconnect observers
          observer?.disconnect();
          resizeObserver?.disconnect();
        }
      };

      // Observe visibility
      observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          attempt();
        }
      }, { threshold: 0.01 });
      observer.observe(el);

      // Also observe size changes to avoid width=0 error
      if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(() => attempt());
        resizeObserver.observe(el);
      }

      // Fallback attempts
      setTimeout(attempt, 500);
      setTimeout(attempt, 1500);
      window.addEventListener('load', attempt, { once: true });
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
      resizeObserver?.disconnect();
    };
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
      {...(adFormat === 'fluid' ? {} : { 'data-full-width-responsive': 'true' })}
    />
  );
}
