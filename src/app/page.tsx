import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, ArrowRight, Calendar, ExternalLink, Music, Newspaper, Eye, Heart, ChevronRight } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-yard-dark text-white font-sans overflow-x-hidden">
      <ClientHeader />
        
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16 px-6 sm:px-14">
        <div className="absolute inset-0 bg-yard-dark"></div>
        <div className="absolute -top-[120px] -right-[120px] w-[740px] h-[740px] bg-[radial-gradient(circle,rgba(232,184,75,0.1)_0%,transparent_62%)] pointer-events-none"></div>
        <div className="absolute -bottom-[60px] left-1/4 w-[480px] h-[380px] bg-[radial-gradient(circle,rgba(5,50,15,0.22)_0%,transparent_68%)] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-xl w-full">
          <div className="inline-flex items-center gap-2 border border-yard-gold/30 bg-yard-gold/10 px-3.5 py-1.5 mb-7">
            <span className="w-1.5 h-1.5 bg-yard-gold rounded-full animate-dot"></span>
            <span className="text-[11px] font-bold tracking-[2px] uppercase text-yard-gold">Live from the Yard</span>
          </div>
          <h1 className="font-bebas text-[clamp(60px,6.4vw,96px)] leading-[0.92] text-white mb-5 animate-fadeUp">
            Latest from the<br/><span className="text-yard-gold">Dancehall</span><br/>Scene
          </h1>
          <p className="text-base text-[#888] leading-[1.65] max-w-[420px] mb-9 animate-fadeUp" style={{ animationDelay: '100ms' }}>
            Your source for authentic Jamaican music news, artist features, and cultural stories from the heart of the Caribbean.
          </p>
          <div className="flex gap-3.5 animate-fadeUp" style={{ animationDelay: '200ms' }}>
            <Link href="/news">
              <button className="bg-yard-gold text-yard-dark font-sans text-[13px] font-bold tracking-[1px] uppercase border-none py-3.5 px-7 hover:bg-white transition-colors">
                Explore Stories →
              </button>
            </Link>
            <Link href="/music">
              <button className="bg-transparent text-white font-sans text-[13px] font-semibold tracking-[0.8px] uppercase border border-white/20 py-3.5 px-7 hover:bg-white/10 transition-colors">
                New Music
              </button>
            </Link>
          </div>
        </div>

        {/* Hero Spotlight Image */}
        <div className="absolute right-14 top-1/2 -translate-y-1/2 w-[400px] z-10 hidden lg:block animate-fadeUp" style={{ animationDelay: '300ms' }}>
          <div className="border border-white/5 overflow-hidden bg-[#0f0f0f]">
            <div className="h-[420px] bg-[linear-gradient(155deg,#0E2210_0%,#0A0A0A_55%,#181000_100%)] relative flex items-end p-6">
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_35%,rgba(5,5,5,0.9)_100%)] z-10"></div>
              {featuredSpotlight?.imageUrl ? (
                 <Image src={featuredSpotlight.imageUrl} priority alt="Featured Spotlight" fill className="object-cover opacity-60" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <svg width="130" height="210" viewBox="0 0 130 210" fill="none"><ellipse cx="65" cy="52" rx="30" ry="36" fill="#E8B84B"></ellipse><path d="M10 148 Q30 100 65 92 Q100 100 120 148 L130 210 L0 210Z" fill="#E8B84B"></path></svg>
                </div>
              )}
              <div className="absolute top-4 right-4 bg-yard-gold text-yard-dark text-[10px] font-bold tracking-[1.5px] uppercase px-2.5 py-1 z-20">Artist Spotlight</div>
              <div className="relative z-20">
                <div className="font-bebas text-[34px] tracking-[1px] text-white leading-none">{featuredSpotlight?.artistName || 'Skillibeng'}</div>
                <div className="text-[13px] text-[#aaa] mt-1">Dancehall Star · Kingston, JA</div>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center border-t border-white/5">
              <Link href="/artists" className="text-[12px] text-yard-gold uppercase tracking-[0.8px] hover:text-white transition-colors">Read Feature →</Link>
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-yard-gold rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-[#2a2a2a] rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-[#2a2a2a] rounded-full"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-16 px-6 sm:px-14 bg-yard-dark border-t border-[#141414]">
        <div className="flex items-center gap-3.5 mb-8">
          <h2 className="font-bebas text-[38px] tracking-[1px] text-white leading-none">Trending Now</h2>
          <div className="h-[2px] w-11 bg-yard-gold shrink-0"></div>
          <Link href="/artists" className="text-[11px] text-[#555] uppercase tracking-[1px] ml-auto hover:text-white transition-colors">View All →</Link>
        </div>
        <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-hide">
          {trendingArtists.length > 0 ? trendingArtists.map((artist: any, index: number) => (
            <div key={artist._id || index} className="shrink-0 w-[188px] cursor-pointer group">
              <div className="h-[188px] bg-yard-gray relative flex items-center justify-center mb-3 overflow-hidden">
                {artist.imageUrl ? (
                  <Image src={artist.imageUrl} alt={artist.name} fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-10 h-10 bg-yard-gold/10 border border-yard-gold/30 rounded-full flex items-center justify-center z-10">
                    <Music className="w-5 h-5 text-yard-gold" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                <div className="absolute bottom-2 right-2 bg-yard-gold text-yard-dark text-[9px] font-bold tracking-[0.8px] px-1.5 py-0.5 uppercase z-20">{artist.genres?.[0] || 'Reggae'}</div>
                <div className="absolute top-1.5 left-2.5 font-bebas text-[38px] text-white/10 leading-none z-20">{(index + 1).toString().padStart(2, '0')}</div>
              </div>
              <div className="font-semibold text-sm text-white mb-1 truncate">{artist.name}</div>
              <div className="text-[12px] text-[#666] line-clamp-2 leading-snug">{artist.bio || 'Trending Artist'}</div>
            </div>
          )) : (
            <div className="text-gray-500 text-sm">No trending artists found.</div>
          )}
        </div>
      </section>

      {/* Featured Story */}
      <section className="pb-16 px-6 sm:px-14 bg-yard-dark border-t border-[#141414]">
        <div className="flex items-center gap-3.5 mb-8 pt-16">
          <h2 className="font-bebas text-[38px] tracking-[1px] text-white leading-none">Featured Story</h2>
          <div className="h-[2px] w-11 bg-yard-gold shrink-0"></div>
        </div>
        
        {mainStory && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0.5">
            <Link href={`/news/${mainStory.slug || mainStory._id}`} className="bg-yard-gray relative overflow-hidden min-h-[440px] flex flex-col justify-end p-8 group">
              <div className="absolute inset-0 bg-[linear-gradient(140deg,#0C1C0C_0%,#0A0A0A_50%,#180D00_100%)]"></div>
              {mainStory.imageUrl && (
                <Image src={mainStory.imageUrl} alt={mainStory.title} fill className="object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_20%,rgba(5,5,5,0.92)_100%)] z-10"></div>
              
              <div className="absolute top-6 left-6 bg-yard-gold text-yard-dark text-[10px] font-bold tracking-[1.5px] px-2.5 py-1 uppercase z-20">Feature</div>
              
              <div className="relative z-20">
                <h3 className="font-bebas text-[38px] leading-none text-white mb-3 group-hover:text-yard-gold transition-colors">{mainStory.title}</h3>
                <p className="text-[13px] text-[#bbb] leading-[1.55] mb-4 line-clamp-2">{mainStory.summary || mainStory.content}</p>
                <div className="flex items-center gap-3.5">
                  <span className="text-[12px] text-yard-gold uppercase tracking-[1px]">Read Story →</span>
                  <span className="text-[12px] text-[#444]">{new Date(mainStory.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
            
            <div className="flex flex-col gap-0.5">
              {sideStories.map((story) => (
                <Link key={story._id?.toString() || story.slug} href={`/news/${story.slug || story._id}`} className="bg-yard-gray p-6 flex gap-4 flex-1 group hover:bg-[#141414] transition-colors">
                  <div className="w-[76px] h-[76px] bg-[#1a1a1a] shrink-0 relative overflow-hidden">
                    {story.imageUrl && <Image src={story.imageUrl} alt={story.title} fill className="object-cover opacity-70 group-hover:opacity-100 transition-opacity" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="border border-yard-gold/20 bg-yard-gold/5 inline-block text-[9px] font-bold tracking-[1.5px] uppercase text-yard-gold px-2 py-0.5 mb-2">{story.category}</div>
                    <div className="font-semibold text-sm text-white leading-snug mb-1 line-clamp-2 group-hover:text-yard-gold transition-colors">{story.title}</div>
                    <div className="text-[12px] text-[#444]">{new Date(story.publishedAt).toLocaleDateString()}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Artist Spotlight Grid */}
      <section className="py-16 px-6 sm:px-14 bg-[#0D0D0D] border-t border-[#141414]">
        <div className="flex items-center gap-3.5 mb-8">
          <h2 className="font-bebas text-[38px] tracking-[1px] text-white leading-none">Artist Spotlight</h2>
          <div className="h-[2px] w-11 bg-yard-gold shrink-0"></div>
          <Link href="/artists" className="text-[11px] text-[#555] uppercase tracking-[1px] ml-auto hover:text-white transition-colors">All Artists →</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5">
          {recentSpotlights.length > 0 ? recentSpotlights.slice(0,4).map((spotlight: any, i: number) => (
            <div key={spotlight._id || i} className="bg-yard-gray overflow-hidden cursor-pointer group">
              <div className="h-[240px] bg-[#1a1a1a] relative flex items-center justify-center">
                {spotlight.imageUrl ? (
                  <Image src={spotlight.imageUrl} alt={spotlight.artistName} fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <svg width="68" height="112" viewBox="0 0 68 112" fill="none" className="opacity-[0.12]"><ellipse cx="34" cy="27" rx="16" ry="20" fill="#E8B84B"></ellipse><path d="M4 78 Q16 52 34 48 Q52 52 64 78 L68 112 L0 112Z" fill="#E8B84B"></path></svg>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_45%,rgba(8,8,8,0.88)_100%)] z-10"></div>
              </div>
              <div className="p-4 relative z-20 -mt-12 bg-transparent">
                <div className="font-bebas text-[22px] tracking-[0.5px] text-white mb-1 group-hover:text-yard-gold transition-colors">{spotlight.artistName}</div>
                <div className="text-[12px] text-[#666] mb-2 truncate">"{spotlight.songTitle}"</div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-yard-gold uppercase tracking-[0.5px]">{spotlight.status}</span>
                  <span className="text-[11px] text-[#555] uppercase tracking-[0.8px] group-hover:text-white transition-colors">Listen →</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-[#666] text-sm">No recent spotlight artists available.</div>
          )}
        </div>
      </section>

      {/* Latest News Grid */}
      <section className="py-16 px-6 sm:px-14 bg-yard-dark border-t border-[#141414]">
        <div className="flex items-center gap-3.5 mb-8">
          <h2 className="font-bebas text-[38px] tracking-[1px] text-white leading-none">News & Culture</h2>
          <div className="h-[2px] w-11 bg-yard-gold shrink-0"></div>
          <Link href="/news" className="text-[11px] text-[#555] uppercase tracking-[1px] ml-auto hover:text-white transition-colors">View All →</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5">
          {latestNews.slice(0,6).map((art) => (
            <Link key={art._id?.toString() || art.slug} href={`/news/${art.slug || art._id}`} className="bg-yard-gray overflow-hidden group hover:bg-[#141414] transition-colors">
              <div className="h-[196px] bg-[#1a1a1a] relative overflow-hidden">
                {art.imageUrl && <Image src={art.imageUrl} alt={art.title} fill className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(5,5,5,0.65)_100%)] z-10"></div>
                <div className="absolute top-3 left-3 bg-yard-gold text-yard-dark text-[9px] font-bold tracking-[1.5px] uppercase px-2 py-0.5 z-20">{art.category}</div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-[15px] text-white leading-[1.35] mb-2 line-clamp-2 group-hover:text-yard-gold transition-colors">{art.title}</h3>
                <p className="text-[13px] text-[#666] leading-snug mb-3 line-clamp-2">{art.summary || art.content}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#444]">{new Date(art.publishedAt).toLocaleDateString()}</span>
                  <span className="text-[11px] text-yard-gold uppercase tracking-[0.8px]">Read →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 px-6 sm:px-14 bg-[#0D0D0D] border-t border-[#141414]">
        <div className="flex items-center gap-3.5 mb-8">
          <h2 className="font-bebas text-[38px] tracking-[1px] text-white leading-none">Upcoming Events</h2>
          <div className="h-[2px] w-11 bg-yard-gold shrink-0"></div>
          <Link href="/events" className="text-[11px] text-[#555] uppercase tracking-[1px] ml-auto hover:text-white transition-colors">All Events →</Link>
        </div>
        
        <div className="flex flex-col gap-0.5">
          {upcomingEvents.length > 0 ? upcomingEvents.map((evt) => {
            const evtDate = new Date(evt.date);
            return (
              <div key={evt._id} className="bg-yard-gray p-5 sm:p-7 flex items-center gap-4 sm:gap-6 group hover:bg-[#141414] transition-colors cursor-pointer">
                <div className="w-[50px] text-center shrink-0">
                  <div className="font-bebas text-[34px] text-yard-gold leading-none">{evtDate.getDate()}</div>
                  <div className="text-[11px] text-[#555] uppercase tracking-[1px]">{evtDate.toLocaleString('default', { month: 'short' })}</div>
                </div>
                <div className="w-[1px] h-10 bg-[#1e1e1e] shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[15px] text-white mb-1 group-hover:text-yard-gold transition-colors truncate">{evt.title}</div>
                  <div className="text-[13px] text-[#666] truncate">{evt.location}</div>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <div className="text-[11px] text-[#444] uppercase tracking-[0.5px]">Tickets →</div>
                </div>
              </div>
            )
          }) : (
            <div className="text-[#666] text-sm">No upcoming events found.</div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}