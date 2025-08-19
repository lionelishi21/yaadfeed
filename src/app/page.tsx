'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from "motion/react"
import { Play, ArrowRight, Calendar,Share2,ExternalLink,  Music, Newspaper, Users, TrendingUp, Star, Clock, Sparkles, Zap, Globe, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {  Card, CardContent, CardFooter  } from '@/components/Card';
import Button from '@/components/ui/Button';
import { PlayfulHeroSection } from '@/components/heros/PlayfulHeroSection';
import { NewsItem, Artist, Event } from '@/types';
import { formatters, stringUtils } from '@/utils';
import SimpleThreeColumnWithSmallIcons from '@/components/blocks/feature-sections/simple-three-column-with-small-icons';

// Helper function for AI-generated fallback images (replaces Unsplash)
const getFallbackImage = async (category: string, width: number, height: number): Promise<string> => {
  try {
    // Try to generate an AI image for the fallback
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
  // Use local placeholder as fallback
  return `/images/placeholder-${category}.jpg`;
};

// Helper function to get category keywords
const getCategoryKeywords = (category: string): string[] => {
  const categoryMap: { [key: string]: string[] } = {
    'sports': ['sports', 'jamaica', 'athletic', 'competition'],
    'politics': ['government', 'building', 'professional', 'jamaica'],
    'business': ['business', 'office', 'success', 'jamaica'],
    'entertainment': ['party', 'celebration', 'fun', 'jamaica'],
    'health': ['health', 'medical', 'wellness', 'jamaica'],
    'education': ['education', 'school', 'learning', 'jamaica'],
    'culture': ['culture', 'art', 'heritage', 'jamaica'],
    'music': ['music', 'reggae', 'jamaica', 'dancehall'],
    'dancehall': ['dancehall', 'music', 'jamaica', 'reggae'],
    'general': ['jamaica', 'tropical', 'caribbean', 'island']
  };
  return categoryMap[category.toLowerCase()] || categoryMap['general'];
};

// Function to check if content is dancehall/music related
const isDancehallContent = (title: string, summary: string, keywords: string[]): boolean => {
  const dancehallTerms = [
    'dancehall', 'reggae', 'soca', 'afrobeats', 'bashment', 'riddim',
    'artist', 'music', 'song', 'album', 'concert', 'festival',
    'vybz kartel', 'shenseea', 'spice', 'skillibeng', 'chronic law',
    'popcaan', 'mavado', 'beenie man', 'bounty killer', 'sean paul'
  ];

  const content = `${title} ${summary} ${keywords.join(' ')}`.toLowerCase();
  return dancehallTerms.some(term => content.includes(term));
};

// Component for handling news images
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
    return <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-lg"></div>;
  }
  if (error) {
    return <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-lg"><p className="text-gray-500">{error}</p></div>;
  }
  if (!imageSrc) {
    return <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-lg"><p className="text-gray-500">No image available</p></div>;
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

const HomePage = () => {
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [trendingArtists, setTrendingArtists] = useState<Artist[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroAnimation, setHeroAnimation] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load news from MongoDB API
        const newsResponse = await fetch('/api/news');
        if (newsResponse.ok) {
          const responseData = await newsResponse.json();
          const newsData = responseData.news || responseData || [];
          if (newsData && newsData.length > 0) {
            const featured = newsData.slice(0, Math.min(6, newsData.length));
            const latest = newsData.length > 6 
              ? newsData.slice(3, Math.min(14, newsData.length))
              : newsData.slice(0, Math.min(8, newsData.length));
            setFeaturedNews(featured);
            setLatestNews(latest);
          }
        }
        // Load artists from MongoDB API
        try {
          const artistsResponse = await fetch('/api/artists');
          if (artistsResponse.ok) {
            const artistsData = await artistsResponse.json();
            if (artistsData && artistsData.artists) {
              // Show verified artists first, then others, regardless of popularity score
              const trending = artistsData.artists
                .sort((a: Artist, b: Artist) => {
                  // Sort by verification status first, then by popularity
                  if (a.isVerified && !b.isVerified) return -1;
                  if (!a.isVerified && b.isVerified) return 1;
                  return (b.popularity || 0) - (a.popularity || 0);
                })
                .slice(0, 6);
              
              const events: Event[] = artistsData.artists.flatMap((artist: Artist) => artist.upcomingEvents || []).slice(0, 4);
              setTrendingArtists(trending);
              setUpcomingEvents(events);
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
    setTimeout(() => setHeroAnimation(true), 100);
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: 'Breaking News',
      description: 'Real-time updates from Jamaica and the Caribbean diaspora',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Music,
      title: 'Music Culture',
      description: 'Dive deep into dancehall, reggae, and afrobeats',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Connect with Jamaicans worldwide',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Authentic Stories',
      description: 'Real voices, real experiences, real culture',
      color: 'from-red-400 to-pink-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-logo-light via-white to-logo-muted">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="loading-shimmer w-32 h-8 rounded-lg"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-logo-light via-white to-logo-muted">
      <Header />
      
      {/* ENHANCED HERO SECTION - MAXIMUM ATTENTION GRABBING */}
      <PlayfulHeroSection />


      {/* ENHANCED FEATURES SECTION */}
      <SimpleThreeColumnWithSmallIcons />

      {/* ENHANCED FEATURED NEWS SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-screen-2xl mx-auto px-6">
         
         {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-logo-dark mb-4">
            Featured <span className="text-logo-primary">Stories</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          The stories that matter most to Jamaica and our global community
          </p>
        </motion.div>
          

          {/* Enhanced grid layout */}
          {featuredNews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
              {featuredNews.slice(0, 6).map((article, idx) => (
                   <motion.div
                   key={article.id}
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.6, delay: idx * 0.1 }}
                 >
                <Link href={`/news/${article.slug || article.id}`}> 
                  <Card className="h-full bg-white hover:shadow-soft-lg transition-all duration-300 border border-gray-200 group">
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <NewsImage article={article} width={800} height={500} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      
                      {/* Enhanced overlay with category badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-4 py-2 rounded-lg text-sm font-bold text-white ${
                          idx === 0 ? 'bg-logo-secondary' : 
                          'bg-logo-primary'
                        }`}>
                          {idx === 0 ? '🔥 Featured' : stringUtils.capitalize(article.category || 'general')}
                        </span>
                      </div>
                      
                      {/* Time badge */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-lg text-sm font-semibold">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {formatters.relative(article.publishedAt)}
                      </div>
                    </div>
                    
                    
                    <CardContent className="p-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-logo-primary transition-colors duration-300 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-lg mb-6 leading-relaxed line-clamp-3">
                          {article.summary}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-logo-primary font-semibold flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {article.readTime} min read
                        </span>
                        <span className="text-sm text-gray-500 capitalize bg-gray-100 px-3 py-1 rounded-lg">
                          {article.category}
                        </span>
                      </div>
                    </CardContent>
                       {/* Social Sharing & Read More */}
                    <CardFooter className="p-6 pt-0">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="text-logo-primary hover:text-logo-dark">
                          Read More
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* View all news CTA */}
          <div className="text-center">
            <Link href="/news">
              <Button className="bg-logo-primary hover:bg-logo-dark text-white shadow-soft-lg hover:shadow-soft-xl transition-all duration-300 hover:scale-105 text-xl font-bold px-10 py-5 group">
                View All Stories
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              </Link>
          </div>
        </div>
      </section>

      {/* ENHANCED LATEST NEWS SECTION */}
      <section className="py-24 bg-logo-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black text-logo-dark mb-4">
                Latest <span className="text-logo-primary">News</span>
              </h2>
              <p className="text-gray-600 text-xl">Stay updated with breaking stories</p>
            </div>
            <Link href="/news">
              <Button className="bg-logo-primary hover:bg-logo-dark text-white shadow-soft hover:shadow-soft-lg transition-all duration-300 group">
                View All News
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {latestNews.slice(0, 8).map((article, index) => (
                <Link key={article.id} href={`/news/${article.slug || article.id}`}>
                  <Card className="group cursor-pointer overflow-hidden bg-white border border-gray-200 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:scale-[1.02] h-full">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <NewsImage article={article} width={400} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      
                      {/* Category badge */}
                      <div className="absolute top-2 left-2">
                        <span className="bg-logo-primary text-white px-2 py-1 rounded-lg text-xs font-semibold">
                          {stringUtils.capitalize(article.category || 'general')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-500 text-xs flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatters.relative(article.publishedAt)}
                        </span>
                      </div>
                      
                      <h3 className="text-sm font-bold text-gray-900 mb-3 leading-tight group-hover:text-logo-primary transition-colors line-clamp-2">
                        {article.title || 'Untitled Article'}
                      </h3>
                      
                      <p className="text-gray-600 text-xs line-clamp-2 mb-4">
                        {article.summary || 'No summary available'}
                      </p>
                      
                      <div className="text-logo-primary text-xs font-semibold flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {article.readTime || 1} min read
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-logo-primary text-lg mb-4">🔄 Loading latest news...</div>
              <p className="text-gray-500">Our news scraper is gathering the latest stories from Jamaica.</p>
            </div>
          )}
        </div>
      </section>

      {/* ENHANCED TRENDING ARTISTS SECTION */}
      <section className="py-24 bg-logo-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black text-logo-dark mb-4">
                Trending <span className="text-logo-primary">Artists</span>
              </h2>
              <p className="text-gray-600 text-xl">Discover Jamaica's musical talents</p>
            </div>
            <Link href="/artists" className="bg-logo-primary hover:bg-logo-dark text-white px-8 py-4 rounded-lg font-semibold shadow-soft hover:shadow-soft-lg transition-all duration-300 group">
              Explore Artists
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {trendingArtists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {trendingArtists.map((artist, index) => (
                <Link key={artist.id} href={`/artists/${artist.id}`}>
                  <Card className="animate-slide-up cursor-pointer hover:shadow-soft-lg transition-all duration-200 hover:scale-[1.02] bg-white border border-gray-200 p-8" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-logo-primary/20 shadow-soft">
                        <Image
                          src={artist.imageUrl || '/images/jamaica-flag-bg.jpg'}
                          alt={artist.name || 'Artist'}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-2xl font-black text-logo-dark hover:text-logo-primary transition-colors truncate leading-tight">
                            {artist.name || 'Unknown Artist'}
                          </h3>
                          {artist.isVerified && (
                            <div className="w-7 h-7 bg-logo-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-soft">
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 text-base mb-4 font-medium">
                          {(artist.genres || []).slice(0, 2).join(', ') || 'Music'}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 font-semibold">
                            {((artist.followers || 0) / 1000000).toFixed(1)}M followers
                          </span>
                          <div className="flex items-center text-logo-primary font-semibold">
                            <div className="w-2 h-2 bg-logo-primary rounded-full mr-2 animate-pulse"></div>
                            <span>{artist.popularity || 0}% popularity</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-logo-primary text-lg mb-4">🎵 Loading trending artists...</div>
              <p className="text-gray-500">Discovering Jamaica's hottest musical talents.</p>
            </div>
          )}
        </div>
      </section>

      {/* ENHANCED UPCOMING EVENTS SECTION */}
      {upcomingEvents.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-16">
              <div>
                <h2 className="text-4xl lg:text-5xl font-black text-logo-dark mb-4">
                  Upcoming <span className="text-logo-primary">Events</span>
                </h2>
                <p className="text-gray-600 text-xl">Don't miss these exciting events</p>
              </div>
              <Link href="/events" className="bg-logo-primary hover:bg-logo-dark text-white px-8 py-4 rounded-lg font-semibold shadow-soft hover:shadow-soft-lg transition-all duration-300 group">
                View All Events
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {upcomingEvents.map((event, index) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="animate-slide-up cursor-pointer hover:shadow-soft-lg transition-all duration-200 hover:scale-[1.02] bg-white border border-gray-200" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex items-start space-x-6">
                      <div className="bg-logo-primary text-white p-4 rounded-lg text-center min-w-[70px] shadow-soft">
                        <div className="text-xl font-bold">
                          {(() => {
                            if (!event.date) return '?';
                            try {
                              const formatted = formatters.date(event.date);
                              if (formatted === 'No date' || formatted === 'Invalid date') return '?';
                              const parts = formatted.split(' ');
                              return parts[1] || '?';
                            } catch {
                              return '?';
                            }
                          })()}
                        </div>
                        <div className="text-sm">
                          {(() => {
                            if (!event.date) return '?';
                            try {
                              const formatted = formatters.date(event.date);
                              if (formatted === 'No date' || formatted === 'Invalid date') return '?';
                              const parts = formatted.split(' ');
                              return parts[0] || '?';
                            } catch {
                              return '?';
                            }
                          })()}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-logo-dark mb-2 hover:text-logo-primary transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {event.venue}, {event.location}
                        </p>
                        <p className="text-gray-500 text-sm mb-4">
                          {event.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-logo-primary font-bold text-lg">
                            {event.price}
                          </span>
                          <Button size="sm" className="bg-logo-primary hover:bg-logo-dark text-white" onClick={() => {
                            // Handle ticket purchase - could open ticket URL or modal
                            if (event.ticketUrl) {
                              window.open(event.ticketUrl, '_blank');
                            }
                          }}>
                            Get Tickets
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ENHANCED NEWSLETTER CTA SECTION */}
      <section className="py-24 bg-logo-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-soft-xl">
            <h2 className="text-4xl lg:text-5xl font-black text-logo-dark mb-8">
              Never Miss a <span className="text-logo-primary">Beat</span>
            </h2>
            <p className="text-gray-600 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Subscribe to our newsletter for exclusive content, breaking news, 
              and the latest from Jamaica's vibrant culture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-logo-primary shadow-soft text-lg border border-gray-200"
              />
              <Button className="bg-logo-primary hover:bg-logo-dark text-white shadow-soft hover:shadow-soft-lg transition-all duration-300 group px-8 py-4 text-lg font-semibold">
                Subscribe Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <p className="text-gray-500 text-sm mt-6">
              Free forever. No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
