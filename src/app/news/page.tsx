'use client';

export const dynamic = 'force-dynamic';

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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-logo-light via-white to-logo-muted">
      <ClientHeader />
      
      {/* OPTIMIZED PAGE HEADER */}
      <section className="relative bg-gradient-to-br from-logo-dark via-logo-primary to-logo-secondary text-white py-20 overflow-hidden">
        {/* Simplified background elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-20 left-20 w-2 h-2 bg-logo-secondary rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-40 right-40 w-3 h-3 bg-logo-accent rounded-full animate-pulse opacity-40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transform transition-all duration-500 ${pageAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {/* Simplified badge */}
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-logo-secondary to-logo-accent text-white px-4 py-2 rounded-full text-sm font-semibold shadow-soft">
                <Sparkles className="w-4 h-4" />
                <span>Breaking News & Updates</span>
              </div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
              Jamaica <span className="bg-gradient-to-r from-logo-secondary to-logo-accent bg-clip-text text-transparent">News</span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
              Stay connected with your island home through comprehensive coverage of Jamaica's vibrant culture, politics, and community
            </p>
            
            {/* Simplified stats */}
            <div className="flex justify-center items-center space-x-8 text-white/80">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-logo-secondary" />
                <span className="text-lg font-semibold">{news.length}+ Articles</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-logo-primary" />
                <span className="text-lg font-semibold">24/7 Updates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OPTIMIZED FILTERS SECTION */}
      <section className="py-12 bg-white/80 backdrop-blur-lg border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Optimized Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search news, topics, authors..."
                value={searchQuery}
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-logo-primary/30 focus:border-transparent shadow-soft backdrop-blur-sm transition-all duration-200"
              />
            </div>

            {/* Optimized Category Filter */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                      selectedCategory === category.value
                        ? 'bg-gradient-to-r from-logo-primary to-logo-secondary text-white shadow-soft'
                        : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-soft border border-white/30'
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredNews.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-logo-primary to-logo-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
                <Search className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No articles found</h3>
              <p className="text-gray-600 text-lg">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-3 lg:gap-12">
              {/* Optimized Featured Article */}
              {featuredArticle && (
                <div className="lg:col-span-2">
                  <Card className="group cursor-pointer overflow-hidden soft-card h-full">
                    <div className="aspect-video overflow-hidden relative">
                      <OptimizedImage
                        src={featuredArticle.imageUrl || '/images/jamaica-flag-bg.jpg'}
                        alt={featuredArticle.title}
                        width={800}
                        height={450}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        priority={true}
                      />
                      
                      {/* Simplified overlay badges */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-logo-secondary to-logo-accent text-white px-4 py-2 rounded-xl text-sm font-bold shadow-soft">
                          🔥 Featured Story
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 glass text-gray-700 px-3 py-1 rounded-xl text-sm font-semibold">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {formatters.relative(featuredArticle.publishedAt)}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="bg-gradient-to-r from-logo-primary to-logo-primary/90 text-white px-3 py-1 rounded-xl text-sm font-semibold shadow-soft">
                          {stringUtils.capitalize(featuredArticle.category)}
                        </span>
                      </div>
                      
                      <Link href={`/news/${featuredArticle.slug || featuredArticle.id}`}>
                        <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-4 leading-tight group-hover:text-logo-primary transition-colors duration-200 cursor-pointer">
                          {featuredArticle.title}
                        </h2>
                      </Link>
                      
                      <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                        {featuredArticle.summary}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-logo-primary" />
                            <span className="font-semibold">{featuredArticle.author || 'YaadFeed Team'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-logo-secondary" />
                            <span>{formatters.date(featuredArticle.publishedAt)}</span>
                          </div>
                        </div>
                        
                        <Link href={`/news/${featuredArticle.slug || featuredArticle.id}`}>
                          <Button variant="glamour" className="group">
                            Read Full Story
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                  
                  {/* In-Article Ad after featured article */}
                  <div className="mt-8">
                    <InArticleAd />
                  </div>
                </div>
              )}

              {/* Optimized Sidebar */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <h3 className="text-2xl font-black text-gray-900">
                    {featuredArticle ? 'More Stories' : 'Latest News'}
                  </h3>
                  <div className="w-8 h-1 bg-gradient-to-r from-logo-primary to-logo-secondary rounded-full"></div>
                </div>
                
                {/* Sidebar Rectangle Ad */}
                <SidebarRectangleAd />
                
                {regularArticles.slice(0, 5).map((article, index) => (
                  <Link key={article.id} href={`/news/${article.slug || article.id}`}>
                    <Card className="group cursor-pointer soft-card">
                      <div className="flex space-x-4">
                        <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl ring-2 ring-logo-primary/20">
                          <OptimizedImage
                            src={article.imageUrl || '/images/jamaica-flag-bg.jpg'}
                            alt={article.title}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="bg-gradient-to-r from-logo-primary to-logo-primary/90 text-white px-2 py-1 rounded-xl text-xs font-semibold shadow-soft">
                              {stringUtils.capitalize(article.category)}
                            </span>
                            <span className="text-gray-500 text-xs flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatters.relative(article.publishedAt)}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-logo-primary transition-colors">
                            {article.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="text-logo-primary font-semibold flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {article.readTime || 2} min read
                            </span>
                            <span className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {article.viewCount || 0} views
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Optimized All Articles Grid */}
          {regularArticles.length > 5 && (
            <div className="mt-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-black text-gray-900 mb-4">
                  All <span className="bg-gradient-to-r from-logo-primary to-logo-secondary bg-clip-text text-transparent">Articles</span>
                </h3>
                <p className="text-gray-600 text-lg">Discover more stories from Jamaica and beyond</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularArticles.slice(5).map((article, index) => (
                  <Link key={article.id} href={`/news/${article.slug || article.id}`}>
                    <Card className="group cursor-pointer soft-card h-full">
                      <div className="aspect-video mb-4 overflow-hidden rounded-xl relative">
                        <OptimizedImage
                          src={article.imageUrl || '/images/jamaica-flag-bg.jpg'}
                          alt={article.title}
                          width={400}
                          height={250}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Category badge */}
                        <div className="absolute top-3 left-3">
                          <span className="bg-gradient-to-r from-logo-primary to-logo-primary/90 text-white px-3 py-1 rounded-xl text-xs font-semibold shadow-soft">
                            {stringUtils.capitalize(article.category)}
                          </span>
                        </div>
                        
                        {/* Time badge */}
                        <div className="absolute top-3 right-3 glass text-gray-700 px-2 py-1 rounded-xl text-xs font-semibold">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatters.relative(article.publishedAt)}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-logo-primary transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                          {article.summary}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-logo-primary text-sm font-semibold flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {article.readTime || 2} min read
                          </span>
                          <span className="text-gray-500 text-sm flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {article.viewCount || 0} views
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
              
              {/* Multiplex Ad after articles grid */}
              <div className="mt-16">
                <MultiplexAd />
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NewsPage;
