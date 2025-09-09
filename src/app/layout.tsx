import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
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
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon.ico', rel: 'icon' },
    ],
    shortcut: [
      { url: '/favicon/favicon.ico' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      { rel: 'manifest', url: '/favicon/site.webmanifest' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auto Ads default ON unless explicitly disabled with NEXT_PUBLIC_USE_AUTO_ADS="false"
  const useAutoAds = process.env.NEXT_PUBLIC_USE_AUTO_ADS !== 'false';
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
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6524318430609026" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#06b6d4" />
        <meta name="google-adsense-account" content="ca-pub-6524318430609026" />
        <link rel="icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="canonical" href={SITE_URL} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
                { '@type': 'ListItem', position: 2, name: 'News', item: `${SITE_URL}/news` },
                { '@type': 'ListItem', position: 3, name: 'Artists', item: `${SITE_URL}/artists` },
                { '@type': 'ListItem', position: 4, name: 'Events', item: `${SITE_URL}/events` },
                { '@type': 'ListItem', position: 5, name: 'Newsletter', item: `${SITE_URL}/newsletter` },
                { '@type': 'ListItem', position: 6, name: 'About', item: `${SITE_URL}/about` },
                { '@type': 'ListItem', position: 7, name: 'Contact', item: `${SITE_URL}/contact` },
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-slate-50 via-white to-slate-100 text-gray-900`}>
        <ClientProviders>
          {!useAutoAds && <HeaderBannerAd />}
          <main className="min-h-screen pt-16">
            {children}
          </main>
          {!useAutoAds && <MobileStickyAd />}
          {!useAutoAds && <AdBlockerDetector />}
        </ClientProviders>
      </body>
    </html>
  );
}
