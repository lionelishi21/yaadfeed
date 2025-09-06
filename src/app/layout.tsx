import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GoogleAdsenseScript } from '@/components/ads/GoogleAdsense';
import { HeaderBannerAd, MobileStickyAd, AdBlockerDetector } from '@/components/ads/AdPlacements';
import ClientProviders from '@/components/ClientProviders';

// Force dynamic rendering for the entire app
// Removed dynamic directive for static export compatibility

const inter = Inter({ subsets: ['latin'] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "YaadFeed - Jamaica's Premier News & Music Platform",
  description: 'Stay connected with Jamaica through comprehensive news coverage, artist profiles, event listings, and cultural insights. Your ultimate source for Jamaican news and music.',
  keywords: [
    'Jamaica','news','music','reggae','dancehall','artists','events','culture','Caribbean',
    'Jamaican music','dancehall news','reggae news','afrobeats','afro beats','Caribbean music',
    'Kingston','Montego Bay','Jamaican artists','Vybz Kartel','Spice','Popcaan','Koffee','Chronixx',
  ],
  authors: [{ name: 'YaadFeed Team' }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "YaadFeed - Jamaica's Premier News & Music Platform",
    description: 'Stay connected with Jamaica through comprehensive news coverage, artist profiles, event listings, and cultural insights.',
    url: SITE_URL,
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
    title: "YaadFeed - Jamaica's Premier News & Music Platform",
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
  other: {
    "google-adsense-account": "ca-pub-6524318430609026",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'YaadFeed',
    url: SITE_URL,
    logo: `${SITE_URL}/images/jamaica-flag-bg.jpg`,
    sameAs: [
      'https://twitter.com',
      'https://www.instagram.com',
      'https://www.facebook.com'
    ],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Website',
    name: 'YaadFeed',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/news?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

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
        <link rel="canonical" href={SITE_URL} />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.googletagservices.com" />
        <link rel="dns-prefetch" href="https://securepubads.g.doubleclick.net" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
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
