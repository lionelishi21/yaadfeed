'use client';

export const dynamic = "auto";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Play, ArrowRight, Music, Clock, Heart, Eye, ChevronRight,
  Headphones, Radio, TrendingUp, Mic2, Disc3, Zap, Star, Users
} from 'lucide-react';
import { NewsItem, Artist } from '@/types';
import { formatters, stringUtils } from '@/utils';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';

/* ─── Fallback data ─────────────────────────────────────── */
const getFallbackMusicNews = (): NewsItem[] => [
  {
    id: 'fallback-1',
    title: 'Reggae Revival: The New Sound of the Island',
    category: 'reggae',
    summary: 'A new wave of reggae artists is carrying the torch while pushing the genre into uncharted sonic territories.',
    slug: 'reggae-revival-sounds-of-the-island',
    imageUrl: '/images/jamaica-flag-bg.jpg',
    publishedAt: new Date().toISOString(),
    readTime: 3,
    content: '',
    source: 'jamaica-gleaner',
    tags: ['reggae', 'music', 'jamaica'],
  },
  {
    id: 'fallback-2',
    title: 'Dancehall Energy: The Beat Goes Global',
    category: 'dancehall',
    summary: 'Modern dancehall trends are shaping global club culture and rewriting the rules of pop music.',
    slug: 'dancehall-energy-the-beat-goes-on',
    imageUrl: '/images/music-a7c5368b17b9.jpg',
    publishedAt: new Date().toISOString(),
    readTime: 2,
    content: '',
    source: 'jamaica-observer',
    tags: ['dancehall', 'music', 'culture'],
  },
  {
    id: 'fallback-3',
    title: 'Entertainment Buzz: Island Highlights',
    category: 'entertainment',
    summary: "Inside highlights from Jamaica's vibrant entertainment scene this season.",
    slug: 'entertainment-buzz-island-highlights',
    imageUrl: '/images/entertainment-78e5a1307748.jpg',
    publishedAt: new Date().toISOString(),
    readTime: 2,
    content: '',
    source: 'jamaica-star',
    tags: ['entertainment', 'island'],
  },
  {
    id: 'fallback-4',
    title: 'Afrobeats Meets Reggae: A Cultural Fusion',
    category: 'afrobeats',
    summary: 'Artists are bridging African rhythms and Caribbean vibes in groundbreaking collaborations.',
    slug: 'afrobeats-meets-reggae',
    imageUrl: '/images/music-f0c59a497d92.jpg',
    publishedAt: new Date().toISOString(),
    readTime: 4,
    content: '',
    source: 'jamaica-gleaner',
    tags: ['afrobeats', 'reggae', 'fusion'],
  },
  {
    id: 'fallback-5',
    title: 'Kingston Studios: Where Legends Are Born',
    category: 'reggae',
    summary: 'A deep dive into the legendary recording studios that shaped the sound of Jamaica.',
    slug: 'kingston-studios-legends',
    imageUrl: '/images/entertainment-ee2d621ddb29.jpg',
    publishedAt: new Date().toISOString(),
    readTime: 5,
    content: '',
    source: 'jamaica-observer',
    tags: ['reggae', 'history', 'kingston'],
  },
  {
    id: 'fallback-6',
    title: 'Festival Season: The Best Lineups of the Year',
    category: 'dancehall',
    summary: 'From Reggae Sumfest to Rebel Salute — the must-attend music festivals of the year.',
    slug: 'festival-season-best-lineups',
    imageUrl: '/images/jamaica-flag-bg.jpg',
    publishedAt: new Date().toISOString(),
    readTime: 3,
    content: '',
    source: 'jamaica-star',
    tags: ['festival', 'dancehall', 'live'],
  },
];

