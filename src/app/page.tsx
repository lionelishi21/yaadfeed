import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, ArrowRight, Calendar, ExternalLink, Music, Newspaper, Eye, Heart, ChevronRight, TrendingUp } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';

// Use direct DB imports for optimal server-side rendering
import { NewsService, ArtistService } from '@/lib/mongodb';
import { artistSpotlightScraper } from '@/lib/scrapers/artistSpotlightScraper';

// Static rendering for export
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch all data in parallel on the server
  const [news, artists, featuredSpotlight, recentSpotlights] = await Promise.all([
    NewsService.getAllNews({ limit: 12 }).catch(() => []),
    ArtistService.getAllArtists(8).catch(() => []),
    artistSpotlightScraper.getFeaturedSpotlight().catch(() => null),
    artistSpotlightScraper.getRecentSpotlights(5).catch(() => [])
  ]);

  const featuredNews = news.slice(0, 3);
  const latestNews = news.slice(3, 12);
  const trendingArtists = artists;
  // Events is empty for now as it's not implemented in the DB layer
  const upcomingEvents: any[] = [];

  const mainStory = featuredNews.length > 0 ? featuredNews[0] : null;
  const sideStories = featuredNews.length > 1 ? featuredNews.slice(1, 4) : [];

  let heroExcerpt = "The latest news and exclusive updates from the heart of Jamaica. Stay connected to the heartbeat of the Caribbean with YardVybz.";
  const anyStory = mainStory as any;
  if (anyStory?.summary) {
    heroExcerpt = anyStory.summary;
  } else if (anyStory?.content) {
    heroExcerpt = anyStory.content.replace(/<[^>]*>?/gm, '').substring(0, 130) + '...';
  }

  const staticSpotlights = [
    { _id: 'vybz-kartel-fixed', artistName: 'Vybz Kartel', songTitle: 'World Boss', status: 'Dancehall King', imageUrl: '/images/vybz-kartel-artist.png' },
    { _id: 'burna-boy-fixed', artistName: 'Burna Boy', songTitle: 'City Boys', status: 'Afrobeats', imageUrl: '/images/burna-boy.png' },
    { _id: 'shenseea-fixed', artistName: 'Shenseea', songTitle: 'Hit & Run', status: 'Dancehall', imageUrl: '/images/shenseea.png' },
    { _id: 'wizkid-fixed', artistName: 'Wizkid', songTitle: 'Essence', status: 'Afrobeats', imageUrl: '/images/wizkid.png' },
  ];

  const vybz = recentSpotlights.find((s: any) => s.artistName.toLowerCase().includes('kartel')) || staticSpotlights[0];
  const othersDb = recentSpotlights.filter((s: any) => !s.artistName.toLowerCase().includes('kartel'));
  
  const displaySpotlights = [vybz];
  let i = 0;
  while(displaySpotlights.length < 4 && i < othersDb.length) {
    displaySpotlights.push(othersDb[i]);
    i++;
  }
  let j = 1;
  while(displaySpotlights.length < 4 && j < staticSpotlights.length) {
    if (!displaySpotlights.some(s => s.artistName === staticSpotlights[j].artistName)) {
      displaySpotlights.push(staticSpotlights[j]);
    }
    j++;
  }

  return (
    <div className="min-h-screen bg-yard-dark text-white font-sans overflow-x-hidden selection:bg-yard-gold selection:text-yard-dark">
      <ClientHeader />
      <main>
        
      {/* Dynamic Hero Section */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden pt-16 px-6 sm:px-14">
        {/* Animated Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={mainStory?.imageUrl || "/images/vybz-kartel-artist.png"}
            alt={mainStory?.title || "Vybz Kartel Spotlight"}
            fill
            className="object-cover opacity-40 animate-ken-burns scale-105"
            priority
          />
          {/* Advanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-yard-dark via-yard-dark/80 to-transparent z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-yard-dark/90 via-transparent to-transparent z-0"></div>
        </div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-yard-gold/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none z-10 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-yard-accent/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none z-10"></div>
        
        <div className="relative z-20 max-w-2xl w-full">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="glass-gold inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full">
              <span className="w-2 h-2 bg-yard-gold rounded-full animate-pulse-glow"></span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-yard-gold drop-shadow-md">Exclusive Feature</span>
            </div>
          </div>

          <h1 className="font-bebas text-[clamp(64px,8vw,110px)] leading-[0.85] text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {mainStory ? (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-lg">
                  {mainStory.title.split(':')[0]}
                </span>
                <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yard-gold to-yellow-600 text-[clamp(45px,5vw,75px)] leading-[1] mt-3 block drop-shadow-lg text-shadow-gold">
                  {mainStory.title.split(':').slice(1).join(':')}
                </span>
              </>
            ) : (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-lg">Vybz Kartel</span><br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yard-gold to-yellow-600 text-[clamp(45px,5vw,75px)] leading-[1] mt-3 block drop-shadow-lg text-shadow-gold">
                  Inside The World Boss's Mega Mansion
                </span>
              </>
            )}
          </h1>
          
          <div className="glass p-6 rounded-2xl mb-10 max-w-lg border-l-4 border-l-yard-gold animate-fade-in-up shadow-2xl" style={{ animationDelay: '0.5s' }}>
            <p className="text-base text-gray-200 leading-relaxed font-medium">
              {heroExcerpt}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            <Link href={mainStory ? `/news/${mainStory.slug || mainStory._id}` : "/news"}>
              <button className="group relative overflow-hidden bg-gradient-to-r from-yard-gold to-yellow-600 text-yard-dark font-sans text-sm font-bold tracking-[1.5px] uppercase border-none py-4 px-9 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all duration-300 transform hover:-translate-y-1">
                <span className="relative z-10 flex items-center gap-2">
                  Read Full Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out"></div>
              </button>
            </Link>
            <Link href="/news">
              <button className="glass hover:bg-white/10 text-white font-sans text-sm font-semibold tracking-[1px] uppercase py-4 px-9 rounded-full transition-all duration-300 transform hover:-translate-y-1">
                More News
              </button>
            </Link>
          </div>
        </div>

        {/* Floating Side Card */}
        <div className="absolute right-14 top-1/2 -translate-y-1/2 w-[380px] z-20 hidden xl:block animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <div className="glass-card overflow-hidden group">
            <div className="h-[380px] relative flex items-end p-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-80"></div>
              {sideStories.length > 0 ? (
                <Image src={sideStories[0].imageUrl || "/images/vybz-kartel-artist.png"} priority alt={sideStories[0].title} fill className="object-cover transform transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <Image src="/images/vybz-kartel-artist.png" priority alt="Vybz Kartel Spotlight" fill className="object-cover transform transition-transform duration-700 group-hover:scale-110" />
              )}
              
              <div className="absolute top-5 right-5 glass-gold text-yard-gold text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full z-20 flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" /> Trending
              </div>
              
              <div className="relative z-20 transform transition-transform duration-300 group-hover:-translate-y-2">
                <div className="font-bebas text-[36px] tracking-[1px] text-white leading-[0.95] line-clamp-2 drop-shadow-md">
                  {sideStories.length > 0 ? sideStories[0].title : "Latest Dancehall News"}
                </div>
                <div className="text-sm text-gray-300 mt-3 line-clamp-2 font-medium">
                  {sideStories.length > 0 ? sideStories[0].summary : "Stay tuned for more updates from the culture."}
                </div>
              </div>
            </div>
            
            <div className="p-5 flex justify-between items-center glass-dark">
              <Link href={sideStories.length > 0 ? `/news/${sideStories[0].slug || sideStories[0]._id}` : "/news"} className="flex items-center gap-2 text-[12px] text-yard-gold uppercase tracking-[1px] font-bold hover:text-white transition-colors group/link">
                Read Article <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Trending Row */}
      <section className="py-20 px-6 sm:px-14 relative z-20 -mt-10">
        <div className="flex items-center gap-4 mb-10">
          <h2 className="font-bebas text-[48px] tracking-[2px] text-white leading-none text-shadow-gold">Trending Artists</h2>
          <div className="h-[3px] w-16 bg-gradient-to-r from-yard-gold to-transparent shrink-0"></div>
          <Link href="/artists" className="text-xs text-gray-400 uppercase tracking-[2px] ml-auto hover:text-yard-gold transition-colors font-semibold flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-8 pt-4 scrollbar-hide snap-x px-4 -mx-4">
          {trendingArtists.length > 0 ? trendingArtists.map((artist: any, index: number) => (
            <div key={artist._id || index} className="shrink-0 w-[220px] cursor-pointer group snap-start">
              <div className="glass-card p-3 h-[280px] relative flex flex-col justify-end overflow-hidden">
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  {artist.imageUrl ? (
                    <Image src={artist.imageUrl} alt={artist.name} fill className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                  ) : (
                    <div className="absolute inset-0 bg-yard-dark flex items-center justify-center">
                      <Music className="w-8 h-8 text-yard-gold/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </div>
                
                <div className="absolute top-4 right-4 glass px-2 py-1 rounded-md text-[10px] font-bold tracking-[1px] uppercase text-yard-gold">
                  {artist.genres?.[0] || 'Reggae'}
                </div>
                
                <div className="absolute top-4 left-4 font-bebas text-[48px] text-white/20 leading-none group-hover:text-yard-gold/30 transition-colors">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                
                <div className="relative z-20 p-2 transform transition-transform duration-300 group-hover:-translate-y-2">
                  <div className="font-bebas text-[28px] text-white leading-none mb-1 drop-shadow-md">{artist.name}</div>
                  <div className="text-xs text-gray-300 line-clamp-2 font-medium">{artist.bio || 'Trending Artist'}</div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-gray-400 text-sm glass p-6 rounded-xl">No trending artists found.</div>
          )}
        </div>
      </section>

      {/* Asymmetrical Bento-Box Featured Stories */}
      <section className="py-24 px-6 sm:px-14 relative">
        <div className="absolute inset-0 bg-yard-dark"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yard-accent/5 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="font-bebas text-[48px] tracking-[2px] text-white leading-none text-shadow-gold">Top Stories</h2>
            <div className="h-[3px] w-16 bg-gradient-to-r from-yard-gold to-transparent shrink-0"></div>
          </div>
          
          {mainStory && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Bento Feature */}
              <Link href={`/news/${mainStory.slug || mainStory._id}`} className="lg:col-span-8 glass-card overflow-hidden relative min-h-[500px] flex flex-col justify-end p-10 group">
                {mainStory.imageUrl && (
                  <Image src={mainStory.imageUrl} alt={mainStory.title} fill className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                
                <div className="absolute top-8 left-8 glass-gold text-yard-gold text-xs font-bold tracking-[0.2em] px-4 py-2 rounded-full uppercase z-20 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Feature Article
                </div>
                
                <div className="relative z-20 max-w-2xl transform transition-transform duration-500 group-hover:-translate-y-4">
                  <h3 className="font-bebas text-[54px] leading-[0.9] text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yard-gold group-hover:to-white transition-all drop-shadow-xl">{mainStory.title}</h3>
                  <p className="text-base text-gray-200 leading-relaxed mb-6 line-clamp-2 font-medium">{mainStory.summary || mainStory.content}</p>
                  <div className="flex items-center gap-6 text-sm font-semibold">
                    <span className="text-yard-gold uppercase tracking-[2px] flex items-center gap-2">
                      Read Full Story <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </span>
                    <span className="text-gray-400 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(mainStory.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
              
              {/* Side Bento Column */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {sideStories.map((story, idx) => (
                  <Link key={story._id?.toString() || story.slug} href={`/news/${story.slug || story._id}`} className="glass-card p-6 flex flex-col flex-1 group justify-between min-h-[240px] relative overflow-hidden">
                    {story.imageUrl && (
                      <div className="absolute inset-0 z-0">
                         <Image src={story.imageUrl} alt={story.title} fill className="object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black to-black/40"></div>
                      </div>
                    )}
                    <div className="relative z-10">
                      <div className="glass inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-yard-gold px-3 py-1.5 rounded-full mb-4 shadow-lg">{story.category}</div>
                      <h4 className="font-bebas text-[32px] text-white leading-none mb-3 group-hover:text-yard-gold transition-colors drop-shadow-md">{story.title}</h4>
                    </div>
                    <div className="relative z-10 flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                      <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(story.publishedAt).toLocaleDateString()}</span>
                      <span className="text-[11px] text-yard-gold uppercase tracking-[1px] font-bold flex items-center gap-1">Read <ChevronRight className="w-3 h-3" /></span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Vibrant Artist Spotlight Grid */}
      <section className="py-24 px-6 sm:px-14 relative bg-[#080808]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-yard-gold/5 blur-[200px] pointer-events-none z-0"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="font-bebas text-[48px] tracking-[2px] text-white leading-none text-shadow-gold">Spotlight Radar</h2>
            <div className="h-[3px] w-16 bg-gradient-to-r from-yard-gold to-transparent shrink-0"></div>
            <Link href="/artists" className="text-xs text-gray-400 uppercase tracking-[2px] ml-auto hover:text-yard-gold transition-colors font-semibold flex items-center gap-1">Discover <ArrowRight className="w-3 h-3" /></Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displaySpotlights.map((spotlight: any, i: number) => (
              <div key={spotlight._id || i} className="glass-card overflow-hidden cursor-pointer group rounded-2xl">
                <div className="h-[320px] relative flex items-center justify-center overflow-hidden">
                  {spotlight.imageUrl ? (
                    <Image src={spotlight.imageUrl} alt={spotlight.artistName} fill className="object-cover opacity-70 group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-yard-dark flex items-center justify-center">
                      <Music className="w-12 h-12 text-yard-gold/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/50 to-transparent"></div>
                  
                  {/* Floating badge */}
                  <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full z-20 flex items-center gap-1.5 transform group-hover:-translate-y-1 transition-transform">
                    <Heart className="w-3 h-3 text-red-500" fill="currentColor" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-[1px]">Hot</span>
                  </div>
                </div>
                
                <div className="p-6 relative z-20 -mt-10 bg-transparent text-center">
                  <div className="font-bebas text-[32px] tracking-[1px] text-white mb-1 group-hover:text-yard-gold transition-colors drop-shadow-md">{spotlight.artistName}</div>
                  <div className="text-sm text-gray-300 mb-4 font-serif italic text-yard-gold/80">"{spotlight.songTitle}"</div>
                  
                  <div className="glass inline-block rounded-full px-5 py-2 hover:bg-yard-gold hover:text-yard-dark transition-all duration-300">
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">{spotlight.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Flow */}
      <section className="py-24 px-6 sm:px-14 bg-yard-dark relative">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="font-bebas text-[48px] tracking-[2px] text-white leading-none text-shadow-gold">The Feed</h2>
          <div className="h-[3px] w-16 bg-gradient-to-r from-yard-gold to-transparent shrink-0"></div>
          <Link href="/news" className="text-xs text-gray-400 uppercase tracking-[2px] ml-auto hover:text-yard-gold transition-colors font-semibold flex items-center gap-1">Load More <ArrowRight className="w-3 h-3" /></Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestNews.slice(0,6).map((art) => (
            <Link key={art._id?.toString() || art.slug} href={`/news/${art.slug || art._id}`} className="group relative block">
              <div className="glass-card h-full flex flex-col overflow-hidden">
                <div className="h-[240px] relative overflow-hidden rounded-t-2xl">
                  {art.imageUrl && <Image src={art.imageUrl} alt={art.title} fill className="object-cover opacity-80 group-hover:scale-110 transition-all duration-700" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                  <div className="absolute top-4 left-4 glass-gold text-yard-gold text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full z-20 shadow-lg">{art.category}</div>
                </div>
                <div className="p-8 flex-1 flex flex-col bg-[#0f0f0f]/50">
                  <h3 className="font-bebas text-[28px] text-white leading-[1.1] mb-3 line-clamp-2 group-hover:text-yard-gold transition-colors drop-shadow-sm">{art.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-3 flex-1">{art.summary || art.content}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-auto">
                    <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(art.publishedAt).toLocaleDateString()}</span>
                    <div className="w-8 h-8 rounded-full glass flex items-center justify-center group-hover:bg-yard-gold group-hover:text-yard-dark transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
}