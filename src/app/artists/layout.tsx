import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YaadFeed - Dancehall, Reggae & Afrobeats Artists',
  description: 'Explore the biggest names in Dancehall, Reggae, and Afrobeats. View artist profiles, bios, discographies, and social media stats on YaadFeed.',
  keywords: 'dancehall artists, reggae artists, afrobeats artists, jamaican singers, caribbean artists, burna boy, sean paul, vybz kartel, popcaan, yaadfeed artists',
};

export default function ArtistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