const getFallbackArtists = (): Artist[] => [
  { id: 'a1', name: 'Island Star', bio: 'A rising star blending reggae and dancehall.', genres: ['Reggae', 'Dancehall'], imageUrl: '/images/jamaica-flag-bg.jpg', popularity: 85, followers: 0, socialMedia: {}, discography: [], upcomingEvents: [], isJamaican: true, isVerified: true },
  { id: 'a2', name: 'Kingston Vibes', bio: 'Dancehall collective with infectious rhythms.', genres: ['Dancehall'], imageUrl: '/images/music-f0c59a497d92.jpg', popularity: 72, followers: 0, socialMedia: {}, discography: [], upcomingEvents: [], isJamaican: true, isVerified: false },
  { id: 'a3', name: 'Roots Harmony', bio: 'Roots group bringing classic reggae harmonies.', genres: ['Reggae'], imageUrl: '/images/entertainment-ee2d621ddb29.jpg', popularity: 68, followers: 0, socialMedia: {}, discography: [], upcomingEvents: [], isJamaican: true, isVerified: false },
  { id: 'a4', name: 'Tropic Bass', bio: 'Low-end specialist fusing dub and electronic music.', genres: ['Dub', 'Electronic'], imageUrl: '/images/music-a7c5368b17b9.jpg', popularity: 61, followers: 0, socialMedia: {}, discography: [], upcomingEvents: [], isJamaican: true, isVerified: true },
];

/* ─── Category config ───────────────────────────────────── */
const CATEGORY_CONFIG: Record<string, { label: string; color: string; glow: string; bg: string; icon: React.ElementType }> = {
  reggae:        { label: 'Reggae',        color: 'text-green-400',  glow: 'shadow-[0_0_20px_rgba(74,222,128,0.3)]',  bg: 'bg-green-500/10 border-green-500/20',  icon: Music },
  dancehall:     { label: 'Dancehall',     color: 'text-yellow-400', glow: 'shadow-[0_0_20px_rgba(250,204,21,0.3)]',  bg: 'bg-yellow-500/10 border-yellow-500/20', icon: Mic2 },
  afrobeats:     { label: 'Afrobeats',     color: 'text-orange-400', glow: 'shadow-[0_0_20px_rgba(251,146,60,0.3)]',  bg: 'bg-orange-500/10 border-orange-500/20', icon: Radio },
  entertainment: { label: 'Entertainment', color: 'text-purple-400', glow: 'shadow-[0_0_20px_rgba(196,181,253,0.3)]', bg: 'bg-purple-500/10 border-purple-500/20', icon: Zap },
  music:         { label: 'Music',         color: 'text-blue-400',   glow: 'shadow-[0_0_20px_rgba(96,165,250,0.3)]',  bg: 'bg-blue-500/10 border-blue-500/20',    icon: Headphones },
};

const getCatConfig = (cat: string) => CATEGORY_CONFIG[cat?.toLowerCase()] ?? CATEGORY_CONFIG['music'];

/* ─── Sub-components ────────────────────────────────────── */
function NewsImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [err, setErr] = useState(false);
  const fallback = '/images/jamaica-flag-bg.jpg';
  return (
    <Image
      src={err || !src ? fallback : src}
      alt={alt}
      fill
      className={className ?? 'object-cover'}
      onError={() => setErr(true)}
    />
  );
}

