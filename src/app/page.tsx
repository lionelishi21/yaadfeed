'use client';

export const dynamic = 'auto';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Play, ArrowRight, Calendar, Music, Newspaper,
  TrendingUp, Star, Sparkles, Globe, Heart, Eye,
  ChevronRight, ArrowUpRight, Flame, Radio, Clock, MapPin
} from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import dynamicImport from 'next/dynamic';

const Preloader = dynamicImport(() => import('@/components/ui/Preloader'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-1">
          Yaad<span className="text-logo-primary">Feed</span>
        </h1>
        <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">Jamaica's Premier Platform</p>
        <div className="mt-6 w-6 h-6 border-2 border-logo-primary/20 border-t-logo-primary rounded-full mx-auto animate-spin" />
      </div>
    </div>
  )
});

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  publishedAt: string;
  source: string;
  author: string;
  slug: string;
}

interface Artist {
  _id: string;
  name: string;
  imageUrl?: string;
  genre: string;
  bio: string;
  socialLinks: { instagram?: string; twitter?: string; youtube?: string };
}

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  imageUrl?: string;
  description: string;
}

// ── Tiny helpers ──────────────────────────────────────────────────────────────

function CategoryBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-logo-primary/10 text-logo-primary">
      {label}
    </span>
  );
}

