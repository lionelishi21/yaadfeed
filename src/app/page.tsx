  'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, ArrowRight, Calendar, Share2, ExternalLink, Music, Newspaper, Users, TrendingUp, Star, Clock, Sparkles, Zap, Globe, Heart, Eye, ChevronRight } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import Preloader from '@/components/ui/Preloader';

// Types
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
  socialLinks: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  imageUrl?: string;
  description: string;
}

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
        console.log('🔄 Starting to load homepage data...');
        setLoading(true);
        
        // Fetch news data
        const newsResponse = await fetch('/api/news?limit=12');
        const newsData = await newsResponse.json();

          if (newsData.news && newsData.news.length > 0) {
          const articles = newsData.news.map((article: any) => ({
            ...article,
            _id: article.id,
            content: article.summary || article.content
          }));
          setFeaturedNews(articles.slice(0, 3));
          setLatestNews(articles.slice(3, 12));
          console.log('✅ News data loaded:', articles.length, 'articles');
          } else {
          console.log('❌ No news data available from database');
          setFeaturedNews([]);
          setLatestNews([]);
        }

        // Fetch artists data
        const artistsResponse = await fetch('/api/artists?limit=8');
        const artistsData = await artistsResponse.json();

        if (artistsData.artists && artistsData.artists.length > 0) {
          const artists = artistsData.artists.map((artist: any) => ({
            ...artist,
            _id: artist.id,
            genre: artist.genres ? artist.genres[0] : 'Reggae',
            socialLinks: artist.socialMedia || {}
          }));
          setTrendingArtists(artists);
          console.log('✅ Artists data loaded:', artists.length, 'artists');
        } else {
          console.log('❌ No artists data available from database');
          setTrendingArtists([]);
        }

        // Fetch events data
        try {
          const eventsResponse = await fetch('/api/events?limit=6');
          const eventsData = await eventsResponse.json();

          if (eventsData.events && eventsData.events.length > 0) {
            setUpcomingEvents(eventsData.events);
            console.log('✅ Events data loaded:', eventsData.events.length, 'events');
          } else {
            console.log('❌ No events data available from database');
            setUpcomingEvents([]);
          }
        } catch (error) {
          console.log('❌ Events API not available');
          setUpcomingEvents([]);
        }

        // Fetch artist spotlight data
        try {
          const [featuredResponse, recentResponse] = await Promise.all([
            fetch('/api/artist-spotlights?action=featured'),
            fetch('/api/artist-spotlights?action=recent&limit=5')
          ]);

          const featuredData = await featuredResponse.json();
          const recentData = await recentResponse.json();

          if (featuredData.success && featuredData.data) {
            setFeaturedSpotlight(featuredData.data);
            console.log('✅ Featured spotlight loaded:', featuredData.data.artistName);
          } else {
            console.log('❌ No featured spotlight available');
            setFeaturedSpotlight(null);
          }

          if (recentData.success && recentData.data) {
            setRecentSpotlights(recentData.data);
            console.log('✅ Recent spotlights loaded:', recentData.data.length, 'spotlights');
        } else {
            console.log('❌ No recent spotlights available');
            setRecentSpotlights([]);
          }
        } catch (error) {
          console.log('❌ Artist spotlights API not available');
          setFeaturedSpotlight(null);
          setRecentSpotlights([]);
        }

        console.log('✅ Data loaded successfully, setting loading to false');
      } catch (error) {
        console.error('❌ Error loading data:', error);
        // Set empty arrays on error - no fallback data
        setFeaturedNews([]);
        setLatestNews([]);
        setTrendingArtists([]);
        setUpcomingEvents([]);
        setFeaturedSpotlight(null);
        setRecentSpotlights([]);
      } finally {
        setLoading(false);
        console.log('🏁 Finally block - setting loading to false');
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
              <div className="w-16 h-16 mx-auto mb-4 bg-logo-primary rounded-lg animate-pulse"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading YaadFeed...</h2>
              <p className="text-gray-600">Fetching the latest news and updates</p>
            </div>
          </div>
        </Preloader>
        </div>
    );
  }
  return (
      <div className="min-h-screen bg-white">
      <ClientHeader />
        
      {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-logo-primary to-logo-dark text-white py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Latest from the <span className="text-logo-secondary">Dancehall</span> Scene
                </h1>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Your source for authentic Jamaican music news, artist features, and cultural stories from the heart of the Caribbean.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/news">
                  <button className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-logo-primary to-logo-dark text-white shadow-sm hover:shadow-md focus:ring-logo-primary/30 px-6 py-3 text-lg group">
                    Explore Stories
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <button className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border hover:border-gray-300 focus:ring-gray-300 bg-white px-6 py-3 text-lg border-white/30 text-white hover:bg-white/10">
                    Artist Spotlight
                </button>
              </div>
                </div>
            <div className="relative">
                <div className="relative h-80 lg:h-96 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-logo-secondary/20 to-transparent"></div>
                  <div className="relative z-10 h-full flex items-center justify-center">
                    <Image
                      src="/images/skillibeng.jpg"
                      alt="Skillibeng - Dancehall Star"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover rounded-2xl"
                    priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">Skillibeng</h3>
                      <p className="text-white/90 text-sm">Dancehall Star</p>
                    </div>
                  </div>
                </div>
            </div>
            </div>
          </div>
        </section>

      {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose YaadFeed?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover the authentic voice of Jamaican culture and music</p>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-50 flex items-center justify-center text-logo-primary">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Breaking News</h3>
              <p className="text-gray-600 leading-relaxed">Real-time updates from Jamaica and the Caribbean diaspora</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-50 flex items-center justify-center text-logo-secondary">
                <Music className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Music Culture</h3>
              <p className="text-gray-600 leading-relaxed">Dive deep into dancehall, reggae, and afrobeats</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-50 flex items-center justify-center text-logo-accent">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Community</h3>
              <p className="text-gray-600 leading-relaxed">Connect with Jamaicans worldwide</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-50 flex items-center justify-center text-logo-primary">
                <Heart className="w-8 h-8" />
                      </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Authentic Stories</h3>
              <p className="text-gray-600 leading-relaxed">Real voices, real experiences, real culture</p>
            </div>
            </div>
          </div>
        </section>

      {/* News Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Latest Music News</h2>
              <p className="text-lg text-gray-600">Stay updated with breaking stories from the music scene</p>
              </div>
              <Link href="/news">
              <button className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-300 bg-white px-4 py-2.5 text-base group">
                  View All News
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              </Link>
            </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestNews.length > 0 ? latestNews.map((article, index) => (
              <div key={article._id || index} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-[16/10] bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 relative">
                  {article.imageUrl ? (
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 flex items-center justify-center">
                      <Newspaper className="w-12 h-12 text-logo-primary/50" />
                              </div>
                            )}
                          </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 line-clamp-3">{article.content}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-500">{article.category}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
              </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-12">
                <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No News Available</h3>
                <p className="text-gray-600">Check back later for the latest music news and updates.</p>
              </div>
            )}
          </div>
          </div>
        </section>

      {/* Trending Artists Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Trending Artists</h2>
              <p className="text-lg text-gray-600">Discover the hottest Jamaican artists making waves</p>
              </div>
              <Link href="/artists">
              <button className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-300 bg-white px-4 py-2.5 text-base group">
                View All Artists
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              </Link>
            </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingArtists.length > 0 ? trendingArtists.map((artist, index) => (
              <div key={artist._id || index} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-square bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 relative">
                  {artist.imageUrl ? (
                              <Image
                      src={artist.imageUrl}
                      alt={artist.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 flex items-center justify-center">
                      <Music className="w-12 h-12 text-logo-primary/50" />
                                  </div>
                                )}
                              </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">{artist.name}</h3>
                  <p className="text-sm text-logo-primary font-medium">{artist.genre}</p>
                  <p className="text-gray-600 line-clamp-3">{artist.bio}</p>
                  <div className="flex space-x-2">
                    {artist.socialLinks.instagram && (
                      <a href={artist.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    )}
                    {artist.socialLinks.twitter && (
                      <a href={artist.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </a>
                    )}
                            </div>
                          </div>
              </div>
                )) : (
              <div className="col-span-full text-center py-12">
                <Music className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Artists Available</h3>
                <p className="text-gray-600">Check back later for trending artists and music updates.</p>
              </div>
            )}
              </div>
        </div>
      </section>

      {/* Artist Spotlight - New Releases Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Artist Spotlight</h2>
              <p className="text-lg text-gray-600">Latest releases and trending tracks from your favorite artists</p>
            </div>
            <Link href="/artists">
              <button className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-300 bg-white px-4 py-2.5 text-base group">
                View All Artists
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
          
          {/* Masonry-style grid with emphasis on one */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Featured Artist - Large Card */}
            {featuredSpotlight ? (
              <div className="lg:col-span-2 lg:row-span-2">
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                  <div className="aspect-[4/3] bg-gradient-to-br from-logo-primary/20 via-logo-secondary/20 to-logo-primary/20 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white z-10">
                        <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Music className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{featuredSpotlight.artistName}</h3>
                        <p className="text-white/90 mb-4">"{featuredSpotlight.songTitle}" - Latest Release</p>
                        <div className="flex items-center justify-center space-x-4">
                          {featuredSpotlight.spotifyUrl && (
                            <a href={featuredSpotlight.spotifyUrl} target="_blank" rel="noopener noreferrer" className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                              <Play className="w-4 h-4 inline mr-2" />
                              Play Now
                            </a>
                          )}
                          <button className="bg-logo-primary text-white px-4 py-2 rounded-lg hover:bg-logo-primary/90 transition-colors">
                            <Heart className="w-4 h-4 inline mr-2" />
                            Follow
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-logo-primary bg-logo-primary/10 px-3 py-1 rounded-full">{featuredSpotlight.status}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(featuredSpotlight.releaseDate).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{featuredSpotlight.artistName} Drops New Track</h4>
                    <p className="text-gray-600 mb-4">{featuredSpotlight.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {featuredSpotlight.views && (
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {featuredSpotlight.views.toLocaleString()} views
                        </span>
                      )}
                      {featuredSpotlight.likes && (
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {featuredSpotlight.likes.toLocaleString()} likes
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-2 lg:row-span-2">
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden h-full flex items-center justify-center">
                  <div className="text-center py-12">
                    <Music className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Featured Spotlight</h3>
                    <p className="text-gray-600">Check back later for the latest artist releases.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Regular Artist Cards */}
            {recentSpotlights.length > 0 ? recentSpotlights.map((spotlight, index) => (
              <div key={spotlight._id || index} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-logo-secondary/20 to-logo-primary/20 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                    <h4 className="text-lg font-bold mb-1">{spotlight.artistName}</h4>
                    <p className="text-white/90 text-sm">"{spotlight.songTitle}"</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-logo-primary bg-logo-primary/10 px-2 py-1 rounded-full">{spotlight.status}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(spotlight.releaseDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{spotlight.description}</p>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-12">
                <Music className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Recent Releases</h3>
                <p className="text-gray-600">Check back later for the latest artist releases and new music.</p>
              </div>
            )}
          </div>
          </div>
        </section>

      {/* Upcoming Events Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Upcoming Events</h2>
              <p className="text-lg text-gray-600">Don't miss these amazing Jamaican music and cultural events</p>
            </div>
            <Link href="/events">
              <button className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-300 bg-white px-4 py-2.5 text-base group">
                View All Events
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.length > 0 ? upcomingEvents.map((event, index) => (
              <div key={event._id || index} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-[16/10] bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 relative">
                  {event.imageUrl ? (
                      <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-logo-primary/50" />
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-logo-primary">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{event.title}</h3>
                  <p className="text-gray-600 line-clamp-2">{event.description}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
              )) : (
                <div className="col-span-full text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Available</h3>
                  <p className="text-gray-600">Check back later for upcoming events and concerts.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
  );
}