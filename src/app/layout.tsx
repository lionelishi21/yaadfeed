
import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'
import Providers from '@/components/providers'

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
  title: 'YaadFeed - Jamaican News, Music & Culture',
  description: 'Stay updated with the latest Jamaican news, dancehall and reggae music, culture, and entertainment. Your #1 source for Caribbean vibes.',
  keywords: ['Jamaica', 'News', 'Dancehall', 'Reggae', 'Culture', 'Vybz Kartel', 'Afrobeats', 'Caribbean Music', 'Entertainment'],
  authors: [{ name: 'YaadFeed Editorial' }],
  creator: 'YaadFeed',
  publisher: 'YaadFeed',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'YaadFeed - Jamaican News, Music & Culture',
    description: 'Stay updated with the latest Jamaican news, dancehall and reggae music, culture, and entertainment.',
    url: 'https://yaadfeed.com', // Replace with your actual domain
    siteName: 'YaadFeed',
    images: [
      {
        url: '/images/jamaica-tourism.jpg', // Placeholder OG image
        width: 1200,
        height: 630,
        alt: 'YaadFeed - Jamaican News & Culture',
      },
    ],
    locale: 'en_JM',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YaadFeed - Jamaican News, Music & Culture',
    description: 'Stay updated with the latest Jamaican news, dancehall and reggae music, culture, and entertainment.',
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
      <body className={`${bebasNeue.variable} ${dmSans.variable} ${playfairDisplay.variable} font-sans bg-[#0B0B0B] text-white overflow-x-hidden`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}