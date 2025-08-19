'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, ArrowRight, Calendar, User, Eye, Sparkles, Zap, TrendingUp, Clock, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { NewsItem, NewsCategory } from '@/types';
import { formatters, stringUtils } from '@/utils';

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
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

  useEffect(() => {
    const loadNews = async () => {
      try {
        // Fetch from API (database only - no static fallback)
        const response = await fetch('/api/news');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch news');
        }
        
        setNews(data.news);
        setFilteredNews(data.news);
      } catch (error) {
        console.error('Error loading news:', error);
        // No fallback - show empty state if database fails
        setNews([]);
        setFilteredNews([]);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
    // Trigger page animation after a short delay
    setTimeout(() => setPageAnimation(true), 100);
  }, []);

  useEffect(() => {
    let filtered = news;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredNews(filtered);
  }, [news, selectedCategory, searchQuery]);

  const featuredArticle = filteredNews.find(article => article.isPopular) || filteredNews[0];
  const regularArticles = filteredNews.filter(article => article !== featuredArticle);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Header />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />
      
      {/* ENHANCED PAGE HEADER */}
      <section className="relative bg-gradient-to-br from-modern-bg via-modern-indigo to-modern-navy text-white py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-40 right-40 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-80"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transform transition-all duration-1000 ${pageAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {/* Attention-grabbing badge */}
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-400 to-purple-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                <Sparkles className="w-4 h-4" />
                <span>Breaking News & Updates</span>
              </div>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Jamaica <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">News</span>
            </h1>
            <p className="text-2xl lg:text-3xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
              Stay connected with your island home through comprehensive coverage of Jamaica's vibrant culture, politics, and community
            </p>
            
            {/* Stats */}
            <div className="flex justify-center items-center space-x-8 text-white/80">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-cyan-300" />
                <span className="text-lg font-semibold">{news.length}+ Articles</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-purple-300" />
                <span className="text-lg font-semibold">50K+ Views</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-pink-300" />
                <span className="text-lg font-semibold">24/7 Updates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENHANCED FILTERS SECTION */}
      <section className="py-12 bg-white/80 backdrop-blur-lg border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Enhanced Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search news, topics, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent shadow-lg backdrop-blur-sm transition-all duration-300"
              />
            </div>

            {/* Enhanced Category Filter */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                      selectedCategory === category.value
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-white shadow-lg'
                        : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-lg border border-white/30'
                    }`}
                    style={{animationDelay: `${index * 0.1}s`}}
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

      {/* ENHANCED NEWS CONTENT */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredNews.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No articles found</h3>
              <p className="text-gray-600 text-lg">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-3 lg:gap-12">
              {/* Enhanced Featured Article */}
              {featuredArticle && (
                <div className="lg:col-span-2">
                  <Card className="group cursor-pointer overflow-hidden bg-white/80 backdrop-blur-lg border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] h-full transform hover:-translate-y-2">
                    <div className="aspect-video overflow-hidden relative">
                      <Image
                        src={featuredArticle.imageUrl || '/images/jamaica-flag-bg.jpg'}
                        alt={featuredArticle.title}
                        width={800}
                        height={450}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Enhanced overlay badges */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          🔥 Featured Story
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {formatters.relative(featuredArticle.publishedAt)}
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="bg-gradient-to-r from-cyan-400 to-purple-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {stringUtils.capitalize(featuredArticle.category)}
                        </span>
                      </div>
                      
                      <Link href={`/news/${featuredArticle.slug || featuredArticle.id}`}>
                        <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6 leading-tight group-hover:text-cyan-700 transition-colors duration-300 cursor-pointer">
                          {featuredArticle.title}
                        </h2>
                      </Link>
                      
                      <p className="text-gray-600 text-xl mb-8 leading-relaxed">
                        {featuredArticle.summary}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-cyan-600" />
                            <span className="font-semibold">{featuredArticle.author || 'YaadFeed Team'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <span>{formatters.date(featuredArticle.publishedAt)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Eye className="w-4 h-4 text-pink-600" />
                            <span>{featuredArticle.viewCount} views</span>
                          </div>
                        </div>
                        
                        <Link href={`/news/${featuredArticle.slug || featuredArticle.id}`}>
                          <Button className="bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                            Read Full Story
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Enhanced Sidebar - Recent Articles */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <h3 className="text-2xl font-black text-gray-900">
                    {featuredArticle ? 'More Stories' : 'Latest News'}
                  </h3>
                  <div className="w-8 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
                </div>
                
                {regularArticles.slice(0, 5).map((article, index) => (
                  <Link key={article.id} href={`/news/${article.slug || article.id}`}>
                    <Card className="group cursor-pointer bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] transform hover:-translate-y-1" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="flex space-x-4">
                        <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl ring-2 ring-cyan-200/30">
                          <Image
                            src={article.imageUrl || '/images/jamaica-flag-bg.jpg'}
                            alt={article.title}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                              {stringUtils.capitalize(article.category)}
                            </span>
                            <span className="text-gray-500 text-xs flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatters.relative(article.publishedAt)}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-cyan-700 transition-colors">
                            {article.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="text-cyan-700 font-semibold flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {article.readTime} min read
                            </span>
                            <span className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {article.viewCount} views
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

          {/* Enhanced All Articles Grid */}
          {regularArticles.length > 5 && (
            <div className="mt-20">
              <div className="text-center mb-12">
                <h3 className="text-4xl font-black text-gray-900 mb-4">
                  All <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Articles</span>
                </h3>
                <p className="text-gray-600 text-xl">Discover more stories from Jamaica and beyond</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularArticles.slice(5).map((article, index) => (
                  <Link key={article.id} href={`/news/${article.slug || article.id}`}>
                    <Card className="group cursor-pointer bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full transform hover:-translate-y-2" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="aspect-video mb-4 overflow-hidden rounded-xl relative">
                        <Image
                          src={article.imageUrl || '/images/jamaica-flag-bg.jpg'}
                          alt={article.title}
                          width={400}
                          height={250}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Category badge */}
                        <div className="absolute top-3 left-3">
                          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                            {stringUtils.capitalize(article.category)}
                          </span>
                        </div>
                        
                        {/* Time badge */}
                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatters.relative(article.publishedAt)}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-cyan-700 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                          {article.summary}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-cyan-700 text-sm font-semibold flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {article.readTime} min read
                          </span>
                          <span className="text-gray-500 text-sm flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {article.viewCount} views
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
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
