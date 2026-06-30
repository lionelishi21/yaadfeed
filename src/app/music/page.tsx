'use client';

// Static rendering for export
export const dynamic = "auto";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SafeMotionDiv, SafeMotionSection } from '@/components/ui/MotionWrapper';
import { Play, ArrowRight, Calendar, Share2, ExternalLink, Music, Clock, Sparkles, Heart, Eye, ChevronRight, Filter, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/Card';
import Button from '@/components/ui/Button';
import { NewsItem, Artist } from '@/types';
import { formatters, stringUtils } from '@/utils';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';

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

// Fallback music news if API is unavailable
const getFallbackMusicNews = (): NewsItem[] => [
  {
    id: 'fallback-1',
    title: 'Reggae Revival: Sounds of the Island',
    category: 'reggae',
    summary: 'A look at the new wave of reggae artists carrying the torch.',
    slug: 'reggae-revival-sounds-of-the-island',
    imageUrl: '/images/jamaica-flag-bg.jpg',
    publishedAt: new Date().toISOString(),
    readTime: 3,
    content: 'A look at the new wave of reggae artists carrying the torch.',
    source: 'jamaica-gleaner',
    tags: ['reggae', 'music', 'jamaica'],
  },
  {
    id: 'fallback-2',
    title: 'Dancehall Energy: The Beat Goes On',
    category: 'dancehall',
    summary: 'Modern dancehall trends shaping global club culture.',
    slug: 'dancehall-energy-the-beat-goes-on',
    imageUrl: '/images/music-a7c5368b17b9.jpg',
    publishedAt: new Date().toISOString(),
    readTime: 2,
    content: 'Modern dancehall trends shaping global club culture.',
    source: 'jamaica-observer',
    tags: ['dancehall', 'music', 'culture'],
  },
  {
    id: 'fallback-3',
    title: 'Entertainment Buzz: Island Highlights',
    category: 'entertainment',
    summary: 'Highlights from Jamaica’s vibrant entertainment scene.',
    slug: 'entertainment-buzz-island-highlights',
    imageUrl: '/images/entertainment-78e5a1307748.jpg',
    publishedAt: new Date().toISOString(),
    readTime: 2,
    content: 'Highlights from Jamaica’s vibrant entertainment scene.',
    source: 'jamaica-star',
    tags: ['entertainment', 'island', 'highlights'],
  },
];

// Fallback artists if API is unavailable
const getFallbackArtists = (): Artist[] => [
  {
    id: 'artist-1',
    name: 'Island Star',
    bio: 'A rising star blending reggae and dancehall.',
    genres: ['Reggae', 'Dancehall'],
    imageUrl: '/images/jamaica-flag-bg.jpg',
    popularity: 85,
    followers: 0,
    socialMedia: {},
    discography: [],
    upcomingEvents: [],
    isJamaican: true,
    isVerified: true,
  },
  {
    id: 'artist-2',
    name: 'Kingston Vibes',
    bio: 'Dancehall collective with infectious rhythms.',
    genres: ['Dancehall'],
    imageUrl: '/images/music-f0c59a497d92.jpg',
    popularity: 72,
    followers: 0,
    socialMedia: {},
    discography: [],
    upcomingEvents: [],
    isJamaican: true,
    isVerified: false,
  },
  {
    id: 'artist-3',
    name: 'Roots Harmony',
    bio: 'Roots group bringing classic reggae harmonies.',
    genres: ['Reggae'],
    imageUrl: '/images/entertainment-ee2d621ddb29.jpg',
    popularity: 68,
    followers: 0,
    socialMedia: {},
    discography: [],
    upcomingEvents: [],
    isJamaican: true,
    isVerified: false,
  },
];

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
        // Load music-related news with fallback
        try {
          const newsResponse = await fetch('/api/news');
          if (newsResponse.ok) {
            const responseData = await newsResponse.json();
            const newsData = responseData.news || responseData || [];
            const musicNewsData = (newsData || []).filter((article: NewsItem) => 
              ['music', 'dancehall', 'reggae', 'entertainment'].includes((article.category || '').toLowerCase())
            );
            setMusicNews(musicNewsData.length > 0 ? musicNewsData : getFallbackMusicNews());
          } else {
            setMusicNews(getFallbackMusicNews());
          }
        } catch {
          setMusicNews(getFallbackMusicNews());
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
              setTrendingArtists(trending.length > 0 ? trending : getFallbackArtists());
            } else {
              setTrendingArtists(getFallbackArtists());
            }
          } else {
            setTrendingArtists(getFallbackArtists());
          }
        } catch (error) {
          console.log('Artist data not available:', error);
          setTrendingArtists(getFallbackArtists());
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
      <div className="min-h-screen bg-yard-dark">
        <ClientHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-[#1a1a1a] rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-[#1a1a1a] h-64 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yard-dark text-white overflow-x-hidden">
      <ClientHeader />
      
      {/* Hero Section */}
      <section className="bg-yard-dark py-32 border-b border-white/5 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/popcaan.jpg"
            alt="Music Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-yard-dark via-yard-dark/80 to-transparent"></div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yard-gold/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SafeMotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded-full text-[11px] font-bold tracking-[1px] uppercase mb-6 text-yard-gold">
              <Music className="w-3.5 h-3.5 mr-2" />
              Jamaica's Music Scene
            </div>
            
            <h1 className="text-[clamp(40px,5vw,72px)] font-bebas tracking-[1px] mb-6 leading-none uppercase">
              Latest from the{' '}
              <span className="text-yard-gold">Music</span>{' '}
              World
            </h1>
            
            <p className="text-lg text-[#ccc] mb-8 max-w-2xl mx-auto leading-[1.8]">
              Discover the latest news, artist updates, and cultural stories from Jamaica's vibrant music scene.
            </p>
          </SafeMotionDiv>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 border-b border-white/5 bg-[#0a0a0a] sticky top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2 text-[11px] font-bold tracking-[1px] uppercase transition-colors border ${
                  selectedCategory === category.id
                    ? 'bg-yard-gold text-yard-dark border-yard-gold'
                    : 'bg-transparent text-[#888] border-white/10 hover:border-yard-gold/50 hover:text-white'
                }`}
              >
                {category.name}
                <span className="ml-2 opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Music News Grid */}
      <section className="py-20 relative">
        <div className="absolute top-40 left-0 w-64 h-64 bg-yard-gold/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-bebas tracking-[1px] mb-2 uppercase">
                Music News
              </h2>
              <p className="text-[#888] text-sm">
                Stay updated with the latest from Jamaica's music scene
              </p>
            </div>
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#555] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search music news..."
                  className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-[#333] text-white focus:outline-none focus:border-yard-gold/50 transition-colors text-sm placeholder:text-[#555]"
                />
              </div>
              <Button variant="outline" className="shrink-0 bg-transparent border-white/10 text-[#888] hover:text-white hover:border-yard-gold rounded-none">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((article, index) => (
                <SafeMotionDiv
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/news/${article.slug || article.id}`}>
                    <Card className="h-full bg-[#0f0f0f] border border-white/5 hover:border-white/20 transition-all duration-300 group cursor-pointer rounded-none overflow-hidden flex flex-col">
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <MusicNewsImage 
                          article={article} 
                          width={400} 
                          height={250} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" 
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-yard-gold text-yard-dark px-3 py-1 text-[10px] font-bold tracking-[1px] uppercase shadow-lg">
                            {stringUtils.capitalize(article.category || 'music')}
                          </span>
                        </div>
                      </div>
                      
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <h3 className="text-2xl font-bebas tracking-[1px] mb-3 leading-tight group-hover:text-yard-gold transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        
                        <p className="text-[#888] text-sm line-clamp-3 mb-6 leading-relaxed flex-1">
                          {article.summary}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                          <span className="text-[11px] text-[#666] font-bold tracking-[1px] uppercase flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                            {formatters.relative(article.publishedAt)}
                          </span>
                          <span className="text-[11px] text-yard-gold font-bold tracking-[1px] uppercase flex items-center group-hover:translate-x-1 transition-transform">
                            Read More <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </SafeMotionDiv>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-white/5 bg-[#0f0f0f]">
              <Music className="w-12 h-12 text-[#333] mx-auto mb-4" />
              <h3 className="text-2xl font-bebas tracking-[1px] mb-2 uppercase">No music news found</h3>
              <p className="text-[#888] text-sm">Try adjusting your filters or check back later for new content.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="py-20 bg-[#0f0f0f] border-y border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yard-gold/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-bebas tracking-[1px] mb-2 uppercase">
                Featured Artists
              </h2>
              <p className="text-[#888] text-sm">
                Discover Jamaica's musical talents
              </p>
            </div>
            <Link href="/artists">
              <Button variant="outline" className="bg-transparent border-white/10 text-white hover:border-yard-gold rounded-none uppercase text-[11px] font-bold tracking-[1px] px-6">
                View All Artists
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {trendingArtists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingArtists.map((artist, index) => (
                <SafeMotionDiv
                  key={artist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/artists/${artist.id}`}>
                    <Card className="h-full bg-yard-dark border border-white/5 hover:border-yard-gold/50 transition-all duration-300 group cursor-pointer rounded-none">
                      <CardContent className="p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yard-gold/5 blur-[50px] rounded-full group-hover:bg-yard-gold/10 transition-colors"></div>
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-yard-gold/50 transition-colors relative z-10">
                          <Image
                            src={artist.imageUrl || '/images/placeholder-entertainment.jpg'}
                            alt={artist.name || 'Artist'}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                          />
                        </div>
                        
                        <div className="flex items-center justify-center space-x-2 mb-3 relative z-10">
                          <h3 className="text-2xl font-bebas tracking-[1px] group-hover:text-yard-gold transition-colors truncate">
                            {artist.name || 'Unknown Artist'}
                          </h3>
                          {artist.isVerified && (
                            <div className="w-4 h-4 bg-yard-gold rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-yard-dark text-[10px] font-bold">✓</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-[#888] text-[11px] font-bold tracking-[1px] uppercase mb-4 relative z-10">
                          {(artist.genres || []).slice(0, 2).join(', ') || 'Music'}
                        </p>
                        
                        <div className="flex items-center justify-center pt-4 border-t border-white/5 relative z-10">
                          <div className="flex items-center text-yard-gold text-[10px] font-bold tracking-[1px] uppercase">
                            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                            <span>{artist.popularity || 0}% popularity</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </SafeMotionDiv>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-white/5 bg-yard-dark">
              {/* Using a standard SVG path or we can use the Sparkles icon since User is not imported here. Wait, User was imported from lucide-react in artists/page.tsx, but let's see if it's imported in music/page.tsx */}
              <Music className="w-12 h-12 text-[#333] mx-auto mb-4" />
              <h3 className="text-2xl font-bebas tracking-[1px] mb-2 uppercase">No artists found</h3>
              <p className="text-[#888] text-sm">Check back later for featured artists.</p>
            </div>
          )}
        </div>
      </section>

      {/* Music Categories Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(40px,5vw,56px)] font-bebas tracking-[1px] mb-4 uppercase">
              Explore Music Genres
            </h2>
            <p className="text-lg text-[#ccc] max-w-2xl mx-auto leading-[1.8]">
              Dive deep into Jamaica's diverse music culture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Dancehall',
                description: 'The energetic beats and rhythms of modern Jamaican music',
                icon: Music,
                href: '/news?category=dancehall'
              },
              {
                title: 'Reggae',
                description: 'The soulful sounds that put Jamaica on the world map',
                icon: Play,
                href: '/news?category=reggae'
              },
              {
                title: 'Afrobeats',
                description: 'The fusion of African and Caribbean musical traditions',
                icon: Sparkles,
                href: '/news?category=afrobeats'
              }
            ].map((genre, index) => (
              <SafeMotionDiv
                key={genre.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={genre.href}>
                  <Card className="h-full bg-[#0f0f0f] border border-white/5 hover:border-yard-gold/30 transition-all duration-300 group cursor-pointer rounded-none">
                    <CardContent className="p-8 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-yard-gold/5 blur-[50px] rounded-full"></div>
                      <div className="w-16 h-16 mx-auto mb-6 bg-[#1a1a1a] border border-white/10 flex items-center justify-center group-hover:border-yard-gold/50 transition-colors relative z-10">
                        <genre.icon className="w-6 h-6 text-yard-gold" />
                      </div>
                      
                      <h3 className="text-3xl font-bebas tracking-[1px] mb-3 group-hover:text-yard-gold transition-colors relative z-10">
                        {genre.title}
                      </h3>
                      
                      <p className="text-[#888] leading-[1.6] mb-8 text-sm relative z-10">
                        {genre.description}
                      </p>
                      
                      <div className="inline-flex items-center text-[11px] font-bold tracking-[1px] uppercase text-white group-hover:text-yard-gold transition-colors relative z-10">
                        Explore {genre.title}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </SafeMotionDiv>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MusicPage;
