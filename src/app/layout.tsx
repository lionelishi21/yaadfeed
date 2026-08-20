
import type { Metadata } from 'next'
import Script from 'next/script'
import { Bebas_Neue, DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'
import Providers from '@/components/providers'
import Preloader from '@/components/Preloader'
import CookieBanner from '@/components/CookieBanner'
import { GoogleAnalytics } from '@next/third-parties/google'
import PushNotificationManager from '@/components/PushNotificationManager'


const bebasNeue = Bebas_Neue({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue'
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans'
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: 'YardVybz - Jamaican News, Gossip, Music & Culture',
  description: 'Stay updated with the latest Jamaican news, Vybz Kartel updates, gossip, dancehall, and reggae music. Your #1 source for everything Yard, Yardie, and Yaad.',
  keywords: [
    'YardVybz', 'YardVybz News', 'vybz', 'vybes', 'Vybz Kartel', 'Jamaica news', 
    'Gossip', 'Yard', 'Yardie', 'Yardy', 'Yaad', 'Dancehall', 'Reggae', 
    'Culture', 'Afrobeats', 'Caribbean Music', 'Entertainment', 'Jamaican gossip'
  ],
  authors: [{ name: 'YardVybz Editorial' }],
  creator: 'YardVybz',
  publisher: 'YardVybz',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'YardVybz - Jamaican News, Gossip, Music & Culture',
    description: 'Stay updated with the latest Jamaican news, Vybz Kartel updates, gossip, dancehall, and reggae music. Your #1 source for everything Yard, Yardie, and Yaad.',
    url: 'https://yardvybz.news',
    siteName: 'YardVybz',
    images: [
      {
        url: '/images/jamaica-tourism.jpg', // Placeholder OG image
        width: 1200,
        height: 630,
        alt: 'YardVybz - Jamaican News & Culture',
      },
    ],
    locale: 'en_JM',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YardVybz - Jamaican News, Gossip, Music & Culture',
    description: 'Stay updated with the latest Jamaican news, Vybz Kartel updates, gossip, dancehall, and reggae music.',
    images: ['/images/jamaica-tourism.jpg'],
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
  }
}

// Static rendering for export

/** TEMP to unblock build: turn off SSG/ISR globally */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Consent Framework Banner */}
        <script data-cfasync="false" type="text/javascript" src="https://cache.consentframework.com/js/pa/53612/c/boATi/stub?source=google-tag"></script>
        <script data-cfasync="false" type="text/javascript" src="https://choices.consentframework.com/js/pa/53612/c/boATi/cmp?source=google-tag" async></script>

        {/* Ezoic Privacy Scripts (Loaded First) */}
        <script data-cfasync="false" src="https://cmp.gatekeeperconsent.com/min.js" />
        <script data-cfasync="false" src="https://the.gatekeeperconsent.com/cmp.min.js" />

        {/* Ezoic Header Scripts */}
        <script async src="//www.ezojs.com/ezoic/sa.min.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ezstandalone = window.ezstandalone || {}; ezstandalone.cmd = ezstandalone.cmd || [];`
          }}
        />
        <script src="//ezoicanalytics.com/analytics.js" />

        <meta name="google-adsense-account" content="ca-pub-8872711759728449" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "YardVybz",
              "url": "https://yardvybz.news",
              "description": "Jamaican News, Gossip, Music & Culture",
              "publisher": {
                "@type": "Organization",
                "name": "YardVybz"
              }
            })
          }}
        />
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1N9X600LMX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1N9X600LMX');
            `
          }}
        />
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8872711759728449"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${bebasNeue.variable} ${dmSans.variable} ${playfairDisplay.variable} font-sans bg-[#0B0B0B] text-white overflow-x-hidden`}>
        <Providers>
          <PushNotificationManager />
          <Preloader />
          {children}
          <CookieBanner />
        </Providers>
      </body>
    </html>
  )
}