'use client';

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search, X, ArrowRight, Calendar, User, Eye, Sparkles, TrendingUp,
  Clock, Star, ChevronRight, Flame, Globe, Newspaper, ArrowUpRight,
  Music, Filter
} from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import { NewsItem, NewsCategory } from '@/types';
import { formatters, stringUtils } from '@/utils';

// ── Fallback data ─────────────────────────────────────────────────────────────
const getFallbackNews = (): NewsItem[] => [
  {
    id: '1',
    title: "Jamaica's Dancehall Scene Continues to Thrive Globally",
    summary: 'The vibrant dancehall culture in Jamaica continues to influence global music trends, with artists like Skillibeng and Popcaan leading the charge.',
    content: 'The vibrant dancehall culture in Jamaica continues to influence global music trends.',
    category: 'entertainment' as const,
    source: 'jamaica-gleaner' as const,
    imageUrl: '/images/placeholder-music.jpg',
    slug: 'jamaica-dancehall-scene-thrives',
    publishedAt: new Date().toISOString(),
    tags: ['dancehall', 'music', 'jamaica'],
    keywords: ['dancehall', 'jamaica', 'music'],
    isPopular: true,
    author: 'YaadFeed Team',
    viewCount: 15200,
    readTime: 3,
  },
  {
    id: '2',
    title: 'Reggae Festival 2024: A Celebration of Jamaican Musical Heritage',
    summary: "Join us for the biggest reggae festival celebrating Jamaica's rich musical heritage and cultural roots.",
    content: "Join us for the biggest reggae festival celebrating Jamaica's rich musical heritage.",
    category: 'entertainment' as const,
    source: 'jamaica-observer' as const,
    imageUrl: '/images/placeholder-entertainment.jpg',
    slug: 'reggae-festival-2024-celebration',
    publishedAt: new Date().toISOString(),
    tags: ['reggae', 'festival', 'jamaica'],
    keywords: ['reggae', 'festival', 'jamaica'],
    author: 'YaadFeed Team',
    viewCount: 9800,
    readTime: 4,
  },
  {
    id: '3',
    title: 'Jamaican Athletes Prepare for the Upcoming Olympic Games',
    summary: "Jamaica's track and field stars are training intensively for the upcoming Olympic competition.",
    content: "Jamaica's track and field stars are training hard for the upcoming Olympic competition.",
    category: 'sports' as const,
    source: 'sports-jamaica' as const,
    imageUrl: '/images/placeholder-sports.jpg',
    slug: 'jamaican-athletes-olympic-preparation',
    publishedAt: new Date().toISOString(),
    tags: ['olympics', 'athletics', 'jamaica'],
    keywords: ['olympics', 'athletics', 'jamaica'],
    author: 'YaadFeed Team',
    viewCount: 18700,
    readTime: 3,
  },
  {
    id: '4',
    title: 'Kingston Street Art Festival Draws International Attention',
    summary: 'Local and international artists transform downtown Kingston into an open-air gallery.',
    content: 'Local and international artists transform downtown Kingston into an open-air gallery.',
    category: 'culture' as const,
    source: 'jamaica-gleaner' as const,
    imageUrl: '/images/placeholder-music.jpg',
    slug: 'kingston-street-art-festival',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    tags: ['art', 'culture', 'kingston'],
    keywords: ['art', 'kingston', 'culture'],
    author: 'YaadFeed Team',
    viewCount: 6300,
    readTime: 2,
  },
  {
    id: '5',
    title: 'New Government Policy to Boost Jamaican Tech Startups',
    summary: 'The government announces a new initiative aimed at fostering innovation and entrepreneurship in the island nation.',
    content: 'The government announces a new initiative aimed at fostering innovation.',
    category: 'business' as const,
    source: 'jamaica-observer' as const,
    imageUrl: '/images/placeholder-sports.jpg',
    slug: 'government-policy-tech-startups',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    tags: ['business', 'technology', 'startup'],
    keywords: ['business', 'technology', 'jamaica'],
    author: 'YaadFeed Team',
    viewCount: 4100,
    readTime: 5,
  },
  {
    id: '6',
    title: 'Afrobeats and Dancehall: The Cultural Collision Reshaping Afro-Caribbean Music',
    summary: 'How two of the world\'s most electrifying genres are merging to create something entirely new.',
    content: 'How two of the worlds most electrifying genres are merging.',
    category: 'culture' as const,
    source: 'jamaica-gleaner' as const,
    imageUrl: '/images/placeholder-entertainment.jpg',
    slug: 'afrobeats-dancehall-collision',
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    tags: ['afrobeats', 'dancehall', 'culture'],
    keywords: ['afrobeats', 'dancehall'],
    author: 'YaadFeed Team',
    viewCount: 11500,
    readTime: 6,
  },
];

