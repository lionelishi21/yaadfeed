'use client';

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Music, ExternalLink, Search, Filter, Star, CheckCircle } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Artist } from '@/types';
import { numberFormat, stringUtils } from '@/utils';
import { ArtistSkeleton } from '@/components/ui/LoadingSkeleton';

const fallbackArtists: Artist[] = [
  {
    id: 'vybz-kartel',
    name: 'Vybz Kartel',
    bio: 'Adidja Azim Palmer, better known as Vybz Kartel, is a Jamaican dancehall deejay.',
    genres: ['dancehall'],
    imageUrl: '/images/vybz-kartel.jpg',
    followers: 1500000,
    popularity: 95,
    isJamaican: true,
    isVerified: true
  },
  {
    id: 'popcaan',
    name: 'Popcaan',
    bio: 'Andrae Hugh Sutherland, known professionally as Popcaan, is a Jamaican deejay.',
    genres: ['dancehall'],
    imageUrl: '/images/popcaan.jpg',
    followers: 2100000,
    popularity: 92,
    isJamaican: true,
    isVerified: true
  },
  {
    id: 'skillibeng',
    name: 'Skillibeng',
    bio: 'Emwah Warmington, known professionally as Skillibeng, is a Jamaican dancehall DJ.',
    genres: ['dancehall', 'trap-dancehall'],
    imageUrl: '/images/skillibeng.jpg',
    followers: 850000,
    popularity: 88,
    isJamaican: true,
    isVerified: true
  }
];

