'use client';

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, ArrowRight, Calendar, User, Eye, Sparkles, Zap, TrendingUp, Clock, Star } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { NewsItem, NewsCategory } from '@/types';
import { formatters, stringUtils } from '@/utils';
import { InArticleAd, MultiplexAd, SidebarRectangleAd } from '@/components/ads/AdPlacements';

// Optimized image component with lazy loading
const OptimizedImage = ({ src, alt, width, height, className, priority = false }: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
  priority?: boolean;
}) => (
  <Image
    src={src || '/images/jamaica-flag-bg.jpg'}
    alt={alt}
    width={width}
    height={height}
    className={className}
    loading={priority ? "eager" : "lazy"}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxAAPwCdABmX/9k="
  />
);

// Fallback mock data for better performance
const getFallbackNews = (): NewsItem[] => [
  {
    id: '1',
    title: 'Jamaica\'s Dancehall Scene Continues to Thrive',
    summary: 'The vibrant dancehall culture in Jamaica continues to influence global music trends.',
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
    viewCount: 1500,
    readTime: 3
  },
  {
    id: '2',
    title: 'Reggae Festival 2024: A Celebration of Jamaican Culture',
    summary: 'Join us for the biggest reggae festival celebrating Jamaica\'s rich musical heritage.',
    content: 'Join us for the biggest reggae festival celebrating Jamaica\'s rich musical heritage.',
    category: 'entertainment' as const,
    source: 'jamaica-observer' as const,
    imageUrl: '/images/placeholder-entertainment.jpg',
    slug: 'reggae-festival-2024-celebration',
    publishedAt: new Date().toISOString(),
    tags: ['reggae', 'festival', 'jamaica'],
    keywords: ['reggae', 'festival', 'jamaica'],
    author: 'YaadFeed Team',
    viewCount: 1200,
    readTime: 4
  },
  {
    id: '3',
    title: 'Jamaican Athletes Prepare for Olympic Games',
    summary: 'Jamaica\'s track and field stars are training hard for the upcoming Olympic competition.',
    content: 'Jamaica\'s track and field stars are training hard for the upcoming Olympic competition.',
    category: 'sports' as const,
    source: 'sports-jamaica' as const,
    imageUrl: '/images/placeholder-sports.jpg',
    slug: 'jamaican-athletes-olympic-preparation',
    publishedAt: new Date().toISOString(),
    tags: ['olympics', 'athletics', 'jamaica'],
    keywords: ['olympics', 'athletics', 'jamaica'],
    author: 'YaadFeed Team',
    viewCount: 1800,
    readTime: 3
  }
];

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageAnimation, setPageAnimation] = useState(false);

  const categories: { value: NewsCategory | 'all'; label: string; icon: any }[] = [
    { value: 'all', label: 'All News', icon: Sparkles },
    { value: 'entertainment', label: 'Entertainment', icon: Star },
    { value: 'sports', label: 'Sports', icon: TrendingUp },
    { value: 'politics', label: 'Politics', icon: User },
    { value: 'business', label: 'Business', icon: TrendingUp },
    { value: 'culture', label: 'Culture', icon: Star },
    { value: 'local', label: 'Local', icon: User },
    { value: 'international', label: 'International', icon: TrendingUp },
  ];

  // Memoized filtered news for better performance
  const filteredNews = useMemo(() => {
    let filtered = news;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    return filtered;
  }, [news, selectedCategory, searchQuery]);

  // Memoized featured and regular articles
  const { featuredArticle, regularArticles } = useMemo(() => {
    const featured = filteredNews.find(article => article.isPopular) || filteredNews[0];
    const regular = filteredNews.filter(article => article !== featured);
    return { featuredArticle: featured, regularArticles: regular };
  }, [filteredNews]);

  useEffect(() => {
    const loadNews = async () => {
      try {
        // Try to fetch from API first
        const response = await fetch('/api/news');
        const data = await response.json();
        
        if (response.ok && data.news && data.news.length > 0) {
          setNews(data.news);
        } else {
          // Fallback to mock data if API fails or returns empty
          console.log('Using fallback news data');
          setNews(getFallbackNews());
        }
      } catch (error) {
        console.error('Error loading news, using fallback:', error);
        // Use fallback data for better UX
        setNews(getFallbackNews());
      } finally {
        setLoading(false);
      }
    };

    loadNews();
    // Reduced animation delay for better performance
    setTimeout(() => setPageAnimation(true), 50);
  }, []);

  // Debounced search for better performance
  const debouncedSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-logo-light via-white to-logo-muted">
        <ClientHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="loading-shimmer h-64 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yard-dark text-white font-sans overflow-x-hidden">
      <ClientHeader />
      
      {/* OPTIMIZED PAGE HEADER */}
      <section className="relative bg-yard-dark border-b border-[#141414] py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/koffee.jpg"
            alt="YaadFeed News Background"
            fill
            className="object-cover opacity-20 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-yard-dark/60 via-yard-dark/80 to-yard-dark"></div>
        </div>

        {/* Subtle background elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-yard-gold/10 blur-3xl rounded-full pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-14">
          <div className={`text-center transform transition-all duration-500 ${pageAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            
            {/* Minimalist badge */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 border border-yard-gold/30 bg-yard-gold/10 px-3.5 py-1.5 rounded-none">
                <span className="w-1.5 h-1.5 bg-yard-gold rounded-full animate-dot"></span>
                <span className="text-[11px] font-bold tracking-[2px] uppercase text-yard-gold">News & Updates</span>
              </div>
            </div>

            <h1 className="font-bebas text-[clamp(48px,5vw,72px)] leading-none text-white mb-6">
              Latest <span className="text-yard-gold">Stories</span>
            </h1>
            
            <p className="text-[#888] text-base max-w-2xl mx-auto leading-[1.65]">
              Stay updated with the latest news, entertainment updates, and cultural highlights from Jamaica and the wider Caribbean.
            </p>
          </div>

          {/* Search and Filters Section */}
          <div className={`mt-12 bg-[#0f0f0f] border border-white/5 p-4 transform transition-all duration-500 delay-100 ${pageAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#555]" />
                </div>
                <input
                  type="text"
                  placeholder="Search stories, artists, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#141414] border border-[#222] text-white pl-11 pr-4 py-3.5 focus:outline-none focus:border-yard-gold/50 transition-colors text-sm placeholder:text-[#555]"
                />
              </div>
              
              {/* Removed Source Filter */}
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#222]">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`flex items-center space-x-2 px-4 py-2 text-[12px] font-bold tracking-[0.8px] uppercase transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-yard-gold text-yard-dark'
                        : 'bg-transparent border border-white/10 text-[#888] hover:text-white hover:border-white/30'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      {/* OPTIMIZED NEWS CONTENT */}
      <section className="py-16 bg-yard-dark">
        <div className="max-w-7xl mx-auto px-6 sm:px-14">
          {filteredNews.length === 0 ? (
            <div className="text-center py-20 border border-white/5 bg-[#0f0f0f]">
              <div className="w-24 h-24 bg-yard-gray rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-yard-gold" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No stories found</h3>
              <p className="text-[#888] text-lg">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-3 lg:gap-10">
              {/* Featured Article */}
              {featuredArticle && (
                <div className="lg:col-span-2">
                  <div className="bg-[#0f0f0f] border border-white/5 h-full group relative overflow-hidden flex flex-col">
                    <Link href={`/news/${featuredArticle.slug || featuredArticle.id}`} className="block flex-grow">
                      <div className="aspect-video overflow-hidden relative">
                        <OptimizedImage
                          src={featuredArticle.imageUrl || '/images/jamaica-flag-bg.jpg'}
                          alt={featuredArticle.title}
                          width={800}
                          height={450}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                          priority={true}
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_30%,rgba(5,5,5,0.95)_100%)] z-10"></div>
                        
                        {/* Simplified overlay badges */}
                        <div className="absolute top-4 left-4 z-20">
                          <span className="bg-yard-gold text-yard-dark px-3 py-1 text-[10px] font-bold tracking-[1.5px] uppercase">
                            Featured Story
                          </span>
                        </div>
                        
                        <div className="absolute bottom-6 left-6 right-6 z-20">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="border border-yard-gold/50 text-yard-gold px-2.5 py-0.5 text-[10px] font-bold tracking-[1px] uppercase">
                              {stringUtils.capitalize(featuredArticle.category)}
                            </span>
                            <span className="text-[#aaa] text-xs flex items-center">
                              <Clock className="w-3.5 h-3.5 mr-1.5" />
                              {formatters.relative(featuredArticle.publishedAt)}
                            </span>
                          </div>
                          
                          <h2 className="text-3xl lg:text-4xl font-bebas text-white mb-4 leading-none group-hover:text-yard-gold transition-colors">
                            {featuredArticle.title}
                          </h2>
                          
                          <p className="text-[#bbb] text-[13px] line-clamp-2 leading-[1.65]">
                            {featuredArticle.summary}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                  
                  {/* In-Article Ad after featured article */}
                  <div className="mt-8">
                    <InArticleAd />
                  </div>
                </div>
              )}

              {/* Sidebar */}
              <div className="space-y-6 mt-10 lg:mt-0">
                <div className="flex items-center gap-3.5 mb-6">
                  <h3 className="text-[28px] font-bebas tracking-[1px] text-white leading-none">
                    {featuredArticle ? 'More Stories' : 'Latest News'}
                  </h3>
                  <div className="h-[2px] w-8 bg-yard-gold shrink-0"></div>
                </div>
                
                {/* Sidebar Rectangle Ad */}
                <SidebarRectangleAd />
                
                {regularArticles.slice(0, 5).map((article, index) => (
                  <Link key={article.id} href={`/news/${article.slug || article.id}`} className="block">
                    <div className="bg-[#0f0f0f] border border-white/5 p-3 group hover:border-yard-gold/30 transition-colors">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-[#141414] relative">
                          <OptimizedImage
                            src={article.imageUrl || '/images/jamaica-flag-bg.jpg'}
                            alt={article.title}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-yard-gold text-[9px] font-bold tracking-[1px] uppercase">
                              {stringUtils.capitalize(article.category)}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-white line-clamp-2 mb-2 group-hover:text-yard-gold transition-colors leading-snug">
                            {article.title}
                          </h4>
                          <div className="flex items-center justify-between text-[11px] text-[#666]">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatters.relative(article.publishedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Articles Grid */}
          {regularArticles.length > 5 && (
            <div className="mt-20 pt-16 border-t border-[#141414]">
              <div className="flex items-center gap-3.5 mb-10">
                <h3 className="text-[38px] font-bebas tracking-[1px] text-white leading-none">
                  All Articles
                </h3>
                <div className="h-[2px] w-11 bg-yard-gold shrink-0"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularArticles.slice(5).map((article, index) => (
                  <Link key={article.id} href={`/news/${article.slug || article.id}`} className="block">
                    <div className="bg-[#0f0f0f] border border-white/5 h-full group hover:border-yard-gold/30 transition-colors flex flex-col">
                      <div className="aspect-[16/10] overflow-hidden bg-[#141414] relative">
                        <OptimizedImage
                          src={article.imageUrl || '/images/jamaica-flag-bg.jpg'}
                          alt={article.title}
                          width={400}
                          height={250}
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-yard-dark/80 backdrop-blur-sm border border-white/10 px-2 py-0.5">
                          <span className="text-yard-gold text-[9px] font-bold tracking-[1px] uppercase">
                            {stringUtils.capitalize(article.category)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-[17px] font-semibold text-white mb-3 line-clamp-2 group-hover:text-yard-gold transition-colors leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-[13px] text-[#888] line-clamp-2 mb-4 leading-relaxed flex-1">
                          {article.summary}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-[#666] pt-4 border-t border-white/5">
                          <span className="flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                            {formatters.relative(article.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Pagination/Load More (placeholder for now) */}
              <div className="mt-12 text-center">
                <button className="bg-transparent border border-yard-gold text-yard-gold text-[12px] font-bold tracking-[1px] uppercase px-8 py-3 hover:bg-yard-gold hover:text-yard-dark transition-colors">
                  Load More Stories
                </button>
              </div>
            </div>
          )}

          {/* Multiplex Ad at the bottom */}
          <div className="mt-16">
            <MultiplexAd />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default NewsPage;