// ── Category config ───────────────────────────────────────────────────────────
const CATEGORIES: { value: NewsCategory | 'all'; label: string; emoji: string }[] = [
  { value: 'all',           label: 'All',           emoji: '✦' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎵' },
  { value: 'sports',        label: 'Sports',        emoji: '🏅' },
  { value: 'politics',      label: 'Politics',      emoji: '🗳️' },
  { value: 'business',      label: 'Business',      emoji: '📈' },
  { value: 'culture',       label: 'Culture',       emoji: '🎨' },
  { value: 'local',         label: 'Local',         emoji: '📍' },
  { value: 'international', label: 'International', emoji: '🌍' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatViews(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

// ── Hero Card ─────────────────────────────────────────────────────────────────
function HeroCard({ article }: { article: NewsItem }) {
  return (
    <Link href={`/news/${article.slug || article.id}`} className="group block relative rounded-3xl overflow-hidden bg-gray-950 border border-white/[0.06]">
      {/* Image */}
      <div className="absolute inset-0">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-logo-dark/50 to-gray-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full min-h-[480px] lg:min-h-[560px] p-7 lg:p-9">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-logo-primary/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
            <Flame className="w-3 h-3" /> Featured
          </span>
          <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm text-white/70 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1.5 rounded-full border border-white/10">
            {article.category}
          </span>
        </div>

        <h2 className="text-2xl lg:text-4xl font-black text-white leading-tight tracking-tight mb-3 group-hover:text-logo-secondary transition-colors duration-300 max-w-2xl">
          {article.title}
        </h2>

        <p className="text-white/55 text-sm lg:text-base leading-relaxed line-clamp-2 mb-6 max-w-xl">
          {article.summary}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <User className="w-3 h-3" /> {article.author || 'YaadFeed'}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> {formatters.relative(article.publishedAt)}
            </span>
            {article.viewCount != null && (
              <span className="flex items-center gap-1.5">
                <Eye className="w-3 h-3" /> {formatViews(article.viewCount)}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 px-3.5 py-2 rounded-xl transition-colors">
            Read <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Standard News Card ────────────────────────────────────────────────────────
function NewsCard({ article, compact = false }: { article: NewsItem; compact?: boolean }) {
  if (compact) {
    return (
      <Link href={`/news/${article.slug || article.id}`} className="group flex gap-3.5 p-4 rounded-xl bg-white border border-gray-100 hover:border-logo-primary/20 hover:shadow-[0_4px_20px_rgba(21,128,61,0.07)] transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative w-[72px] h-[72px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          {article.imageUrl ? (
            <Image src={article.imageUrl} alt={article.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-logo-primary/8 to-logo-secondary/8">
              <Newspaper className="w-5 h-5 text-gray-300" />
            </div>
          )}
        </div>
        {/* Text */}
        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest bg-logo-primary/8 text-logo-primary mb-1.5">
            {article.category}
          </span>
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-logo-primary transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatters.relative(article.publishedAt)}
            <span className="mx-1 text-gray-200">·</span>
            {article.readTime || 2}m read
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/news/${article.slug || article.id}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-logo-primary/15 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-0.5">
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        {article.imageUrl ? (
          <Image src={article.imageUrl} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-logo-primary/5 to-logo-secondary/5">
            <Newspaper className="w-8 h-8 text-gray-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-sm text-logo-primary shadow-sm">
            {article.category}
          </span>
        </div>
        {article.isPopular && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-bold bg-logo-secondary/90 text-gray-900 shadow-sm">
              <Flame className="w-2.5 h-2.5" /> Hot
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-logo-primary transition-colors leading-snug mb-2">
          {article.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1 mb-4">
          {article.summary}
        </p>
        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-gray-50">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatters.relative(article.publishedAt)}
          </span>
          <div className="flex items-center gap-3">
            {article.viewCount != null && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" /> {formatViews(article.viewCount)}
              </span>
            )}
            <span className="flex items-center gap-1 text-logo-primary font-semibold">
              {article.readTime || 2}m read
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Trending ticker item ──────────────────────────────────────────────────────
function TrendingItem({ article, rank }: { article: NewsItem; rank: number }) {
  return (
    <Link href={`/news/${article.slug || article.id}`} className="group flex items-start gap-3 py-3.5 border-b border-gray-100 last:border-0">
      <span className="flex-shrink-0 w-6 h-6 rounded-md bg-gray-950 text-logo-secondary text-[10px] font-black flex items-center justify-center mt-0.5">
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-logo-primary transition-colors leading-snug">
          {article.title}
        </h4>
        <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
          <Eye className="w-3 h-3" /> {formatViews(article.viewCount || 0)} views
        </p>
      </div>
    </Link>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  const filteredNews = useMemo(() => {
    let list = news;
    if (selectedCategory !== 'all') list = list.filter(a => a.category === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        (a.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [news, selectedCategory, searchQuery]);

  const heroArticle = useMemo(() => filteredNews.find(a => a.isPopular) || filteredNews[0], [filteredNews]);
  const gridArticles = useMemo(() => filteredNews.filter(a => a !== heroArticle), [filteredNews, heroArticle]);
  const trendingArticles = useMemo(
    () => [...news].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5),
    [news]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        if (res.ok && data.news?.length > 0) setNews(data.news);
        else setNews(getFallbackNews());
      } catch {
        setNews(getFallbackNews());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const debouncedSearch = useCallback((q: string) => setSearchQuery(q), []);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <ClientHeader />
        <div className="pt-[62px]">
          {/* Hero skeleton */}
          <div className="h-[480px] lg:h-[560px] bg-gray-200 animate-pulse" />
          {/* Grid skeleton */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-72 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <ClientHeader />

      {/* ── PAGE OFFSET ──────────────────────────────────────────────────────── */}
      <div className="pt-[62px]">

        {/* ── TOP BAR: breadcrumb + search + filters ─────────────────────────── */}
        <div className="sticky top-[62px] z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 py-3">

              {/* Row 1: title + search toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-medium">YaadFeed</span>
                  <ChevronRight className="w-3 h-3 text-gray-300" />
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">News</span>
                  <span className="ml-1.5 text-[10px] font-bold text-white bg-logo-primary px-1.5 py-0.5 rounded-full">
                    {filteredNews.length}
                  </span>
                </div>
                <button
                  onClick={() => setSearchOpen(s => !s)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
                >
                  <Search className="w-3.5 h-3.5" />
                  {searchOpen ? 'Close' : 'Search'}
                </button>
              </div>

              {/* Search bar (conditional) */}
              {searchOpen && (
                <div className="relative animate-[fadeUp_0.2s_ease_forwards]">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search news, topics, tags..."
                    value={searchQuery}
                    onChange={e => debouncedSearch(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-logo-primary/20 focus:border-logo-primary/40 transition-all placeholder-gray-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Row 2: Category pills */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                      selectedCategory === cat.value
                        ? 'bg-gray-950 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800'
                    }`}
                  >
                    <span className="text-[11px]">{cat.emoji}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── HERO ARTICLE ─────────────────────────────────────────────────────── */}
        {heroArticle && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-0">
            <HeroCard article={heroArticle} />
          </div>
        )}

        {/* ── MAIN CONTENT GRID ─────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filteredNews.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
                <Newspaper className="w-9 h-9 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
              <p className="text-sm text-gray-400 mb-6">Try adjusting your search or selecting a different category.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="px-5 py-2.5 bg-logo-primary text-white text-sm font-bold rounded-xl hover:bg-logo-dark transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* ── Articles column (2/3) ──────────────────────────────────────── */}
              <div className="lg:col-span-2 space-y-10">

                {/* Section label */}
                {gridArticles.length > 0 && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-logo-primary mb-1">Latest Coverage</p>
                      <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                        {selectedCategory === 'all' ? 'All Stories' : stringUtils.capitalize(selectedCategory)}
                      </h2>
                    </div>
                    <span className="text-xs text-gray-400">{gridArticles.length} article{gridArticles.length !== 1 ? 's' : ''}</span>
                  </div>
                )}

                {/* Main 2-col card grid */}
                {gridArticles.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {gridArticles.slice(0, 6).map((article, i) => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </div>
                )}

                {/* More stories compact list */}
                {gridArticles.length > 6 && (
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-logo-primary">More Stories</p>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                      {gridArticles.slice(6).map(article => (
                        <NewsCard key={article.id} article={article} compact />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Sidebar (1/3) ──────────────────────────────────────────────── */}
              <aside className="space-y-8">

                {/* Trending box */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center gap-2.5 px-5 pt-5 pb-4 border-b border-gray-50">
                    <div className="w-7 h-7 rounded-lg bg-logo-secondary/15 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-logo-secondary" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Right Now</p>
                      <h3 className="text-sm font-extrabold text-gray-900 leading-tight">Trending</h3>
                    </div>
                  </div>
                  <div className="px-5 pb-2">
                    {trendingArticles.map((article, i) => (
                      <TrendingItem key={article.id} article={article} rank={i + 1} />
                    ))}
                  </div>
                </div>

                {/* Categories box */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-logo-primary/10 flex items-center justify-center">
                      <Filter className="w-3.5 h-3.5 text-logo-primary" />
                    </div>
                    <h3 className="text-sm font-extrabold text-gray-900">Browse by Topic</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.filter(c => c.value !== 'all').map(cat => {
                      const count = news.filter(a => a.category === cat.value).length;
                      return (
                        <button
                          key={cat.value}
                          onClick={() => setSelectedCategory(cat.value)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                            selectedCategory === cat.value
                              ? 'bg-gray-950 text-white'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'
                          }`}
                        >
                          {cat.emoji} {cat.label}
                          {count > 0 && (
                            <span className={`text-[10px] font-black ${selectedCategory === cat.value ? 'text-logo-secondary' : 'text-gray-400'}`}>
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Newsletter promo */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 via-[#0a1a0e] to-gray-950 p-6 border border-white/[0.05]">
                  {/* Ambient glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-logo-primary/15 blur-2xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="w-9 h-9 rounded-xl bg-logo-primary/20 border border-logo-primary/30 flex items-center justify-center mb-4">
                      <Sparkles className="w-4.5 h-4.5 text-logo-secondary" />
                    </div>
                    <h3 className="text-base font-extrabold text-white mb-1.5">Stay in the loop</h3>
                    <p className="text-white/50 text-xs leading-relaxed mb-5">
                      Get the best Jamaican stories delivered to your inbox every morning. Free, forever.
                    </p>
                    <Link href="/newsletter">
                      <button className="w-full py-2.5 bg-logo-primary hover:bg-logo-dark text-white text-xs font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(21,128,61,0.3)]">
                        Subscribe Free →
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Globe, label: 'Countries', value: '50+' },
                    { icon: Newspaper, label: 'Articles', value: '10K+' },
                    { icon: Music, label: 'Artists', value: '500+' },
                    { icon: Star, label: 'Readers / mo', value: '2M+' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-white rounded-xl border border-gray-100 p-3.5 text-center">
                      <Icon className="w-4 h-4 text-logo-primary mx-auto mb-1.5" />
                      <p className="text-base font-black text-gray-900">{value}</p>
                      <p className="text-[10px] text-gray-400">{label}</p>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          )}
        </div>

        {/* ── CTA STRIP ─────────────────────────────────────────────────────────── */}
        <section className="py-16 bg-gradient-to-r from-logo-dark via-logo-primary to-[#16a34a] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-black/15 blur-2xl" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">Never Miss a Story</h2>
            <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">Authentic Jamaican music news and culture delivered daily.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl text-gray-900 text-sm bg-white placeholder-gray-400 focus:outline-none shadow-lg border-0"
              />
              <button className="px-6 py-3 bg-gray-950 hover:bg-black text-white text-sm font-bold rounded-xl transition-colors flex-shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default NewsPage;