const ArtistsPage = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popularity' | 'followers' | 'name'>('popularity');
  const [loading, setLoading] = useState(true);
  const [jamaicanFilter, setJamaicanFilter] = useState<'all' | 'jamaican' | 'non-jamaican'>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  const genres = ['all', 'reggae', 'dancehall', 'reggae-fusion', 'roots-reggae', 'alternative-reggae', 'conscious-reggae', 'trap-dancehall'];

  useEffect(() => {
    const loadArtists = async () => {
      try {
        const response = await fetch('/api/artists');
        const data = await response.json();
        if (response.ok && data.artists && data.artists.length > 0) {
          setArtists(data.artists);
          setFilteredArtists(data.artists);
        } else {
          // Fallback
          setArtists(fallbackArtists);
          setFilteredArtists(fallbackArtists);
        }
      } catch (error) {
        console.error('Error loading artists:', error);
        setArtists(fallbackArtists);
        setFilteredArtists(fallbackArtists);
      } finally {
        setLoading(false);
      }
    };

    loadArtists();
  }, []);

  useEffect(() => {
    let filtered = artists;

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(artist => 
        artist.genres.some(genre => genre.toLowerCase().includes(selectedGenre.toLowerCase()))
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(artist =>
        artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by Jamaican/Non-Jamaican
    if (jamaicanFilter === 'jamaican') {
      filtered = filtered.filter(artist => artist.isJamaican);
    } else if (jamaicanFilter === 'non-jamaican') {
      filtered = filtered.filter(artist => !artist.isJamaican);
    }

    // Filter by Verified/Unverified
    if (verifiedFilter === 'verified') {
      filtered = filtered.filter(artist => artist.isVerified);
    } else if (verifiedFilter === 'unverified') {
      filtered = filtered.filter(artist => !artist.isVerified);
    }

    // Sort artists
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'followers':
          return b.followers - a.followers;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
    });

    setFilteredArtists(filtered);
  }, [artists, selectedGenre, searchQuery, sortBy, jamaicanFilter, verifiedFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-logo-light via-white to-logo-muted">
        <ClientHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <ArtistSkeleton key={i} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yard-dark text-white font-sans overflow-x-hidden">
      <ClientHeader />
      
      {/* Page Header */}
      <section className="relative bg-yard-dark border-b border-[#141414] py-16 overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-yard-gold/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-14">
          <div className="text-center">
            {/* Minimalist badge */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 border border-yard-gold/30 bg-yard-gold/10 px-3.5 py-1.5 rounded-none">
                <span className="w-1.5 h-1.5 bg-yard-gold rounded-full animate-dot"></span>
                <span className="text-[11px] font-bold tracking-[2px] uppercase text-yard-gold">Culture & Sound</span>
              </div>
            </div>

            <h1 className="font-bebas text-[clamp(48px,5vw,72px)] leading-none text-white mb-6">
              Jamaican <span className="text-yard-gold">Artists</span>
            </h1>
            <p className="text-[#888] text-base max-w-2xl mx-auto leading-[1.65]">
              Discover the incredible talent and musical diversity of Jamaica's artists, from reggae legends to rising stars
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#0f0f0f] py-10 border-b border-[#141414]">
        <div className="max-w-7xl mx-auto px-6 sm:px-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/5">
            <div>
              <div className="text-4xl font-bebas text-yard-gold mb-1">{artists.length}</div>
              <div className="text-[#888] text-[11px] font-bold tracking-[1px] uppercase">Featured Artists</div>
            </div>
            <div>
              <div className="text-4xl font-bebas text-yard-gold mb-1">
                {artists.filter(a => a.isVerified).length}
              </div>
              <div className="text-[#888] text-[11px] font-bold tracking-[1px] uppercase">Verified Artists</div>
            </div>
            <div>
              <div className="text-4xl font-bebas text-yard-gold mb-1">
                {new Set(artists.flatMap(a => a.genres)).size}
              </div>
              <div className="text-[#888] text-[11px] font-bold tracking-[1px] uppercase">Music Genres</div>
            </div>
            <div>
              <div className="text-4xl font-bebas text-yard-gold mb-1">
                {numberFormat.compact(artists.reduce((sum, a) => sum + a.followers, 0))}
              </div>
              <div className="text-[#888] text-[11px] font-bold tracking-[1px] uppercase">Total Followers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-[#0a0a0a] py-6 border-b border-[#141414]">
        <div className="max-w-7xl mx-auto px-6 sm:px-14">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#555]" />
              </div>
              <input
                type="text"
                placeholder="Search artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141414] border border-[#222] text-white pl-11 pr-4 py-3.5 focus:outline-none focus:border-yard-gold/50 transition-colors text-sm placeholder:text-[#555]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Genre Filter */}
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-[#555]" />
                </div>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="bg-[#141414] border border-[#222] text-[#888] pl-10 pr-8 py-3.5 focus:outline-none focus:border-yard-gold/50 transition-colors appearance-none cursor-pointer text-[12px] font-bold tracking-[0.5px] uppercase"
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>
                      {genre === 'all' ? 'All Genres' : stringUtils.capitalize(genre.replace('-', ' '))}
                    </option>
                  ))}
                </select>
              </div>

              {/* Origin Filter */}
              <select
                value={jamaicanFilter}
                onChange={e => setJamaicanFilter(e.target.value as 'all' | 'jamaican' | 'non-jamaican')}
                className="bg-[#141414] border border-[#222] text-[#888] px-4 py-3.5 focus:outline-none focus:border-yard-gold/50 transition-colors appearance-none cursor-pointer text-[12px] font-bold tracking-[0.5px] uppercase"
              >
                <option value="all">All Origins</option>
                <option value="jamaican">Jamaican</option>
                <option value="non-jamaican">Non-Jamaican</option>
              </select>

              {/* Status Filter */}
              <select
                value={verifiedFilter}
                onChange={e => setVerifiedFilter(e.target.value as 'all' | 'verified' | 'unverified')}
                className="bg-[#141414] border border-[#222] text-[#888] px-4 py-3.5 focus:outline-none focus:border-yard-gold/50 transition-colors appearance-none cursor-pointer text-[12px] font-bold tracking-[0.5px] uppercase"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popularity' | 'followers' | 'name')}
                className="bg-[#141414] border border-[#222] text-[#888] px-4 py-3.5 focus:outline-none focus:border-yard-gold/50 transition-colors appearance-none cursor-pointer text-[12px] font-bold tracking-[0.5px] uppercase"
              >
                <option value="popularity">Sort by Popularity</option>
                <option value="followers">Sort by Followers</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="py-16 bg-yard-dark">
        <div className="max-w-7xl mx-auto px-6 sm:px-14">
          {filteredArtists.length === 0 ? (
            <div className="text-center py-20 border border-white/5 bg-[#0f0f0f]">
              <div className="w-24 h-24 bg-yard-gray rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-yard-gold" />
              </div>
              <p className="text-[#888] text-lg">No artists found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredArtists.map((artist) => (
                <Link key={artist.id} href={`/artists/${artist.id}`} className="block h-full">
                  <div className="bg-[#0f0f0f] border border-white/5 h-full group hover:border-yard-gold/30 transition-colors flex flex-col items-center text-center p-6 relative">
                    
                    {/* Artist Image */}
                    <div className="relative mb-6">
                      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-white/10 group-hover:border-yard-gold/50 transition-colors duration-500 relative bg-[#141414]">
                        <Image
                          src={artist.imageUrl || '/images/jamaica-flag-bg.jpg'}
                          alt={artist.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                        />
                      </div>
                      {artist.isVerified && (
                        <div className="absolute top-0 right-2 bg-yard-dark rounded-full p-0.5 border border-white/10">
                          <CheckCircle className="w-5 h-5 text-yard-gold" />
                        </div>
                      )}
                    </div>

                    {/* Artist Info */}
                    <h3 className="text-[22px] font-bebas tracking-[1px] text-white mb-2 group-hover:text-yard-gold transition-colors leading-none">
                      {artist.name}
                    </h3>
                    
                    {/* Genres */}
                    <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                      {artist.genres.slice(0, 2).map((genre) => (
                        <span
                          key={genre}
                          className="bg-transparent border border-white/10 text-[#888] px-2 py-0.5 text-[9px] font-bold tracking-[1px] uppercase group-hover:border-yard-gold/30 group-hover:text-white transition-colors"
                        >
                          {stringUtils.capitalize(genre.replace('-', ' '))}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 w-full mb-6 py-4 border-y border-white/5">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-[#666] mb-1">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-lg font-bebas text-white">
                          {numberFormat.compact(artist.followers)}
                        </div>
                        <div className="text-[#666] text-[10px] uppercase tracking-[1px]">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-[#666] mb-1">
                          <Star className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-lg font-bebas text-yard-gold">
                          {artist.popularity}%
                        </div>
                        <div className="text-[#666] text-[10px] uppercase tracking-[1px]">Popularity</div>
                      </div>
                    </div>

                    {/* Bio Preview */}
                    <p className="text-[#888] text-[13px] mb-6 line-clamp-2 flex-grow">
                      {stringUtils.truncate(artist.bio, 100)}
                    </p>

                    {/* Action Button */}
                    <div className="w-full mt-auto">
                      <div className="bg-transparent border border-yard-gold text-yard-gold text-[12px] font-bold tracking-[1px] uppercase px-4 py-3 w-full group-hover:bg-yard-gold group-hover:text-yard-dark transition-colors">
                        View Profile
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ArtistsPage;
