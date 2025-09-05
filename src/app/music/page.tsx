'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from "motion/react";
import { Play, ArrowRight, Calendar, Share2, ExternalLink, Music, Clock, Sparkles, Heart, Eye, ChevronRight, Filter, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/Card';
import Button from '@/components/ui/Button';
import { NewsItem, Artist } from '@/types';
import { formatters, stringUtils } from '@/utils';

// Helper function for AI-generated fallback images
const getFallbackImage = async (category: string, width: number, height: number): Promise<string> => {
  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `Jamaica ${category}`,
        category,
        keywords: getCategoryKeywords(category),
        summary: '',
        forceGenerate: true
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        return result.imageUrl;
      }
    }
  } catch (error) {
    console.error('AI fallback generation failed:', error);
  }
  return `/images/placeholder-${category}.jpg`;
};

const getCategoryKeywords = (category: string): string[] => {
  const categoryMap: { [key: string]: string[] } = {
    'music': ['music', 'reggae', 'jamaica', 'dancehall'],
    'dancehall': ['dancehall', 'music', 'jamaica', 'reggae'],
    'reggae': ['reggae', 'music', 'jamaica', 'bob marley'],
    'afrobeats': ['afrobeats', 'music', 'africa', 'jamaica'],
    'general': ['jamaica', 'tropical', 'caribbean', 'island']
  };
  return categoryMap[category.toLowerCase()] || categoryMap['general'];
};

// Component for handling music news images
const MusicNewsImage = ({ article, width, height, className }: { article: NewsItem; width: number; height: number; className: string; }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        setError(null);
        const src = article.imageUrl || await getFallbackImage(article.category, width, height);
        setImageSrc(src);
      } catch (err) {
        setError('Failed to load image');
        console.error('Error loading image:', err);
      } finally {
        setLoading(false);
      }
    };
    loadImage();
  }, [article.imageUrl, article.category, width, height]);

  if (loading) {
    return <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg"></div>;
  }
  if (error) {
    return <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg"><p className="text-gray-500">{error}</p></div>;
  }
  if (!imageSrc) {
    return <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg"><p className="text-gray-500">No image available</p></div>;
  }
  return (
    <Image
      src={imageSrc}
      alt={article.title}
      width={width}
      height={height}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = `/images/placeholder-${article.category}.jpg`;
      }}
    />
  );
};