function SectionHeader({
  eyebrow, title, subtitle, href, linkLabel
}: { eyebrow?: string; title: string; subtitle?: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
      <div>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-logo-primary mb-2">{eyebrow}</p>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-logo-primary transition-colors flex-shrink-0"
        >
          {linkLabel || 'View all'}
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}

// ── News Card ─────────────────────────────────────────────────────────────────

function NewsCard({ article, featured = false }: { article: NewsItem; featured?: boolean }) {
  return (
    <article className={`group bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 ${featured ? 'md:col-span-2' : ''}`}>
      <div className={`relative overflow-hidden bg-gray-100 ${featured ? 'aspect-[16/8]' : 'aspect-[16/9]'}`}>
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-logo-primary/8 via-logo-secondary/8 to-logo-accent/5">
            <Newspaper className="w-10 h-10 text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <CategoryBadge label={article.category} />
        </div>
      </div>
      <div className="p-5">
        <h3 className={`font-bold text-gray-900 leading-snug group-hover:text-logo-primary transition-colors line-clamp-2 mb-2 ${featured ? 'text-xl' : 'text-base'}`}>
          {article.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">{article.content}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-logo-primary font-semibold">{article.source}</span>
        </div>
      </div>
    </article>
  );
}

// ── Artist Card ───────────────────────────────────────────────────────────────

function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <div className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-logo-primary/20 hover:shadow-[0_4px_20px_rgba(21,128,61,0.08)] transition-all duration-300">
      <div className="relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-logo-primary/10 to-logo-secondary/10">
        {artist.imageUrl ? (
          <Image src={artist.imageUrl} alt={artist.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="w-6 h-6 text-logo-primary/40" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-logo-primary transition-colors">{artist.name}</h3>
        <p className="text-xs text-logo-primary font-semibold mt-0.5">{artist.genre}</p>
        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{artist.bio}</p>
      </div>
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-logo-primary/10 flex items-center justify-center transition-colors">
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-logo-primary transition-colors" />
        </div>
      </div>
    </div>
  );
}

// ── Event Card ────────────────────────────────────────────────────────────────

function EventCard({ event }: { event: Event }) {
  const d = new Date(event.date);
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = d.getDate();

  return (
    <div className="group flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-logo-secondary/30 hover:shadow-[0_4px_20px_rgba(234,179,8,0.08)] transition-all duration-300">
      {/* Date block */}
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-b from-logo-secondary/15 to-logo-secondary/5 flex flex-col items-center justify-center border border-logo-secondary/20">
        <span className="text-[9px] font-bold uppercase tracking-wider text-logo-secondary leading-none">{month}</span>
        <span className="text-lg font-black text-gray-900 leading-none mt-0.5">{day}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-logo-primary transition-colors leading-snug">{event.title}</h3>
        <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
      </div>
    </div>
  );
}

// ── Spotlight Card ────────────────────────────────────────────────────────────

function SpotlightCard({ spotlight, large = false }: { spotlight: any; large?: boolean }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-logo-dark via-gray-900 to-black border border-white/5 transition-all duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)] ${large ? 'p-8' : 'p-5'}`}>
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-logo-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-logo-secondary/10 blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className={`${large ? 'w-20 h-20' : 'w-12 h-12'} rounded-2xl bg-gradient-to-br from-logo-primary/30 to-logo-secondary/20 flex items-center justify-center mb-4 border border-white/10`}>
          <Music className={`${large ? 'w-10 h-10' : 'w-6 h-6'} text-white/80`} />
        </div>
        <div className="inline-flex items-center gap-1.5 bg-logo-primary/20 text-logo-secondary px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
          <Radio className="w-3 h-3" /> {spotlight.status}
        </div>
        <h3 className={`font-extrabold text-white leading-snug ${large ? 'text-2xl mb-2' : 'text-base mb-1'}`}>{spotlight.artistName}</h3>
        <p className={`text-white/50 ${large ? 'text-base mb-4' : 'text-xs mb-3'}`}>"{spotlight.songTitle}"</p>
        {large && spotlight.description && (
          <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-3">{spotlight.description}</p>
        )}
        <div className="flex items-center gap-3">
          {spotlight.spotifyUrl && (
            <a
              href={spotlight.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/10"
            >
              <Play className="w-3 h-3" /> Play
            </a>
          )}
          <span className="text-white/30 text-xs">
            {new Date(spotlight.releaseDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>
        {large && spotlight.views && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
            <span className="flex items-center gap-1.5 text-xs text-white/40">
              <Eye className="w-3.5 h-3.5" /> {spotlight.views.toLocaleString()}
            </span>
            {spotlight.likes && (
              <span className="flex items-center gap-1.5 text-xs text-white/40">
                <Heart className="w-3.5 h-3.5" /> {spotlight.likes.toLocaleString()}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stats ticker ──────────────────────────────────────────────────────────────

const stats = [
  { icon: Flame, label: 'Trending Now', value: 'Dancehall' },
  { icon: Globe, label: 'Global Reach', value: '50+ Countries' },
  { icon: Sparkles, label: 'Stories', value: '10K+ Articles' },
  { icon: Star, label: 'Artists', value: '500+ Profiles' },
  { icon: TrendingUp, label: 'Monthly Readers', value: '2M+' },
];

// ── Main page ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [trendingArtists, setTrendingArtists] = useState<Artist[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [featuredSpotlight, setFeaturedSpotlight] = useState<any>(null);
  const [recentSpotlights, setRecentSpotlights] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const newsResponse = await fetch('/api/news?limit=12');
        const newsData = await newsResponse.json();
        if (newsData.news?.length > 0) {
          const articles = newsData.news.map((a: any) => ({ ...a, _id: a.id, content: a.summary || a.content }));
          setFeaturedNews(articles.slice(0, 3));
          setLatestNews(articles.slice(3, 12));
        }

        const artistsResponse = await fetch('/api/artists?limit=8');
        const artistsData = await artistsResponse.json();
        if (artistsData.artists?.length > 0) {
          setTrendingArtists(artistsData.artists.map((a: any) => ({
            ...a, _id: a.id, genre: a.genres?.[0] ?? 'Reggae', socialLinks: a.socialMedia ?? {}
          })));
        }

        try {
          const eventsResponse = await fetch('/api/events?limit=6');
          const eventsData = await eventsResponse.json();
          if (eventsData.events?.length > 0) setUpcomingEvents(eventsData.events);
        } catch { /* no events */ }

        try {
          const [fRes, rRes] = await Promise.all([
            fetch('/api/artist-spotlights?action=featured'),
            fetch('/api/artist-spotlights?action=recent&limit=4'),
          ]);
          const fData = await fRes.json();
          const rData = await rRes.json();
          if (fData.success && fData.data) setFeaturedSpotlight(fData.data);
          if (rData.success && rData.data) setRecentSpotlights(rData.data);
        } catch { /* no spotlights */ }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <ClientHeader />
        <Preloader isLoading={true}>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-logo-primary/10 rounded-xl animate-pulse" />
              <h2 className="text-xl font-bold text-gray-900 mb-1">Loading YaadFeed</h2>
              <p className="text-sm text-gray-400">Fetching the latest stories...</p>
            </div>
          </div>
        </Preloader>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <ClientHeader />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-[60px] overflow-hidden bg-gradient-to-b from-gray-950 via-[#0a1a0e] to-gray-950">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-logo-primary/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[15%] w-[400px] h-[400px] rounded-full bg-logo-secondary/8 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="animate-[fadeUp_0.7s_ease_forwards]">
              <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-3.5 py-1.5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-logo-secondary animate-pulse" />
                <span className="text-xs font-semibold text-white/60 tracking-wide uppercase">Live from Kingston</span>
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
                Jamaica's
                <br />
                <span className="bg-gradient-to-r from-logo-primary via-[#22c55e] to-logo-secondary bg-clip-text text-transparent">
                  Cultural
                </span>
                <br />
                Heartbeat
              </h1>

              <p className="text-base text-white/50 leading-relaxed max-w-md mb-10">
                Authentic Jamaican music news, artist features, and cultural stories from the heart of the Caribbean—delivered daily.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/news">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-logo-primary hover:bg-logo-dark text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-[0_0_24px_rgba(21,128,61,0.35)] hover:shadow-[0_0_32px_rgba(21,128,61,0.5)]">
                    Explore Stories <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/artists">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-white/8 hover:bg-white/14 border border-white/10 text-white text-sm font-semibold rounded-xl transition-all duration-200">
                    <Music className="w-4 h-4 text-logo-secondary" /> Artists
                  </button>
                </Link>
              </div>
            </div>

            {/* Right — hero image */}
            <div className="relative animate-[fadeUp_0.7s_0.15s_ease_forwards] opacity-0">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] max-w-sm mx-auto lg:max-w-none border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
                <Image
                  src="/images/skillibeng.jpg"
                  alt="Skillibeng - Dancehall Star"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Info card at bottom */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-lg leading-tight">Skillibeng</p>
                      <p className="text-white/60 text-xs mt-0.5">Dancehall · Kingston, JA</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-logo-primary/80 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute top-4 right-4 bg-logo-secondary text-gray-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                  Featured
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative z-10 border-t border-white/6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-white/6">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 py-5 px-4 sm:px-6">
                  <div className="w-8 h-8 rounded-lg bg-white/6 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-logo-secondary" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm leading-tight">{value}</p>
                    <p className="text-white/35 text-[11px]">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED NEWS ──────────────────────────────────────────────────── */}
      {featuredNews.length > 0 && (
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Top Stories"
              title="Featured News"
              subtitle="The biggest stories shaping Jamaican culture"
              href="/news"
              linkLabel="All news"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featuredNews.slice(0, 3).map((article, i) => (
                <NewsCard key={article._id || i} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LATEST NEWS + EVENTS (two columns) ─────────────────────────── */}
      <section className="py-16 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Latest News — 2/3 width */}
            <div className="lg:col-span-2">
              <SectionHeader
                eyebrow="Music News"
                title="Latest Stories"
                subtitle="Breaking stories from the music scene"
                href="/news"
                linkLabel="View all"
              />
              {latestNews.length > 0 ? (
                <div className="space-y-4">
                  {latestNews.slice(0, 6).map((article, i) => (
                    <article key={article._id || i} className="group flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-logo-primary/15 hover:shadow-[0_4px_20px_rgba(21,128,61,0.06)] transition-all duration-300">
                      <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                        {article.imageUrl ? (
                          <Image src={article.imageUrl} alt={article.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-logo-primary/8 to-logo-secondary/8">
                            <Newspaper className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <CategoryBadge label={article.category} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-logo-primary transition-colors leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          <span className="mx-1 text-gray-200">·</span>
                          {article.source}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 text-center">
                  <Newspaper className="w-10 h-10 text-gray-200 mb-3" />
                  <p className="text-sm text-gray-400">No news available yet</p>
                </div>
              )}
            </div>

            {/* Events — 1/3 width */}
            <div>
              <SectionHeader
                eyebrow="Calendar"
                title="Events"
                subtitle="Don't miss these upcoming shows"
                href="/events"
                linkLabel="All events"
              />
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.slice(0, 6).map((event, i) => (
                    <EventCard key={event._id || i} event={event} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 text-center">
                  <Calendar className="w-10 h-10 text-gray-200 mb-3" />
                  <p className="text-sm text-gray-400">No upcoming events</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRENDING ARTISTS ──────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Rising Stars"
            title="Trending Artists"
            subtitle="The hottest Jamaican artists making waves worldwide"
            href="/artists"
            linkLabel="All artists"
          />
          {trendingArtists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendingArtists.slice(0, 8).map((artist, i) => (
                <ArtistCard key={artist._id || i} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl text-center">
              <Music className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">No artists available</p>
            </div>
          )}
        </div>
      </section>

      {/* ── ARTIST SPOTLIGHT ──────────────────────────────────────────────── */}
      <section className="py-16 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="New Releases"
            title="Artist Spotlight"
            subtitle="Latest drops and trending tracks"
            href="/artists"
            linkLabel="All spotlights"
          />

          {(featuredSpotlight || recentSpotlights.length > 0) ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Large featured */}
              {featuredSpotlight ? (
                <div className="lg:col-span-1">
                  <SpotlightCard spotlight={featuredSpotlight} large={true} />
                </div>
              ) : (
                <div className="lg:col-span-1 bg-gray-100 rounded-2xl flex items-center justify-center min-h-[300px]">
                  <p className="text-sm text-gray-400">No featured spotlight</p>
                </div>
              )}

              {/* Grid of recents */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentSpotlights.slice(0, 4).map((sp, i) => (
                  <SpotlightCard key={sp._id || i} spotlight={sp} />
                ))}
                {recentSpotlights.length === 0 && Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-2xl min-h-[160px] flex items-center justify-center">
                    <p className="text-xs text-gray-300">No spotlight</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 text-center">
              <Music className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">No spotlights available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-logo-dark via-logo-primary to-[#16a34a] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-black/15 blur-2xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-logo-secondary" />
            <span className="text-white/80 text-xs font-semibold tracking-wide uppercase">Stay Connected</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-5">
            Never Miss a Beat
          </h2>
          <p className="text-white/65 text-base leading-relaxed mb-10 max-w-lg mx-auto">
            Get exclusive Jamaican music news, artist drops, and cultural stories straight to your inbox—free forever.
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
          <p className="text-white/40 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
