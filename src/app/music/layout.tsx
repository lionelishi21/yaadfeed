import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YardVybz - New Music & Releases',
  description: 'Discover the freshest new music, riddims, and mixtapes from Jamaica and the Caribbean. Listen to the latest dancehall, reggae, and afrobeats tracks.',
  keywords: 'new dancehall music, new reggae music, jamaican music, caribbean riddims, afrobeats releases, latest mixtapes, yardvybz music',
};

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
