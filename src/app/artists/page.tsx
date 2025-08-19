'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Music, ExternalLink, Search, Filter, Star, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Artist } from '@/types';
import { numberFormat, stringUtils } from '@/utils';

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
        setArtists(data.artists);
        setFilteredArtists(data.artists);
      } catch (error) {
        console.error('Error loading artists:', error);
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
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="loading-shimmer h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-jamaica-green-600 to-jamaica-gold-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Jamaican Artists
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Discover the incredible talent and musical diversity of Jamaica's artists, from reggae legends to rising stars
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-jamaica-green-600 mb-2">{artists.length}</div>
              <div className="text-gray-600">Featured Artists</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-jamaica-green-600 mb-2">
                {artists.filter(a => a.isVerified).length}
              </div>
              <div className="text-gray-600">Verified Artists</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-jamaica-green-600 mb-2">
                {new Set(artists.flatMap(a => a.genres)).size}
              </div>
              <div className="text-gray-600">Music Genres</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-jamaica-green-600 mb-2">
                {numberFormat.compact(artists.reduce((sum, a) => sum + a.followers, 0))}
              </div>
              <div className="text-gray-600">Total Followers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jamaica-green-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center space-x-4 gap-2">
              {/* Genre Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-jamaica-green-500 focus:border-transparent outline-none"
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>
                      {genre === 'all' ? 'All Genres' : stringUtils.capitalize(genre.replace('-', ' '))}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jamaican/Non-Jamaican Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 text-sm">Origin:</span>
                <select
                  value={jamaicanFilter}
                  onChange={e => setJamaicanFilter(e.target.value as 'all' | 'jamaican' | 'non-jamaican')}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-jamaica-green-500 focus:border-transparent outline-none"
                >
                  <option value="all">All</option>
                  <option value="jamaican">Jamaican</option>
                  <option value="non-jamaican">Non-Jamaican</option>
                </select>
              </div>

              {/* Verified/Unverified Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 text-sm">Status:</span>
                <select
                  value={verifiedFilter}
                  onChange={e => setVerifiedFilter(e.target.value as 'all' | 'verified' | 'unverified')}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-jamaica-green-500 focus:border-transparent outline-none"
                >
                  <option value="all">All</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popularity' | 'followers' | 'name')}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-jamaica-green-500 focus:border-transparent outline-none"
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
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredArtists.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No artists found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArtists.map((artist) => (
                <Link key={artist.id} href={`/artists/${artist.id}`}>
                  <Card variant="artist" className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                  {/* Artist Image */}
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-jamaica-gold-200 group-hover:border-jamaica-gold-400 transition-colors duration-200">
                      <Image
                        src={artist.imageUrl || '/images/jamaica-flag-bg.jpg'}
                        alt={artist.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {artist.isVerified && (
                      <div className="absolute top-0 right-0 bg-jamaica-green-500 rounded-full p-1">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Artist Info */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-jamaica-green-600 transition-colors">
                      {artist.name}
                    </h3>
                    
                    {/* Genres */}
                    <div className="flex flex-wrap justify-center gap-1 mb-4">
                      {artist.genres.slice(0, 2).map((genre) => (
                        <span
                          key={genre}
                          className="bg-jamaica-green-100 text-jamaica-green-800 px-2 py-1 rounded-full text-xs"
                        >
                          {stringUtils.capitalize(genre.replace('-', ' '))}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {numberFormat.compact(artist.followers)}
                        </div>
                        <div className="text-xs text-gray-500">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-jamaica-gold-500 mb-1">
                          <Star className="w-4 h-4" />
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {artist.popularity}%
                        </div>
                        <div className="text-xs text-gray-500">Popularity</div>
                      </div>
                    </div>

                    {/* Net Worth */}
                    {artist.netWorth && (
                      <div className="text-center mb-4">
                        <div className="text-sm text-gray-600">Estimated Net Worth</div>
                        <div className="text-lg font-semibold text-jamaica-green-600">
                          {numberFormat.currency(artist.netWorth)}
                        </div>
                      </div>
                    )}

                    {/* Bio Preview */}
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                      {stringUtils.truncate(artist.bio, 120)}
                    </p>

                    {/* Social Links */}
                    <div className="flex justify-center space-x-3 mb-6">
                      {artist.socialMedia && artist.socialMedia.spotify && (
                        <a
                          href={artist.socialMedia.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-jamaica-green-600 hover:text-jamaica-green-700 transition-colors"
                          title="Spotify"
                        >
                          <Music className="w-5 h-5" />
                        </a>
                      )}
                      {artist.socialMedia && artist.socialMedia.instagram && (
                        <a
                          href={artist.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-jamaica-green-600 hover:text-jamaica-green-700 transition-colors"
                          title="Instagram"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                      {artist.socialMedia && artist.socialMedia.website && (
                        <a
                          href={artist.socialMedia.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-jamaica-green-600 hover:text-jamaica-green-700 transition-colors"
                          title="Website"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button className="w-full" size="sm">
                      View Profile
                    </Button>
                  </div>
                  </Card>
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
