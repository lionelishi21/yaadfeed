import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Newsletter | YardVybz',
  description: 'Subscribe to the YardVybz premium newsletter for exclusive Jamaican news, interviews, and content.',
  openGraph: {
    title: 'Newsletter | YardVybz',
    description: 'Subscribe to the YardVybz premium newsletter for exclusive Jamaican news, interviews, and content.',
    url: 'https://www.yardvybz.news/newsletter',
    siteName: 'YardVybz',
    images: [
      {
        url: 'https://www.yardvybz.news/images/jamaica-tourism.jpg',
        width: 1200,
        height: 630,
        alt: 'YardVybz Newsletter',
      },
    ],
    locale: 'en_JM',
    type: 'website',
  },
};

export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
