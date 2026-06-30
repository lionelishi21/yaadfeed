import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YaadFeed - Jamaican Events & Dancehall Parties',
  description: 'Find out about upcoming dancehall parties, reggae festivals, and Jamaican entertainment events happening globally and locally.',
  keywords: 'jamaican events, dancehall parties, reggae festivals, caribbean events, yaadfeed events',
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