function CategoryBadge({ category, small }: { category: string; small?: boolean }) {
  const cfg = getCatConfig(category);
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-semibold uppercase tracking-wider ${cfg.bg} ${cfg.color} ${small ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}`}>
      <cfg.icon className={small ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      {cfg.label}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-gray-900/60 animate-pulse">
      <div className="aspect-[16/10] bg-gray-800" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-800 rounded w-1/3" />
        <div className="h-4 bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
      </div>
    </div>
  );
}

/* ─── Genres section data ───────────────────────────────── */
const GENRES = [
  { id: 'reggae',    icon: Music,      title: 'Reggae',        desc: 'The soulful sound that put Jamaica on the world map',    stat: '60+ yrs', statLabel: 'heritage' },
  { id: 'dancehall', icon: Mic2,       title: 'Dancehall',     desc: 'Electrifying beats driving dancefloors around the globe', stat: '#1',      statLabel: 'global trend' },
  { id: 'afrobeats', icon: Radio,      title: 'Afrobeats',     desc: 'The fusion of African and Caribbean musical traditions',  stat: '2B+',     statLabel: 'streams' },
  { id: 'dub',       icon: Headphones, title: 'Dub & Roots',   desc: 'Bass-heavy originals from Kingston's legendary studios',  stat: '∞',       statLabel: 'influence' },
];

/* ─── Page ──────────────────────────────────────────────── */
const MusicPage = () => {
  const [musicNews, setMusicNews]       = useState<NewsItem[]>([]);
  const [artists, setArtists]           = useState<Artist[]>([]);
  const [loading, setLoading]           = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const [newsRes, artistsRes] = await Promise.allSettled([
          fetch('/api/news'),
          fetch('/api/artists'),
        ]);

        if (newsRes.status === 'fulfilled' && newsRes.value.ok) {
          const d = await newsRes.value.json();
          const all: NewsItem[] = d.news || d || [];
          const filtered = all.filter((a) =>
            ['music','dancehall','reggae','afrobeats','entertainment'].includes((a.category || '').toLowerCase())
          );
          setMusicNews(filtered.length ? filtered : getFallbackMusicNews());
        } else {
          setMusicNews(getFallbackMusicNews());
        }

        if (artistsRes.status === 'fulfilled' && artistsRes.value.ok) {
          const d = await artistsRes.value.json();
          const all: Artist[] = d.artists || [];
          const top = [...all].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 8);
          setArtists(top.length ? top : getFallbackArtists());
        } else {
          setArtists(getFallbackArtists());
        }
      } catch {
        setMusicNews(getFallbackMusicNews());
        setArtists(getFallbackArtists());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = [
    { id: 'all',           label: 'All',           count: musicNews.length },
    { id: 'dancehall',     label: 'Dancehall',     count: musicNews.filter(n => n.category === 'dancehall').length },
    { id: 'reggae',        label: 'Reggae',        count: musicNews.filter(n => n.category === 'reggae').length },
    { id: 'afrobeats',     label: 'Afrobeats',     count: musicNews.filter(n => n.category === 'afrobeats').length },
    { id: 'entertainment', label: 'Entertainment', count: musicNews.filter(n => n.category === 'entertainment').length },
  ];

  const filtered = activeCategory === 'all'
    ? musicNews
    : musicNews.filter((a) => a.category?.toLowerCase() === activeCategory);

  const heroArticle   = filtered[0];
  const secondaryArticles = filtered.slice(1, 4);
  const gridArticles  = filtered.slice(4);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <ClientHeader />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-8 pb-16">
        {/* ambient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] bg-green-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-yellow-500/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Live Coverage
            </span>
            <span className="text-gray-500 text-sm">Jamaica Music Scene</span>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 items-start">
            {/* left: headline + featured card */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-4">
                  <span className="block text-white">The</span>
                  <span className="block bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 bg-clip-text text-transparent">
                    Rhythm
                  </span>
                  <span className="block text-white">Never Stops</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                  Reggae, Dancehall, Afrobeats — every beat, every story, every artist from Jamaica's world-class music scene.
                </p>
              </div>

              {/* Featured article card */}
              {loading ? (
                <div className="rounded-3xl overflow-hidden bg-gray-900/60 animate-pulse aspect-[16/9]" />
              ) : heroArticle ? (
                <Link href={`/news/${heroArticle.slug || heroArticle.id}`} className="group block">
                  <div className="relative rounded-3xl overflow-hidden aspect-[16/9] bg-gray-900">
                    <NewsImage src={heroArticle.imageUrl} alt={heroArticle.title} className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    {/* gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    {/* top badges */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="bg-green-500 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                        Featured
                      </span>
                      <CategoryBadge category={heroArticle.category} small />
                    </div>
                    {/* play button */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                    {/* bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h2 className="text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-green-300 transition-colors">
                        {heroArticle.title}
                      </h2>
                      <p className="text-gray-300 text-sm line-clamp-2 mb-3">{heroArticle.summary}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{heroArticle.readTime || 2} min read</span>
                        <span>{formatters.relative(heroArticle.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : null}
            </div>

            {/* right: secondary articles */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* stats bar */}
              <div className="grid grid-cols-3 gap-3 mb-2">
                {[
                  { icon: TrendingUp, value: `${musicNews.length}+`, label: 'Stories' },
                  { icon: Users,      value: `${artists.length}+`,   label: 'Artists' },
                  { icon: Disc3,      value: '4',                     label: 'Genres' },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="bg-gray-900/60 border border-white/5 rounded-2xl p-4 text-center">
                    <Icon className="w-4 h-4 text-green-400 mx-auto mb-1" />
                    <div className="text-xl font-black text-white">{value}</div>
                    <div className="text-gray-500 text-xs">{label}</div>
                  </div>
                ))}
              </div>

              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3 p-4 rounded-2xl bg-gray-900/60 animate-pulse">
                      <div className="w-20 h-20 rounded-xl bg-gray-800 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-800 rounded w-1/3" />
                        <div className="h-4 bg-gray-800 rounded w-full" />
                        <div className="h-3 bg-gray-800 rounded w-1/2" />
                      </div>
                    </div>
                  ))
                : secondaryArticles.map((article) => {
                    const cfg = getCatConfig(article.category);
                    return (
                      <Link key={article.id} href={`/news/${article.slug || article.id}`} className="group flex gap-3 p-4 rounded-2xl bg-gray-900/60 border border-white/5 hover:border-white/10 hover:bg-gray-900/80 transition-all duration-300">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                          <NewsImage src={article.imageUrl} alt={article.title} className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CategoryBadge category={article.category} small />
                          <h3 className={`text-sm font-semibold text-white mt-1 mb-1 line-clamp-2 group-hover:${cfg.color} transition-colors`}>
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{article.readTime || 2} min</span>
                            <span>·</span>
                            <span>{formatters.relative(article.publishedAt)}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all self-center flex-shrink-0" />
                      </Link>
                    );
                  })}
            </div>
          </div>
        </div>
      </section>

      {/* ── GENRE STRIP ─────────────────────────────────── */}
      <section className="border-y border-white/5 bg-gray-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/5">
            {GENRES.map(({ id, icon: Icon, title, desc, stat, statLabel }) => {
              const cfg = getCatConfig(id);
              return (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id === activeCategory ? 'all' : id)}
                  className={`group p-6 text-left transition-all duration-300 hover:bg-white/3 ${activeCategory === id ? 'bg-white/5' : ''}`}
                >
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border mb-4 transition-all duration-300 group-hover:scale-110 ${cfg.bg} ${activeCategory === id ? cfg.glow : ''}`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-black text-white">{stat}</span>
                    <span className="text-xs text-gray-500">{statLabel}</span>
                  </div>
                  <div className="font-bold text-white text-sm mb-1">{title}</div>
                  <div className="text-gray-500 text-xs line-clamp-2">{desc}</div>
                  {activeCategory === id && (
                    <div className={`mt-3 text-xs font-bold ${cfg.color}`}>Active filter ✓</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FILTER TABS ─────────────────────────────────── */}
      <section className="sticky top-0 z-30 bg-gray-950/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-green-500 text-white shadow-[0_0_16px_rgba(74,222,128,0.4)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-500'}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN GRID ───────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <p className="text-xs text-green-400 font-bold uppercase tracking-widest mb-1">Music News</p>
              <h2 className="text-3xl font-black text-white">
                {activeCategory === 'all' ? 'All Stories' : stringUtils.capitalize(activeCategory)}
              </h2>
            </div>
            <span className="text-gray-500 text-sm">{filtered.length} articles</span>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : gridArticles.length === 0 && filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-400 text-lg font-semibold mb-2">No stories found</p>
              <p className="text-gray-600 text-sm mb-6">Try a different category filter</p>
              <button onClick={() => setActiveCategory('all')} className="px-5 py-2 bg-green-500 text-white text-sm font-semibold rounded-full hover:bg-green-400 transition-colors">
                Show all
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(gridArticles.length > 0 ? gridArticles : filtered).map((article) => {
                const cfg = getCatConfig(article.category);
                return (
                  <Link key={article.id} href={`/news/${article.slug || article.id}`} className="group block">
                    <article className="h-full bg-gray-900/60 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 hover:bg-gray-900/80 hover:-translate-y-1 transition-all duration-300">
                      {/* image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-gray-800">
                        <NewsImage src={article.imageUrl} alt={article.title} className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <CategoryBadge category={article.category} small />
                        </div>
                      </div>
                      {/* body */}
                      <div className="p-5">
                        <h3 className={`font-bold text-white text-base mb-2 line-clamp-2 group-hover:${cfg.color} transition-colors leading-snug`}>
                          {article.title}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                          {article.summary}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime || 2} min</span>
                            <span>{formatters.relative(article.publishedAt)}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:text-white transition-all" />
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── ARTISTS SECTION ─────────────────────────────── */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs text-yellow-400 font-bold uppercase tracking-widest mb-1">On the Rise</p>
              <h2 className="text-3xl font-black text-white">Featured Artists</h2>
            </div>
            <Link href="/artists" className="group flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors font-semibold">
              View all <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {(loading ? Array.from({ length: 8 }) : artists).map((artist, i) => {
              if (loading || !artist) {
                return (
                  <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
                    <div className="w-16 h-16 rounded-2xl bg-gray-800" />
                    <div className="h-3 bg-gray-800 rounded w-14" />
                  </div>
                );
              }
              const a = artist as Artist;
              return (
                <Link key={a.id} href={`/artists/${a.id}`} className="group flex flex-col items-center gap-2 text-center">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-800 ring-2 ring-transparent group-hover:ring-green-500/60 group-hover:shadow-[0_0_20px_rgba(74,222,128,0.3)] transition-all duration-300">
                    <Image src={a.imageUrl || '/images/jamaica-flag-bg.jpg'} alt={a.name} fill className="object-cover" />
                    {a.isVerified && (
                      <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-950">
                        <Star className="w-2.5 h-2.5 text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 w-full">
                    <p className="text-xs font-semibold text-white truncate group-hover:text-green-400 transition-colors">{a.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{a.genres?.[0] || 'Music'}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── GENRE DEEP-DIVES ────────────────────────────── */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-2">Deep Dive</p>
            <h2 className="text-3xl font-black text-white mb-3">Explore by Genre</h2>
            <p className="text-gray-500 max-w-lg mx-auto text-sm">From classic roots reggae to cutting-edge afrobeats — find your sound</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {GENRES.map(({ id, icon: Icon, title, desc }) => {
              const cfg = getCatConfig(id);
              return (
                <button
                  key={id}
                  onClick={() => { setActiveCategory(id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`group relative overflow-hidden rounded-2xl p-6 text-left border transition-all duration-300 hover:-translate-y-1 ${cfg.bg} hover:${cfg.glow}`}
                >
                  {/* bg glow blob */}
                  <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40 ${cfg.color.replace('text-', 'bg-')}`} />
                  <Icon className={`w-8 h-8 mb-4 ${cfg.color}`} />
                  <h3 className="text-white font-black text-lg mb-2">{title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4">{desc}</p>
                  <div className={`inline-flex items-center gap-1 text-xs font-bold ${cfg.color}`}>
                    Browse {title} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA NEWSLETTER ──────────────────────────────── */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative bg-gradient-to-br from-green-900/40 to-gray-900/60 border border-green-500/20 rounded-3xl p-10 overflow-hidden">
            <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/15 rounded-full blur-3xl" />
            <Headphones className="w-10 h-10 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-white mb-3">Never Miss a Beat</h2>
            <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
              Get the latest Jamaican music news, artist drops, and exclusive stories delivered straight to your inbox.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 focus:bg-white/8 transition-all"
              />
              <button className="bg-green-500 hover:bg-green-400 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:shadow-[0_0_30px_rgba(74,222,128,0.5)] flex-shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MusicPage;
