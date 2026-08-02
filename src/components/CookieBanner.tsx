'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookie_consent');
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#333] z-[200] p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-300">
          We use cookies to improve your experience, analyze site traffic, and serve targeted advertisements. By continuing to use our site, you consent to our use of cookies.
          <Link href="/privacy" className="text-yard-gold hover:underline ml-2">Learn more</Link>
        </div>
        <button
          onClick={handleAccept}
          className="bg-yard-gold text-[#0A0A0A] px-6 py-2 font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors whitespace-nowrap"
        >
          Accept Cookies
        </button>
      </div>
    </div>
  );
}
