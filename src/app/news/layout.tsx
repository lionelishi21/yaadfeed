import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YaadFeed - Latest Dancehall & Reggae News',
  description: 'Get the latest breaking news, exclusive interviews, and culture updates from the Jamaican and Caribbean dancehall and reggae scene.',
  keywords: 'dancehall news, reggae news, jamaican music news, vybz kartel, popcaan, shenseea, yaadfeed news, caribbean entertainment',
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
