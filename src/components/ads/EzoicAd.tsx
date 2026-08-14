'use client';

import { useEffect } from 'react';

interface EzoicAdProps {
  className?: string;
}

export default function EzoicAd({ className = '' }: EzoicAdProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const win = window as any;
        win.ezstandalone = win.ezstandalone || {};
        win.ezstandalone.cmd = win.ezstandalone.cmd || [];
        win.ezstandalone.cmd.push(function () {
          if (typeof win.ezstandalone.showAds === 'function') {
            win.ezstandalone.showAds({});
          }
        });
      }
    } catch (e) {
      console.error('Ezoic showAds execution error:', e);
    }
  }, []);

  return (
    <div className={`ezoic-ad-unit my-6 text-center ${className}`}>
      <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">
        Advertisement
      </span>
    </div>
  );
}
