
import type { Metadata } from 'next'
import Script from 'next/script'
import { Bebas_Neue, DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'
import Providers from '@/components/providers'
import Preloader from '@/components/Preloader'

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
        <meta name="google-adsense-account" content="ca-pub-8872711759728449" />
        {/* Google Analytics GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FDTRC2Z5PP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FDTRC2Z5PP');
          `}
        </Script>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8872711759728449"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Effective CPM Network */}
        <script src="https://pl30357558.effectivecpmnetwork.com/0c/37/4a/0c374a1acbf1b10324b793a817601b67.js"></script>
      </head>
      <body className={`${bebasNeue.variable} ${dmSans.variable} ${playfairDisplay.variable} font-sans bg-[#0B0B0B] text-white overflow-x-hidden`}>
        <Providers>
          <Preloader />
          {children}
        </Providers>
      </body>
    </html>
  )
}