import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YardVybz - Latest Dancehall & Reggae News',
  description: 'Get the latest breaking news, exclusive interviews, and culture updates from the Jamaican and Caribbean dancehall and reggae scene.',
  keywords: 'dancehall news, reggae news, jamaican music news, vybz kartel, popcaan, shenseea, yardvybz news, vybz, vybes, caribbean entertainment',
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
