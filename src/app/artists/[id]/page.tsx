import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Users, ExternalLink, Music, DollarSign, MapPin, Calendar, Eye, Clock, Star, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

// Generate static params for static export
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ];
}

async function getArtist(id: string) {
  // Derive base URL from headers at runtime (supports dev/prod and custom ports)
  const headersList = (await import('next/headers')).headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/artists/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export default async function ArtistPage({ params }: { params: { id: string } }) {
  const data = await getArtist(params.id);

  if (!data || !data.artist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-logo-light via-white to-logo-muted flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold mb-4 text-logo-primary">Artist Not Found</h1>
          <p className="text-lg mb-8 text-gray-600">The artist you're looking for doesn't exist.</p>
          <Link href="/artists">
            <Button variant="glamour" className="inline-flex items-center">
              <ArrowLeft className="mr-2 w-5 h-5" />
              Back to Artists
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { artist, relatedArticles } = data;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4000';
  const canonicalUrl = `${siteUrl}/artists/${artist.id || params.id}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: artist.name,
    genre: artist.genres,
    url: canonicalUrl,
    image: artist.imageUrl || `${siteUrl}/images/jamaica-flag-bg.jpg`,
    sameAs: [artist.socialMedia?.instagram, artist.socialMedia?.website].filter(Boolean),
  };

  function numberFormat(num: number) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num?.toString() || "0";
  }
  
  function currencyFormat(num: number) {
    if (!num) return "-";
    return "$" + numberFormat(num);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function formatRelativeTime(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 48) return 'Yesterday';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} day${Math.floor(diffInHours / 24) > 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-logo-light via-white to-logo-muted">
      <Header />
      <link rel="canonical" href={canonicalUrl} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Navigation */}
      <div className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md shadow-soft border-b border-logo-primary/20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-4">
          <Link href="/artists" className="inline-flex items-center text-logo-primary hover:text-logo-primary/80 transition-colors">
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back to Artists
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center py-16 md:py-24 bg-gradient-to-br from-logo-dark via-logo-primary to-logo-secondary text-white">
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 max-w-screen-2xl mx-auto px-4 sm:px-8">
          {/* Artist Image */}
          <div className="flex-shrink-0 flex items-center justify-center w-56 h-56 md:w-80 md:h-80 rounded-full overflow-hidden border-8 border-logo-secondary/30 shadow-soft-xl bg-gradient-to-br from-logo-primary/10 to-logo-secondary/10">
            <Image
              src={artist.imageUrl || "/images/jamaica-flag-bg.jpg"}
              alt={artist.name}
              width={320}
              height={320}
              className="object-cover w-full h-full rounded-full shadow-soft"
              priority
            />
          </div>
          
          {/* Artist Info */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black mb-2 text-white drop-shadow-lg">{artist.name}</h1>
            <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
              {artist.genres?.map((genre: string) => (
                <span key={genre} className="bg-logo-secondary/20 text-logo-secondary px-4 py-1 rounded-xl text-sm font-semibold backdrop-blur-md shadow-soft">
                  {genre.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-6 mb-6 justify-center md:justify-start">
              <div className="flex items-center gap-2 text-logo-secondary/90">
                <Users className="w-5 h-5" />
                <span className="font-semibold">{numberFormat(artist.followers)} Followers</span>
              </div>
              <div className="flex items-center gap-2 text-logo-secondary/90">
                <DollarSign className="w-5 h-5" />
                <span className="font-semibold">{currencyFormat(artist.netWorth)}</span>
              </div>
              {artist.birthPlace && (
                <div className="flex items-center gap-2 text-logo-secondary/90">
                  <MapPin className="w-5 h-5" />
                  <span>{artist.birthPlace}</span>
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-2">
              {artist.spotifyId && (
                <a
                  href={`https://open.spotify.com/artist/${artist.spotifyId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-logo-secondary hover:text-logo-secondary/80 transition-colors"
                  title="Spotify"
                >
                  <Music className="w-6 h-6" />
                </a>
              )}
              {artist.socialMedia?.instagram && (
                <a
                  href={artist.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-logo-secondary hover:text-logo-secondary/80 transition-colors"
                  title="Instagram"
                >
                  <ExternalLink className="w-6 h-6" />
                </a>
              )}
              {artist.socialMedia?.website && (
                <a
                  href={artist.socialMedia.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-logo-secondary hover:text-logo-secondary/80 transition-colors"
                  title="Website"
                >
                  <ExternalLink className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Biography */}
        <div className="md:col-span-2 soft-card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Biography</h2>
          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
            <p>{artist.bio}</p>
          </div>
        </div>
        
        {/* Stats and Info */}
        <div className="space-y-6">
          <div className="soft-card p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Artist Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Genre</span>
                <span className="font-semibold text-logo-primary">{artist.genres?.join(', ')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Followers</span>
                <span className="font-semibold text-logo-primary">{numberFormat(artist.followers)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Net Worth</span>
                <span className="font-semibold text-logo-primary">{currencyFormat(artist.netWorth)}</span>
              </div>
              {artist.birthPlace && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Origin</span>
                  <span className="font-semibold text-logo-primary">{artist.birthPlace}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Social Media */}
          <div className="soft-card p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Connect</h3>
            <div className="space-y-3">
              {artist.spotifyId && (
                <a
                  href={`https://open.spotify.com/artist/${artist.spotifyId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-logo-primary/10 rounded-xl hover:bg-logo-primary/20 transition-colors shadow-soft"
                >
                  <div className="flex items-center space-x-3">
                    <Music className="w-5 h-5 text-logo-primary" />
                    <span className="font-medium">Spotify</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-logo-primary" />
                </a>
              )}
              {artist.socialMedia?.instagram && (
                <a
                  href={artist.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-logo-primary/10 rounded-xl hover:bg-logo-primary/20 transition-colors shadow-soft"
                >
                  <div className="flex items-center space-x-3">
                    <ExternalLink className="w-5 h-5 text-pink-400" />
                    <span className="font-medium">Instagram</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-logo-primary" />
                </a>
              )}
              {artist.socialMedia?.website && (
                <a
                  href={artist.socialMedia.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-logo-primary/10 rounded-xl hover:bg-logo-primary/20 transition-colors shadow-soft"
                >
                  <div className="flex items-center space-x-3">
                    <ExternalLink className="w-5 h-5 text-logo-primary" />
                    <span className="font-medium">Website</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-logo-primary" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles Section */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">
                Latest <span className="bg-gradient-to-r from-logo-primary to-logo-secondary bg-clip-text text-transparent">News</span> About {artist.name}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Stay updated with the latest news, interviews, and updates about {artist.name}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((article: any) => (
                <Link key={article._id || article.id} href={`/news/${article.slug || article._id}`}>
                  <Card className="group cursor-pointer soft-card h-full hover:scale-[1.02] transition-all duration-300">
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
                        <span className="bg-gradient-to-r from-logo-primary to-logo-primary/90 text-white px-3 py-1 rounded-xl text-xs font-semibold shadow-soft">
                          {article.category?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </span>
                      </div>
                      
                      {/* Time badge */}
                      <div className="absolute top-3 right-3 glass text-gray-700 px-2 py-1 rounded-xl text-xs font-semibold">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatRelativeTime(article.publishedAt)}
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
                          <Eye className="w-3 h-3 mr-1" />
                          {article.viewCount || 0} views
                        </span>
                        <span className="text-gray-500 text-sm flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(article.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/news">
                <Button variant="glamour" size="lg">
                  View All News
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* No Articles Message */}
      {(!relatedArticles || relatedArticles.length === 0) && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="soft-card p-12">
              <div className="w-24 h-24 bg-gradient-to-r from-logo-primary to-logo-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Recent News</h3>
              <p className="text-gray-600 mb-6">
                We don't have any recent news articles about {artist.name} yet. 
                Check back soon for updates!
              </p>
              <Link href="/news">
                <Button variant="glamour">
                  Browse All News
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
