'use client';

export const dynamic = "force-dynamic";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users, Music, Search, CheckCircle, TrendingUp,
  Globe, ArrowUpRight, ChevronRight, Play, Flame, Radio,
  MapPin, SlidersHorizontal, X, Star
} from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import { Artist } from '@/types';
import { numberFormat, stringUtils } from '@/utils';

// ── Genre config ───────────────────────────────────────────────────────────────

const GENRES = [
  { id: 'all', label: 'All Genres' },
  { id: 'reggae', label: 'Reggae' },
  { id: 'dancehall', label: 'Dancehall' },
  { id: 'roots-reggae', label: 'Roots Reggae' },
  { id: 'reggae-fusion', label: 'Reggae Fusion' },
  { id: 'conscious-reggae', label: 'Conscious' },
  { id: 'afrobeats', label: 'Afrobeats' },
  { id: 'trap-dancehall', label: 'Trap Dancehall' },
];

const SORT_OPTIONS = [
  { id: 'popularity', label: 'Most Popular' },
  { id: 'followers', label: 'Most Followed' },
  { id: 'name', label: 'A–Z' },
];

// ── Skeleton ───────────────────────────────────────────────────────────────────

function ArtistCardSkeleton() {
  return (
    <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-gray-800" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-800 rounded-lg w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-5 bg-gray-800 rounded-full w-16" />
          <div className="h-5 bg-gray-800 rounded-full w-20" />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="h-12 bg-gray-800 rounded-xl" />
          <div className="h-12 bg-gray-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ── Featured Artist Card (large cinematic) ─────────────────────────────────────

function FeaturedArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link href={`/artists/${artist.id}`}>
      <div className="group relative rounded-3xl overflow-hidden bg-gray-900 border border-white/8 cursor-pointer h-full min-h-[480px] transition-all duration-500 hover:border-logo-primary/40 hover:shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={artist.imageUrl || '/images/jamaica-flag-bg.jpg'}
            alt={artist.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </div>

        {/* Ambient glow on hover */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-logo-primary/15 blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-5 left-5 flex items-center gap-2 z-10">
          <span className="inline-flex items-center gap-1.5 bg-logo-secondary text-gray-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full">
            <Flame className="w-3 h-3" /> Featured
          </span>
          {artist.isVerified && (
            <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full">
              <CheckCircle className="w-3 h-3 text-logo-primary" /> Verified
            </span>
          )}
        </div>

        {/* Play button */}
        <div className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <Play className="w-4 h-4 text-white fill-white" />
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {artist.genres.slice(0, 2).map(g => (
              <span key={g} className="text-[10px] font-bold uppercase tracking-wider text-white/60 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10">
                {g.replace(/-/g, ' ')}
              </span>
            ))}
          </div>

          <h3 className="text-2xl font-black text-white leading-tight mb-1 group-hover:text-logo-secondary transition-colors duration-300">
            {artist.name}
          </h3>

          {artist.birthPlace && (
            <p className="flex items-center gap-1 text-xs text-white/50 mb-4">
              <MapPin className="w-3 h-3" /> {artist.birthPlace}
            </p>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-5">
              <div>
                <p className="text-white font-bold text-sm">{numberFormat.compact(artist.followers)}</p>
                <p className="text-white/40 text-[11px]">Followers</p>
              </div>
              <div>
                <p className="text-white font-bold text-sm">{artist.popularity}%</p>
                <p className="text-white/40 text-[11px]">Popularity</p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-logo-primary/80 border border-white/15 flex items-center justify-center transition-colors duration-300">
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Standard Artist Card ───────────────────────────────────────────────────────

function ArtistCard({ artist, index }: { artist: Artist; index: number }) {
  return (
    <Link href={`/artists/${artist.id}`}>
      <div className="group relative bg-gray-900 border border-white/6 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-logo-primary/35 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-800">
          <Image
            src={artist.imageUrl || '/images/jamaica-flag-bg.jpg'}
            alt={artist.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />

          {/* Rank badge */}
          <div className="absolute top-3 left-3 w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <span className="text-[11px] font-black text-white/60">#{index + 1}</span>
          </div>

          {/* Verified */}
          {artist.isVerified && (
            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-logo-primary/90 flex items-center justify-center shadow-[0_0_12px_rgba(21,128,61,0.5)]">
              <CheckCircle className="w-3.5 h-3.5 text-white" />
            </div>
          )}

          {/* Jamaican flag badge */}
          {artist.isJamaican && (
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-sm border border-white/10 text-white/70 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                🇯🇲 Jamaican
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {artist.genres.slice(0, 2).map(g => (
              <span key={g} className="text-[9px] font-bold uppercase tracking-wider text-logo-primary/80 bg-logo-primary/10 px-1.5 py-0.5 rounded">
                {g.replace(/-/g, ' ')}
              </span>
            ))}
          </div>

          <h3 className="font-bold text-white text-base leading-tight group-hover:text-logo-secondary transition-colors duration-200 mb-1">
            {artist.name}
          </h3>

          <p className="text-white/40 text-xs line-clamp-2 leading-relaxed mb-4">
            {stringUtils.truncate(artist.bio, 90)}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-white/6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-xs text-white/50">
                <Users className="w-3 h-3" />
                <span className="font-semibold text-white/70">{numberFormat.compact(artist.followers)}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-white/50">
                <Star className="w-3 h-3 text-logo-secondary/60" />
                <span className="font-semibold text-white/70">{artist.popularity}%</span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-logo-primary/20 border border-white/8 flex items-center justify-center transition-colors duration-200">
              <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-logo-primary transition-colors duration-200" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

const ArtistsPage = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popularity' | 'followers' | 'name'>('popularity');
  const [loading, setLoading] = useState(true);
  const [jamaicanFilter, setJamaicanFilter] = useState<'all' | 'jamaican' | 'non-jamaican'>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsSticky(window.scrollY > 320);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/artists');
        const data = await res.json();
        setArtists(data.artists || []);
        setFilteredArtists(data.artists || []);
      } catch (err) {
        console.error('Error loading artists:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    let f = [...artists];

    if (selectedGenre !== 'all') {
      f = f.filter(a => a.genres.some(g => g.toLowerCase().includes(selectedGenre.toLowerCase())));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      f = f.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.genres.some(g => g.toLowerCase().includes(q)) ||
        (a.bio ?? '').toLowerCase().includes(q)
      );
    }
    if (jamaicanFilter === 'jamaican') f = f.filter(a => a.isJamaican);
    if (jamaicanFilter === 'non-jamaican') f = f.filter(a => !a.isJamaican);
    if (verifiedFilter === 'verified') f = f.filter(a => a.isVerified);
    if (verifiedFilter === 'unverified') f = f.filter(a => !a.isVerified);

    f.sort((a, b) => {
      if (sortBy === 'followers') return b.followers - a.followers;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.popularity - a.popularity;
    });

    setFilteredArtists(f);
  }, [artists, selectedGenre, searchQuery, sortBy, jamaicanFilter, verifiedFilter]);

  const hasActiveFilters = selectedGenre !== 'all' || !!searchQuery.trim() || jamaicanFilter !== 'all' || verifiedFilter !== 'all';

  const clearFilters = () => {
    setSelectedGenre('all');
    setSearchQuery('');
    setJamaicanFilter('all');
    setVerifiedFilter('all');
  };

  const genreStats = GENRES.slice(1).map(g => ({
    ...g,
    count: artists.filter(a => a.genres.some(genre => genre.toLowerCase().includes(g.id))).length
  }));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <ClientHeader />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-[60px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050e08] via-gray-950 to-gray-950" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-5%] left-[10%] w-[500px] h-[500px] rounded-full bg-logo-primary/12 blur-[140px]" />
          <div className="absolute top-[10%] right-[5%] w-[350px] h-[350px] rounded-full bg-logo-secondary/8 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/6 border border-white/10 rounded-full px-3.5 py-1.5 mb-8">
              <Radio className="w-3 h-3 text-logo-secondary animate-pulse" />
              <span className="text-xs font-semibold text-white/60 tracking-wide uppercase">Jamaican Music Scene</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-[1.02] tracking-tight mb-6">
              <span className="text-white">The</span>{' '}
              <span className="bg-gradient-to-r from-logo-primary via-[#22c55e] to-logo-secondary bg-clip-text text-transparent">
                Artists
              </span>
              <br />
              <span className="text-white/30">Behind the Sound</span>
            </h1>

            <p className="text-base text-white/50 leading-relaxed max-w-lg mb-10">
              From reggae legends to dancehall titans — discover the talent shaping Jamaica's global cultural footprint.
            </p>
          </div>

          {/* Stats bar */}
          {!loading && (
            <div className="flex flex-wrap gap-6 pt-6 border-t border-white/8">
              {[
                { icon: Users, label: 'Artists', value: artists.length },
                { icon: CheckCircle, label: 'Verified', value: artists.filter(a => a.isVerified).length },
                { icon: Music, label: 'Genres', value: new Set(artists.flatMap(a => a.genres)).size },
                { icon: Globe, label: 'Total Followers', value: numberFormat.compact(artists.reduce((s, a) => s + a.followers, 0)) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-logo-secondary" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm leading-tight">{value}</p>
                    <p className="text-white/35 text-[11px]">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── STICKY FILTER BAR ────────────────────────────────────────────────── */}
      <div
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isSticky
            ? 'bg-gray-950/95 backdrop-blur-xl border-b border-white/8 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Genre pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 flex-1" style={{ scrollbarWidth: 'none' }}>
              {GENRES.map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGenre(g.id)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    selectedGenre === g.id
                      ? 'bg-logo-primary text-white shadow-[0_0_16px_rgba(21,128,61,0.4)]'
                      : 'bg-white/6 text-white/50 hover:bg-white/10 hover:text-white border border-white/8'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {/* Search + filter toggle */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search artists..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-44 pl-8 pr-3 py-2 bg-white/6 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-logo-primary/50 focus:border-logo-primary/40 transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                  showFilters || jamaicanFilter !== 'all' || verifiedFilter !== 'all' || sortBy !== 'popularity'
                    ? 'bg-logo-primary/20 border-logo-primary/40 text-logo-primary'
                    : 'bg-white/6 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
              </button>
            </div>
          </div>

          {/* Expanded filters panel */}
          {showFilters && (
            <div className="flex flex-wrap items-center gap-3 pt-3 mt-2 border-t border-white/6">
              {/* Origin */}
              <div className="flex items-center gap-1.5">
                <span className="text-white/35 text-[11px] font-semibold uppercase tracking-wider">Origin</span>
                <div className="flex gap-1">
                  {(['all', 'jamaican', 'non-jamaican'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setJamaicanFilter(v)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-150 ${
                        jamaicanFilter === v
                          ? 'bg-logo-secondary/20 border border-logo-secondary/40 text-logo-secondary'
                          : 'bg-white/5 border border-white/8 text-white/40 hover:text-white/70'
                      }`}
                    >
                      {v === 'all' ? 'All' : v === 'jamaican' ? '🇯🇲 Jamaican' : 'International'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-1.5">
                <span className="text-white/35 text-[11px] font-semibold uppercase tracking-wider">Status</span>
                <div className="flex gap-1">
                  {(['all', 'verified', 'unverified'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setVerifiedFilter(v)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-150 ${
                        verifiedFilter === v
                          ? 'bg-logo-primary/20 border border-logo-primary/40 text-logo-primary'
                          : 'bg-white/5 border border-white/8 text-white/40 hover:text-white/70'
                      }`}
                    >
                      {v === 'all' ? 'All' : v === 'verified' ? '✓ Verified' : 'Unverified'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-1.5">
                <span className="text-white/35 text-[11px] font-semibold uppercase tracking-wider">Sort</span>
                <div className="flex gap-1">
                  {SORT_OPTIONS.map(o => (
                    <button
                      key={o.id}
                      onClick={() => setSortBy(o.id as 'popularity' | 'followers' | 'name')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-150 ${
                        sortBy === o.id
                          ? 'bg-white/15 border border-white/25 text-white'
                          : 'bg-white/5 border border-white/8 text-white/40 hover:text-white/70'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-[11px] text-red-400/70 hover:text-red-400 transition-colors ml-auto"
                >
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── ARTIST GRID ────────────────────────────────────────────────────────── */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <ArtistCardSkeleton key={i} />)}
            </div>
          ) : filteredArtists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center mb-6">
                <Music className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="text-lg font-bold text-white/60 mb-2">No artists found</h3>
              <p className="text-sm text-white/30 mb-6">Try adjusting your filters or search query</p>
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 bg-logo-primary/20 border border-logo-primary/30 text-logo-primary text-sm font-semibold rounded-xl hover:bg-logo-primary/30 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {/* Result count */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-white/40">
                  Showing <span className="text-white/70 font-semibold">{filteredArtists.length}</span>
                  {filteredArtists.length !== artists.length && (
                    <span> of <span className="text-white/70 font-semibold">{artists.length}</span></span>
                  )} artists
                </p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-white/35 hover:text-white/60 flex items-center gap-1 transition-colors">
                    <X className="w-3 h-3" /> Clear filters
                  </button>
                )}
              </div>

              {/* Top 2 featured (large cinematic cards) */}
              {!hasActiveFilters && filteredArtists.length >= 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {filteredArtists.slice(0, 2).map(a => (
                    <FeaturedArtistCard key={a.id} artist={a} />
                  ))}
                </div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {(hasActiveFilters ? filteredArtists : filteredArtists.slice(2)).map((artist, i) => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                    index={hasActiveFilters ? i : i + 2}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── GENRE BREAKDOWN ──────────────────────────────────────────────────── */}
      {!loading && artists.length > 0 && (
        <section className="py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-logo-primary mb-2">Explore</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Browse by Genre</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {genreStats.filter(g => g.count > 0).map(g => (
                <button
                  key={g.id}
                  onClick={() => { setSelectedGenre(g.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="group relative text-left p-5 bg-gray-900 border border-white/6 rounded-2xl hover:border-logo-primary/30 hover:bg-gray-900/80 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-logo-primary/5 blur-2xl group-hover:bg-logo-primary/12 transition-colors duration-500 pointer-events-none" />
                  <div className="relative z-10">
                    <Music className="w-5 h-5 text-logo-primary/50 mb-3 group-hover:text-logo-primary transition-colors" />
                    <p className="font-bold text-white text-sm mb-1">{g.label}</p>
                    <p className="text-white/35 text-xs">{g.count} artist{g.count !== 1 ? 's' : ''}</p>
                  </div>
                  <ArrowUpRight className="absolute bottom-4 right-4 w-4 h-4 text-white/15 group-hover:text-logo-primary/60 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-logo-dark via-logo-primary/80 to-[#16a34a]" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-black/20 blur-2xl" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <TrendingUp className="w-3.5 h-3.5 text-white/80" />
            <span className="text-white/80 text-xs font-semibold tracking-wide uppercase">Stay Updated</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
            Never Miss a New Artist
          </h2>
          <p className="text-white/65 text-sm leading-relaxed mb-8">
            Get notified when new Jamaican artists join the platform and when your favourites drop something new.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40 border-0 shadow-lg"
            />
            <button className="px-6 py-3 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-colors shadow-lg flex-shrink-0">
              Subscribe Free
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ArtistsPage;
