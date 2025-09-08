'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from "motion/react"
import { Play, ArrowRight, Calendar, Share2, ExternalLink, Music, Newspaper, Users, TrendingUp, Star, Clock, Sparkles, Zap, Globe, Heart, Eye, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter } from '@/components/Card';
import Button from '@/components/ui/Button';
import Preloader from '@/components/ui/Preloader';
import { NewsGridSkeleton, ArtistSkeleton, EventSkeleton, HeroSkeleton } from '@/components/ui/LoadingSkeleton';
import { NewsItem, Artist, Event } from '@/types';
import { formatters, stringUtils } from '@/utils';

// Helper function for AI-generated fallback images (replaces Unsplash)
const getFallbackImage = async (category: string, width: number, height: number): Promise<string> => {
  // Use local placeholder images by default for better performance
  // AI image generation should only happen during article creation, not on every page load
  return `/images/placeholder-${category}.jpg`;
};

// Component for handling news images with lazy loading
const NewsImage = ({ article, width, height, className, index = 0 }: { article: NewsItem; width: number; height: number; className: string; index?: number; }) => {
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
      loading={index < 3 ? "eager" : "lazy"}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = `/images/placeholder-${article.category}.jpg`;
      }}
    />
  );
};

const HomePage = () => {
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [trendingArtists, setTrendingArtists] = useState<Artist[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch real articles from the API
        const [newsResponse, artistsResponse] = await Promise.allSettled([
          fetch('/api/news?limit=20'),
          fetch('/api/artists')
        ]);

        // Handle news data
        if (newsResponse.status === 'fulfilled' && newsResponse.value.ok) {
          const newsData = await newsResponse.value.json();
          if (newsData.news && newsData.news.length > 0) {
            // Split articles into featured (first 3) and latest (next 6)
            const allNews = newsData.news;
            setFeaturedNews(allNews.slice(0, 3));
            setLatestNews(allNews.slice(3, 9)); // Show 6 more articles
          } else {
            // Fallback to mock data if no articles found
            console.log('No articles found in database, using fallback data');
            setFeaturedNews(getFallbackFeaturedNews());
            setLatestNews(getFallbackLatestNews());
          }
        } else {
          console.error('Failed to fetch news:', newsResponse.status === 'rejected' ? newsResponse.reason : 'API error');
          setFeaturedNews(getFallbackFeaturedNews());
          setLatestNews(getFallbackLatestNews());
        }

        // Handle artists data
        if (artistsResponse.status === 'fulfilled' && artistsResponse.value.ok) {
          const artistsData = await artistsResponse.value.json();
          if (artistsData.artists && artistsData.artists.length > 0) {
            setTrendingArtists(artistsData.artists.slice(0, 2));
          } else {
            setTrendingArtists(getFallbackArtists());
          }
        } else {
          console.error('Failed to fetch artists:', artistsResponse.status === 'rejected' ? artistsResponse.reason : 'API error');
          setTrendingArtists(getFallbackArtists());
        }

        // Events fallback (no API yet)
        setUpcomingEvents(getFallbackEvents());

      } catch (error) {
        console.error('Error loading data:', error);
        // Use fallback data on error
        setFeaturedNews(getFallbackFeaturedNews());
        setLatestNews(getFallbackLatestNews());
        setTrendingArtists(getFallbackArtists());
        setUpcomingEvents([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Fallback data functions
  const getFallbackFeaturedNews = () => [
    {
      id: '1',
      title: 'Jamaica\'s Dancehall Scene Continues to Thrive',
      summary: 'The vibrant dancehall culture in Jamaica continues to influence global music trends.',
      content: 'The vibrant dancehall culture in Jamaica continues to influence global music trends. From the streets of Kingston to international stages, Jamaican artists are making waves with their unique sound and style.',
      category: 'entertainment' as const,
      source: 'jamaica-gleaner' as const,
      imageUrl: '/images/placeholder-music.jpg',
      slug: 'jamaica-dancehall-scene-thrives',
      publishedAt: new Date().toISOString(),
      tags: ['dancehall', 'music', 'jamaica', 'culture'],
      keywords: ['dancehall', 'jamaica', 'music', 'culture']
    },
    {
      id: '2',
      title: 'Reggae Festival 2024: A Celebration of Jamaican Culture',
      summary: 'Join us for the biggest reggae festival celebrating Jamaica\'s rich musical heritage.',
      content: 'Join us for the biggest reggae festival celebrating Jamaica\'s rich musical heritage. This year\'s event promises to be the most spectacular celebration of reggae music and Jamaican culture yet.',
      category: 'entertainment' as const,
      source: 'jamaica-observer' as const,
      imageUrl: '/images/placeholder-entertainment.jpg',
      slug: 'reggae-festival-2024-celebration',
      publishedAt: new Date().toISOString(),
      tags: ['reggae', 'festival', 'jamaica', 'music'],
      keywords: ['reggae', 'festival', 'jamaica', 'music']
    },
    {
      id: '3',
      title: 'Jamaican Athletes Prepare for Olympic Games',
      summary: 'Jamaica\'s track and field stars are training hard for the upcoming Olympic competition.',
      content: 'Jamaica\'s track and field stars are training hard for the upcoming Olympic competition. The nation\'s athletes are known for their speed and determination on the world stage.',
      category: 'sports' as const,
      source: 'sports-jamaica' as const,
      imageUrl: '/images/placeholder-sports.jpg',
      slug: 'jamaican-athletes-olympic-preparation',
      publishedAt: new Date().toISOString(),
      tags: ['olympics', 'athletics', 'jamaica', 'sports'],
      keywords: ['olympics', 'athletics', 'jamaica', 'sports']
    }
  ];

  const getFallbackLatestNews = () => [
    {
      id: '4',
      title: 'New Jamaican Restaurant Opens in Kingston',
      summary: 'Experience authentic Jamaican cuisine in the heart of the capital city.',
      content: 'Experience authentic Jamaican cuisine in the heart of the capital city. The new restaurant brings traditional flavors and modern dining to Kingston\'s food scene.',
      category: 'culture' as const,
      source: 'jamaica-gleaner' as const,
      imageUrl: '/images/placeholder-culture.jpg',
      slug: 'new-jamaican-restaurant-kingston',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      tags: ['restaurant', 'food', 'kingston', 'culture'],
      keywords: ['restaurant', 'food', 'kingston', 'culture']
    },
    {
      id: '5',
      title: 'Jamaica\'s Tech Hub Grows Rapidly',
      summary: 'Kingston\'s technology sector is expanding with new startups and innovation centers.',
      content: 'Kingston\'s technology sector is expanding with new startups and innovation centers. The city is becoming a hub for Caribbean tech innovation and entrepreneurship.',
      category: 'business' as const,
      source: 'jamaica-observer' as const,
      imageUrl: '/images/placeholder-technology.jpg',
      slug: 'jamaica-tech-hub-growth',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['technology', 'startups', 'kingston', 'business'],
      keywords: ['technology', 'startups', 'kingston', 'business']
    },
    {
      id: '6',
      title: 'Jamaica\'s Coffee Industry Booms',
      summary: 'Blue Mountain coffee exports reach record highs as global demand increases.',
      content: 'Jamaica\'s famous Blue Mountain coffee is experiencing unprecedented demand worldwide. The premium coffee variety continues to be a major export and tourism draw for the island.',
      category: 'business' as const,
      source: 'jamaica-gleaner' as const,
      imageUrl: '/images/placeholder-business.jpg',
      slug: 'jamaica-coffee-industry-boom',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['coffee', 'agriculture', 'exports', 'business'],
      keywords: ['coffee', 'agriculture', 'exports', 'business']
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
      },
      discography: [],
      upcomingEvents: []
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
      },
      discography: [],
      upcomingEvents: []
    }
  ];

  const getFallbackEvents = () => [
    {
      id: 'e1',
      title: 'Reggae Sumfest – Montego Bay',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Catherine Hall, Montego Bay',
      imageUrl: '/images/reggae-sumfest.jpg',
      description: 'Jamaica’s biggest summer reggae festival returns with top local and international acts.'
    },
    {
      id: 'e2',
      title: 'Kingston Tech Meetup',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'New Kingston',
      imageUrl: '/images/kingston-tech-hub.jpg',
      description: 'Startups, founders, and builders connect to share demos and opportunities.'
    },
    {
      id: 'e3',
      title: 'Dancehall Night – Portmore',
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Portmore, St. Catherine',
      imageUrl: '/images/placeholder-entertainment.jpg',
      description: 'High-energy performances featuring Jamaica’s hottest dancehall artists.'
    }
  ] as unknown as Event[];

  if (loading) {
    return (
      <Preloader isLoading={true}>
        <div className="min-h-screen bg-white">
          <Header />
          <div className="flex items-center justify-center h-64">
            <div className="loading-shimmer w-32 h-8 rounded-lg"></div>
          </div>
          <Footer />
        </div>
      </Preloader>
    );
  }

  return (
    <Preloader isLoading={false}>
      <div className="min-h-screen bg-white">
        <Header />
        
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-br from-logo-primary to-logo-dark text-white py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                  Latest from the{' '}
                  <span className="text-logo-secondary">Dancehall</span>{' '}
                  Scene
                </h1>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Your source for authentic Jamaican music news, artist features, and cultural stories from the heart of the Caribbean.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="glamour" size="lg" className="group">
                    Explore Stories
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                    Artist Spotlight
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="relative"
              >
                <div className="relative h-80 lg:h-96 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-logo-secondary/20 to-transparent"></div>
                  <div className="relative z-10 h-full flex items-center justify-center">
                    <Image
                      src="/images/skillibeng.jpg"
                      alt="Skillibeng - Dancehall Star"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover rounded-2xl"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">Skillibeng</h3>
                      <p className="text-white/90 text-sm">Dancehall Star</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Why Choose YaadFeed?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the authentic voice of Jamaican culture and music
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Sparkles,
                  title: 'Breaking News',
                  description: 'Real-time updates from Jamaica and the Caribbean diaspora',
                  color: 'text-logo-primary'
                },
                {
                  icon: Music,
                  title: 'Music Culture',
                  description: 'Dive deep into dancehall, reggae, and afrobeats',
                  color: 'text-logo-secondary'
                },
                {
                  icon: Globe,
                  title: 'Global Community',
                  description: 'Connect with Jamaicans worldwide',
                  color: 'text-logo-accent'
                },
                {
                  icon: Heart,
                  title: 'Authentic Stories',
                  description: 'Real voices, real experiences, real culture',
                  color: 'text-logo-primary'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="h-full bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-50 flex items-center justify-center ${feature.color}`}>
                        <feature.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* LATEST MUSIC NEWS SECTION */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Latest Music News
                </h2>
                <p className="text-lg text-gray-600">
                  Stay updated with breaking stories from the music scene
                </p>
              </div>
              <Link href="/news">
                <Button variant="outline" className="group">
                  View All News
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {latestNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestNews.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link href={`/news/${article.slug || article.id}`}>
                      <Card className="h-full bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
                        <div className="aspect-[16/10] overflow-hidden rounded-t-lg">
                          <NewsImage 
                            article={article} 
                            width={400} 
                            height={250} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            index={index}
                          />
                        </div>
                        
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-500 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatters.relative(article.publishedAt)}
                            </span>
                            <span className="text-xs text-logo-primary bg-logo-primary/10 px-2 py-1 rounded-full font-medium">
                              {stringUtils.capitalize(article.category || 'general')}
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
              <NewsGridSkeleton count={3} />
            )}
          </div>
        </section>

        {/* ARTIST HIGHLIGHT SECTION */}
        <section className="py-20 bg-gradient-to-br from-logo-primary/5 to-logo-secondary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Artist Spotlight
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Meet the rising stars and legendary artists shaping Jamaica's music scene
              </p>
            </motion.div>

            {trendingArtists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {trendingArtists.slice(0, 3).map((artist, index) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link href={`/artists/${artist.id}`}>
                      <Card className="h-full bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer overflow-hidden">
                        <div className="aspect-[16/10] overflow-hidden">
                          <Image
                            src={artist.imageUrl || '/images/jamaica-flag-bg.jpg'}
                            alt={artist.name || 'Artist'}
                            width={600}
                            height={375}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-logo-primary transition-colors line-clamp-1">{artist.name || 'Artist'}</h3>
                            {artist.isVerified && (
                              <div className="w-5 h-5 bg-logo-primary rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">✓</span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{(artist.genres || []).slice(0, 2).join(', ') || 'Music'}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{(((artist.followers || 0) / 1000000).toFixed(1))}M followers</span>
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
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Music className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Artists Available</h3>
                <p className="text-gray-600">Check back soon for featured artists</p>
              </div>
            )}
          </div>
        </section>

        {/* FEATURED ARTISTS SECTION */}
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
                  Explore Artists
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {trendingArtists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {trendingArtists.map((artist, index) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link href={`/artists/${artist.id}`}>
                      <Card className="h-full bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-logo-primary/20">
                              <Image
                                src={artist.imageUrl || '/images/jamaica-flag-bg.jpg'}
                                alt={artist.name || 'Artist'}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-logo-primary transition-colors truncate">
                                  {artist.name || 'Unknown Artist'}
                                </h3>
                                {artist.isVerified && (
                                  <div className="w-5 h-5 bg-logo-primary rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-xs font-bold">✓</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-3">
                                {(artist.genres || []).slice(0, 2).join(', ') || 'Music'}
                              </p>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">
                                  {((artist.followers || 0) / 1000000).toFixed(1)}M followers
                                </span>
                                <div className="flex items-center text-logo-primary font-medium">
                                  <div className="w-2 h-2 bg-logo-primary rounded-full mr-2"></div>
                                  <span>{artist.popularity || 0}% popularity</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Array.from({ length: 2 }).map((_, index) => (
                  <ArtistSkeleton key={index} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* UPCOMING EVENTS SECTION */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Upcoming Events</h2>
                <p className="text-lg text-gray-600">Concerts, meetups, and cultural events across Jamaica</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((ev) => (
            <motion.div
                  key={ev.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
                  <Card className="h-full bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="aspect-[16/10] overflow-hidden rounded-t-lg">
                      <Image
                        src={ev.imageUrl || '/images/jamaica-flag-bg.jpg'}
                        alt={ev.title}
                        width={400}
                        height={250}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="text-sm text-gray-500 mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" /> {formatters.date(ev.date as any)}
              </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{ev.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{(ev as any).description}</p>
                      <div className="text-sm text-gray-500">{(ev as any).location}</div>
                    </CardContent>
                  </Card>
            </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </Preloader>
  );
};

export default HomePage;