const MusicPage = () => {
  const [musicNews, setMusicNews] = useState<NewsItem[]>([]);
  const [trendingArtists, setTrendingArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load music-related news
        const newsResponse = await fetch('/api/news');
        if (newsResponse.ok) {
          const responseData = await newsResponse.json();
          const newsData = responseData.news || responseData || [];
          if (newsData && newsData.length > 0) {
            // Filter for music-related news
            const musicNewsData = newsData.filter((article: NewsItem) => 
              ['music', 'dancehall', 'reggae', 'entertainment'].includes(article.category?.toLowerCase() || '')
            );
            setMusicNews(musicNewsData);
          }
        }

        // Load artists
        try {
          const artistsResponse = await fetch('/api/artists');
          if (artistsResponse.ok) {
            const artistsData = await artistsResponse.json();
            if (artistsData && artistsData.artists) {
              const trending = artistsData.artists
                .sort((a: Artist, b: Artist) => {
                  if (a.isVerified && !b.isVerified) return -1;
                  if (!a.isVerified && b.isVerified) return 1;
                  return (b.popularity || 0) - (a.popularity || 0);
                })
                .slice(0, 8);
              setTrendingArtists(trending);
            }
          }
        } catch (error) {
          console.log('Artist data not available:', error);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const categories = [
    { id: 'all', name: 'All Music', count: musicNews.length },
    { id: 'dancehall', name: 'Dancehall', count: musicNews.filter(n => n.category === 'dancehall').length },
    { id: 'reggae', name: 'Reggae', count: musicNews.filter(n => n.category === 'reggae').length },
    { id: 'afrobeats', name: 'Afrobeats', count: musicNews.filter(n => n.category === 'afrobeats').length },
    { id: 'entertainment', name: 'Entertainment', count: musicNews.filter(n => n.category === 'entertainment').length },
  ];

  const filteredNews = selectedCategory === 'all' 
    ? musicNews 
    : musicNews.filter(article => article.category?.toLowerCase() === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-logo-primary to-logo-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Music className="w-4 h-4 mr-2" />
              Jamaica's Music Scene
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Latest from the{' '}
              <span className="text-logo-secondary">Music</span>{' '}
              World
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover the latest news, artist updates, and cultural stories from Jamaica's vibrant music scene.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-logo-primary text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.name}
                <span className="ml-2 text-sm opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Music News Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Music News
              </h2>
              <p className="text-lg text-gray-600">
                Stay updated with the latest from Jamaica's music scene
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search music news..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-logo-primary/30"
                />
              </div>
              <Button variant="outline" className="group">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/news/${article.slug || article.id}`}>
                    <Card className="h-full bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
                      <div className="aspect-[16/10] overflow-hidden rounded-t-lg">
                        <MusicNewsImage 
                          article={article} 
                          width={400} 
                          height={250} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-500 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatters.relative(article.publishedAt)}
                          </span>
                          <span className="text-xs text-logo-primary bg-logo-primary/10 px-2 py-1 rounded-full font-medium">
                            {stringUtils.capitalize(article.category || 'music')}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight group-hover:text-logo-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {article.summary}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {article.readTime || 1} min read
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-logo-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No music news found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later for new content.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Featured Artists
              </h2>
              <p className="text-lg text-gray-600">
                Discover Jamaica's musical talents
              </p>
            </div>
            <Link href="/artists">
              <Button variant="outline" className="group">
                View All Artists
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {trendingArtists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingArtists.map((artist, index) => (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/artists/${artist.id}`}>
                    <Card className="h-full bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-logo-primary/20">
                          <Image
                            src={artist.imageUrl || '/images/jamaica-flag-bg.jpg'}
                            alt={artist.name || 'Artist'}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-logo-primary transition-colors">
                            {artist.name || 'Unknown Artist'}
                          </h3>
                          {artist.isVerified && (
                            <div className="w-4 h-4 bg-logo-primary rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">
                          {(artist.genres || []).slice(0, 2).join(', ') || 'Music'}
                        </p>
                        
                        <div className="flex items-center justify-center text-sm">
                          <div className="flex items-center text-logo-primary font-medium">
                            <div className="w-2 h-2 bg-logo-primary rounded-full mr-2"></div>
                            <span>{artist.popularity || 0}% popularity</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No artists found</h3>
              <p className="text-gray-600">Check back later for featured artists.</p>
            </div>
          )}
        </div>
      </section>

      {/* Music Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Explore Music Genres
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dive deep into Jamaica's diverse music culture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Dancehall',
                description: 'The energetic beats and rhythms of modern Jamaican music',
                icon: Music,
                color: 'text-logo-primary',
                bgColor: 'bg-logo-primary/10',
                href: '/news?category=dancehall'
              },
              {
                title: 'Reggae',
                description: 'The soulful sounds that put Jamaica on the world map',
                icon: Music,
                color: 'text-logo-secondary',
                bgColor: 'bg-logo-secondary/10',
                href: '/news?category=reggae'
              },
              {
                title: 'Afrobeats',
                description: 'The fusion of African and Caribbean musical traditions',
                icon: Music,
                color: 'text-logo-accent',
                bgColor: 'bg-logo-accent/10',
                href: '/news?category=afrobeats'
              }
            ].map((genre, index) => (
              <motion.div
                key={genre.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={genre.href}>
                  <Card className="h-full bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-8 text-center">
                      <div className={`w-16 h-16 mx-auto mb-6 rounded-xl ${genre.bgColor} flex items-center justify-center ${genre.color}`}>
                        <genre.icon className="w-8 h-8" />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-logo-primary transition-colors">
                        {genre.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {genre.description}
                      </p>
                      
                      <Button variant="outline" size="sm" className="group">
                        Explore {genre.title}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-logo-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Never Miss a Beat
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Subscribe to our newsletter for exclusive music content, artist updates, and the latest from Jamaica's vibrant music scene.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 text-lg border-0"
              />
              <Button variant="glamour" size="lg" className="group px-8 py-4 text-lg font-semibold">
                Subscribe Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <p className="text-white/70 text-sm mt-6">
              Free forever. No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MusicPage;
