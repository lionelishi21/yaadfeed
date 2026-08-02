import React from 'react';
import { NewsService } from '@/lib/mongodb';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || '';
  let results: any[] = [];
  
  if (query) {
    try {
      results = await NewsService.getAllNews({ search: query, limit: 20 });
    } catch (e) {
      console.error('Search error:', e);
    }
  }

  return (
    <div className="min-h-screen bg-yard-dark text-white font-sans overflow-x-hidden flex flex-col">
      <ClientHeader />
      
      <main className="flex-1 pt-24 px-6 sm:px-14 pb-16 max-w-7xl mx-auto w-full">
        <h1 className="font-bebas text-4xl mb-2 text-white">
          Search Results
        </h1>
        <p className="text-gray-400 mb-8">
          {query ? `Showing results for "${query}"` : "Enter a search term to find articles."}
        </p>

        {query && results.length === 0 && (
          <div className="bg-yard-gray p-8 text-center text-gray-400 border border-[#222]">
            No results found for "{query}". Try a different keyword.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((art: any) => (
            <Link key={art.slug || art._id} href={`/news/${art.slug || art._id}`} className="bg-yard-gray overflow-hidden group hover:bg-[#141414] transition-colors border border-[#222]">
              <div className="h-[196px] bg-[#1a1a1a] relative overflow-hidden">
                {art.imageUrl && <Image src={art.imageUrl} alt={art.title} fill className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(5,5,5,0.65)_100%)] z-10"></div>
                <div className="absolute top-3 left-3 bg-yard-gold text-yard-dark text-[9px] font-bold tracking-[1.5px] uppercase px-2 py-0.5 z-20">{art.category}</div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-[15px] text-white leading-[1.35] mb-2 line-clamp-2 group-hover:text-yard-gold transition-colors">{art.title}</h3>
                <p className="text-[13px] text-[#666] leading-snug mb-3 line-clamp-2">{art.summary || (art.content && typeof art.content === 'string' ? art.content.replace(/<[^>]+>/g, '').substring(0, 100) : '')}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#444]">{new Date(art.publishedAt).toLocaleDateString()}</span>
                  <span className="text-[11px] text-yard-gold uppercase tracking-[0.8px]">Read →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
