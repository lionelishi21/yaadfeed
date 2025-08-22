import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GoogleAdsenseScript } from '@/components/ads/GoogleAdsense';
import { HeaderBannerAd, MobileStickyAd, AdBlockerDetector } from '@/components/ads/AdPlacements';
import ClientProviders from '@/components/ClientProviders';

// Force dynamic rendering for the entire app
// Removed dynamic directive for static export compatibility

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YaadFeed - Jamaica\'s Premier News & Music Platform',
  description: 'Stay connected with Jamaica through comprehensive news coverage, artist profiles, event listings, and cultural insights. Your ultimate source for Jamaican news and music.',
  keywords: 'Jamaica, news, music, reggae, dancehall, artists, events, culture, Caribbean',
  authors: [{ name: 'YaadFeed Team' }],
  openGraph: {
    title: 'YaadFeed - Jamaica\'s Premier News & Music Platform',
    description: 'Stay connected with Jamaica through comprehensive news coverage, artist profiles, event listings, and cultural insights.',
    url: 'https://yaadfeed.com',
    siteName: 'YaadFeed',
    images: [
      {
        url: '/images/jamaica-flag-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'YaadFeed - Jamaica News and Music',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YaadFeed - Jamaica\'s Premier News & Music Platform',
    description: 'Stay connected with Jamaica through comprehensive news coverage, artist profiles, event listings, and cultural insights.',
    images: ['/images/jamaica-flag-bg.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <GoogleAdsenseScript />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#06b6d4" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL} />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.googletagservices.com" />
        <link rel="dns-prefetch" href="https://securepubads.g.doubleclick.net" />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-slate-50 via-white to-slate-100 text-gray-900`}>
        <ClientProviders>
          <HeaderBannerAd />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <MobileStickyAd />
          <AdBlockerDetector />
        </ClientProviders>
      </body>
    </html>
  );
}
