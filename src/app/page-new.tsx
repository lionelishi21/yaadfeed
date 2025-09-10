'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from "motion/react"
import { Play, ArrowRight, Calendar, Share2, ExternalLink, Music, Newspaper, Users, TrendingUp, Star, Clock, Sparkles, Zap, Globe, Heart, Eye, ChevronRight } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter } from '@/components/Card';
import Button from '@/components/ui/Button';
import { NewsItem, Artist, Event } from '@/types';
import { formatters, stringUtils } from '@/utils';

// Simple fallback data
const getFallbackNews = () => [
  {
    id: '1',
    title: 'Jamaican Music Scene Thrives in 2024',
    slug: 'jamaican-music-scene-thrives-2024',
    summary: 'The Jamaican music industry continues to grow with new artists making waves globally.',
    content: 'The Jamaican music industry has seen tremendous growth in 2024, with both reggae and dancehall artists gaining international recognition.',
    imageUrl: '/images/jamaica-flag-bg.jpg',
    category: 'music',
    source: 'YaadFeed',
    publishedAt: new Date(),
    author: 'YaadFeed Editorial',
    tags: ['music', 'jamaica', 'reggae'],
    keywords: ['jamaican music', 'reggae', 'dancehall'],
    isPopular: true,
    viewCount: 1500,
    readTime: 3
  },
  {
    id: '2',
    title: 'New Dancehall Anthem Takes Over Charts',
    slug: 'new-dancehall-anthem-charts',
    summary: 'Latest dancehall track from rising star dominates local and international charts.',
    content: 'A new dancehall anthem has taken the music world by storm, showcasing the continued evolution of Jamaican music.',
    imageUrl: '/images/jamaica-flag-bg.jpg',
    category: 'music',
    source: 'YaadFeed',
    publishedAt: new Date(),
    author: 'YaadFeed Editorial',
    tags: ['music', 'dancehall', 'charts'],
    keywords: ['dancehall', 'music charts', 'jamaica'],
    isPopular: true,
    viewCount: 1200,
    readTime: 2
  },
  {
    id: '3',
    title: 'Jamaican Culture Festival 2024',
    slug: 'jamaican-culture-festival-2024',
    summary: 'Annual celebration of Jamaican culture brings together artists, food, and traditions.',
    content: 'The 2024 Jamaican Culture Festival promises to be the biggest celebration yet, featuring local and international artists.',
    imageUrl: '/images/jamaica-flag-bg.jpg',
    category: 'culture',
    source: 'YaadFeed',
    publishedAt: new Date(),
    author: 'YaadFeed Editorial',
    tags: ['culture', 'festival', 'jamaica'],
    keywords: ['jamaican culture', 'festival', 'celebration'],
    isPopular: false,
    viewCount: 800,
    readTime: 4
  }
];

const getFallbackArtists = () => [
  {
    id: '1',
    name: 'Chronixx',
    bio: 'Jamaican reggae artist known for his conscious lyrics and modern reggae sound.',
    imageUrl: '/images/chronixx.jpg',
    genres: ['Reggae', 'Roots Reggae', 'Conscious Reggae'],
    popularity: 95,
    followers: 1000000,
    isJamaican: true,
    isVerified: true,
    socialMedia: {
      instagram: 'https://instagram.com/chronixxmusic',
      twitter: 'https://twitter.com/chronixxmusic'
    }
  },
  {
    id: '2',
    name: 'Koffee',
    bio: 'Grammy-winning Jamaican reggae artist who has taken the world by storm.',
    imageUrl: '/images/koffee.jpg',
    genres: ['Reggae', 'Dancehall', 'Pop Reggae'],
    popularity: 92,
    followers: 800000,
    isJamaican: true,
    isVerified: true,
    socialMedia: {
      instagram: 'https://instagram.com/koffee',
      twitter: 'https://twitter.com/koffee'
    }
  }
];

const HomePage = () => {
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [trendingArtists, setTrendingArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data immediately with fallbacks
    console.log('Loading homepage...');
    
    // Set fallback data immediately
    const allNews = getFallbackNews();
    setFeaturedNews(allNews.slice(0, 3));
    setLatestNews(allNews.slice(3, 6));
    setTrendingArtists(getFallbackArtists());
    
    // Stop loading
    setLoading(false);
    
    console.log('Homepage loaded with fallback data');
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-logo-light via-white to-logo-muted flex items-center justify-center">
        <div className="text-center">
          <div className="loading-shimmer w-32 h-8 rounded-lg mb-4"></div>
          <p className="text-gray-600">Loading YaadFeed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-logo-light via-white to-logo-muted">
      <ClientHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-logo-dark via-logo-primary to-logo-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Welcome to YaadFeed
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Your premier source for Jamaican music, culture, and entertainment news
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button className="bg-white text-logo-primary hover:bg-gray-100">
                <Music className="w-5 h-5 mr-2" />
                Explore Music
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-logo-primary">
                <Newspaper className="w-5 h-5 mr-2" />
                Read News
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Stories
            </h2>
            <p className="text-lg text-gray-600">
              Stay updated with the latest from the Jamaican music and culture scene
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredNews.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48 w-full">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover rounded-t-xl"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-logo-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{formatters.formatDate(article.publishedAt)}</span>
                      <span>{article.readTime} min read</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Artists */}
      <section className="py-16 bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trending Artists
            </h2>
            <p className="text-lg text-gray-600">
              Discover the hottest Jamaican artists making waves
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trendingArtists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={artist.imageUrl}
                        alt={artist.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-semibold">{artist.name}</h3>
                        {artist.isVerified && (
                          <Star className="w-5 h-5 text-logo-primary fill-current" />
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{artist.bio}</p>
                      <div className="flex flex-wrap gap-1">
                        {artist.genres.slice(0, 2).map((genre, idx) => (
                          <span
                            key={idx}
                            className="bg-logo-light text-logo-dark px-2 py-1 rounded text-xs"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
