import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Users, ExternalLink, Music, DollarSign, MapPin } from 'lucide-react';

async function getArtist(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/artists/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.artist || null;
}

export default async function ArtistPage({ params }: { params: { id: string } }) {
  const artist = await getArtist(params.id);

  if (!artist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0ea5e9] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold mb-4">Artist Not Found</h1>
          <p className="text-lg mb-8">The artist you're looking for doesn't exist.</p>
          <Link href="/artists">
            <span className="inline-flex items-center px-6 py-3 rounded-2xl bg-white/10 border border-cyan-400/30 text-cyan-100 shadow-lg hover:bg-cyan-400/10 hover:text-white transition">
              <ArrowLeft className="mr-2 w-5 h-5" />
              Back to Artists
            </span>
          </Link>
        </div>
      </div>
    );
  }

  function numberFormat(num: number) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num?.toString() || "0";
  }
  function currencyFormat(num: number) {
    if (!num) return "-";
    return "$" + numberFormat(num);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0ea5e9] text-white">
      {/* Navigation */}
      <div className="sticky top-0 z-30 w-full bg-gradient-to-r from-[#0f172a]/80 via-[#1e293b]/80 to-[#0ea5e9]/80 backdrop-blur-md shadow-lg border-b border-blue-900/30">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-4">
          <Link href="/artists" className="inline-flex items-center text-cyan-200 hover:text-cyan-100 transition-colors">
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back to Artists
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center py-16 md:py-24 bg-gradient-to-br from-cyan-900/40 to-blue-900/30">
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 max-w-screen-2xl mx-auto px-4 sm:px-8">
          {/* Artist Image */}
          <div className="flex-shrink-0 flex items-center justify-center w-56 h-56 md:w-80 md:h-80 rounded-full overflow-hidden border-8 border-cyan-300/30 shadow-2xl bg-gradient-to-br from-cyan-400/10 to-blue-900/10">
            <Image
              src={artist.imageUrl || "/images/jamaica-flag-bg.jpg"}
              alt={artist.name}
              width={320}
              height={320}
              className="object-cover w-full h-full rounded-full shadow-xl"
              priority
            />
          </div>
          {/* Artist Info */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-2 text-white drop-shadow-lg">{artist.name}</h1>
            <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
              {artist.genres?.map((genre: string) => (
                <span key={genre} className="bg-cyan-400/20 text-cyan-100 px-4 py-1 rounded-full text-sm font-semibold backdrop-blur-md">
                  {genre.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-6 mb-6 justify-center md:justify-start">
              <div className="flex items-center gap-2 text-cyan-100/90">
                <Users className="w-5 h-5" />
                <span className="font-semibold">{numberFormat(artist.followers)} Followers</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-100/90">
                <DollarSign className="w-5 h-5" />
                <span className="font-semibold">{currencyFormat(artist.netWorth)}</span>
              </div>
              {artist.birthPlace && (
                <div className="flex items-center gap-2 text-cyan-100/90">
                  <MapPin className="w-5 h-5" />
                  <span>{artist.birthPlace}</span>
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-2">
              {artist.spotifyId && (
                <a
                  href={`https://open.spotify.com/artist/${artist.spotifyId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 hover:text-cyan-100"
                  title="Spotify"
                >
                  <Music className="w-6 h-6" />
                </a>
              )}
              {artist.socialMedia?.instagram && (
                <a
                  href={artist.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 hover:text-cyan-100"
                  title="Instagram"
                >
                  <ExternalLink className="w-6 h-6" />
                </a>
              )}
              {artist.socialMedia?.website && (
                <a
                  href={artist.socialMedia.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 hover:text-cyan-100"
                  title="Website"
                >
                  <ExternalLink className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Biography */}
        <div className="md:col-span-2 bg-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-cyan-400/20">
          <h2 className="text-2xl font-bold text-cyan-100 mb-6">Biography</h2>
          <div className="prose prose-lg max-w-none text-cyan-100/90 leading-relaxed">
            <p>{artist.bio}</p>
          </div>
        </div>
        {/* Stats and Info */}
        <div className="space-y-6">
          <div className="bg-white/10 rounded-3xl shadow-xl p-8 border border-cyan-400/20">
            <h3 className="text-xl font-bold text-cyan-100 mb-4">Artist Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-cyan-200">Genre</span>
                <span className="font-semibold">{artist.genres?.join(', ')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-200">Followers</span>
                <span className="font-semibold">{numberFormat(artist.followers)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-200">Net Worth</span>
                <span className="font-semibold">{currencyFormat(artist.netWorth)}</span>
              </div>
              {artist.birthPlace && (
                <div className="flex justify-between items-center">
                  <span className="text-cyan-200">Origin</span>
                  <span className="font-semibold">{artist.birthPlace}</span>
                </div>
              )}
            </div>
          </div>
          {/* Social Media */}
          <div className="bg-white/10 rounded-3xl shadow-xl p-8 border border-cyan-400/20">
            <h3 className="text-xl font-bold text-cyan-100 mb-4">Connect</h3>
            <div className="space-y-3">
              {artist.spotifyId && (
                <a
                  href={`https://open.spotify.com/artist/${artist.spotifyId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-cyan-400/10 rounded-lg hover:bg-cyan-400/20 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Music className="w-5 h-5 text-cyan-300" />
                    <span className="font-medium">Spotify</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-cyan-200" />
                </a>
              )}
              {artist.socialMedia?.instagram && (
                <a
                  href={artist.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-cyan-400/10 rounded-lg hover:bg-cyan-400/20 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <ExternalLink className="w-5 h-5 text-pink-400" />
                    <span className="font-medium">Instagram</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-cyan-200" />
                </a>
              )}
              {artist.socialMedia?.website && (
                <a
                  href={artist.socialMedia.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-cyan-400/10 rounded-lg hover:bg-cyan-400/20 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <ExternalLink className="w-5 h-5 text-cyan-300" />
                    <span className="font-medium">Website</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-cyan-200" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
