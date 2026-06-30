'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Ticket, Users } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface DemandRequest {
  id: string;
  artistName: string;
  location: string;
  venue?: string;
  requestedBy?: string;
  votes: number;
  status: 'pending' | 'approved' | 'rejected' | 'confirmed';
  createdAt?: string;
  description?: string;
  expectedDate?: string;
  ticketPrice?: string;
}

const API_ENDPOINT = '/api/demands';

export default function DemandPage() {
  const [demands, setDemands] = useState<DemandRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDemands() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_ENDPOINT);
        if (!res.ok) throw new Error('Failed to fetch demands');
        const data = await res.json();
        setDemands(data.data || []);
      } catch (err: any) {
        setError(err.message || 'Error loading demands');
        setDemands([]);
      } finally {
        setLoading(false);
      }
    }
    loadDemands();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default:
        return 'bg-yard-gold/20 text-yard-gold border-yard-gold/30';
    }
  };

  const handleCreateDemand = () => {
    alert("Creating demands will be available soon!");
  };

  return (
    <div className="min-h-screen bg-yard-dark text-white font-sans overflow-x-hidden">
      <ClientHeader />
      
      {/* Hero Section */}
      <section className="relative border-b border-[#141414] py-16 overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-yard-gold/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-14">
          <div className="text-center">
            {/* Minimalist badge */}
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center gap-2 border border-yard-gold/30 bg-yard-gold/10 px-3.5 py-1.5 rounded-none">
                <span className="w-1.5 h-1.5 bg-yard-gold rounded-full animate-dot"></span>
                <span className="text-[11px] font-bold tracking-[2px] uppercase text-yard-gold">Live Events</span>
              </div>
            </div>

            <h1 className="font-bebas text-[clamp(48px,5vw,72px)] leading-none text-white mb-6">
              Artist <span className="text-yard-gold">Demand Board</span>
            </h1>
            <p className="text-[#888] text-base max-w-2xl mx-auto leading-[1.65]">
              Vote for your favorite artists to perform in your city. Make your voice heard and bring the music you love to your community.
            </p>
          </div>
        </div>
      </section>

      {/* Demands Grid */}
      <section className="py-16 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-6 sm:px-14">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-[#141414] border border-white/5 animate-pulse p-8">
                  <div className="h-6 bg-white/10 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-white/10 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-white/10 rounded mb-6 w-5/6"></div>
                  <div className="h-8 bg-white/10 rounded w-1/3 mt-auto"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 border border-white/5 bg-[#141414]">
              <div className="text-red-500 text-xl font-semibold mb-2">Error Loading Demands</div>
              <p className="text-[#888]">{error}</p>
            </div>
          ) : demands.length === 0 ? (
            <div className="text-center py-20 border border-white/5 bg-[#141414]">
              <div className="text-white text-xl font-semibold mb-4">No Demands Yet</div>
              <p className="text-[#888] mb-6">Be the first to request an artist in your area!</p>
              <Button onClick={handleCreateDemand} className="bg-yard-gold text-black hover:bg-white transition-colors">
                Create First Demand
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {demands.map((demand) => (
                <div key={demand.id} className="bg-[#141414] border border-white/5 hover:border-yard-gold/30 transition-colors p-8 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">
                      {demand.artistName}
                    </h3>
                    <span className={`px-3 py-1 text-[10px] font-bold tracking-[1px] uppercase border ${getStatusColor(demand.status)}`}>
                      {demand.status}
                    </span>
                  </div>
                  
                  {demand.description && (
                    <p className="text-[#888] text-sm mb-6 leading-relaxed flex-1">
                      {demand.description}
                    </p>
                  )}
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-[#888] text-sm">
                      <MapPin className="w-4 h-4 mr-3 text-yard-gold" />
                      <span>{demand.location}</span>
                    </div>
                    {demand.venue && (
                      <div className="flex items-center text-[#888] text-sm">
                        <div className="w-4 h-4 mr-3 text-yard-gold flex items-center justify-center">🏟️</div>
                        <span>{demand.venue}</span>
                      </div>
                    )}
                    {demand.expectedDate && (
                      <div className="flex items-center text-[#888] text-sm">
                        <Calendar className="w-4 h-4 mr-3 text-yard-gold" />
                        <span>{demand.expectedDate}</span>
                      </div>
                    )}
                    {demand.ticketPrice && (
                      <div className="flex items-center text-[#888] text-sm">
                        <Ticket className="w-4 h-4 mr-3 text-yard-gold" />
                        <span>{demand.ticketPrice}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                    <div className="flex items-center text-yard-gold font-bold text-sm">
                      <Users className="w-4 h-4 mr-2" />
                      {demand.votes} votes
                    </div>
                    <Button onClick={() => alert("Voting will be available soon!")} className="bg-transparent border border-yard-gold text-yard-gold hover:bg-yard-gold hover:text-black text-[12px] px-6 py-2 transition-colors">
                      VOTE
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-yard-dark border-t border-[#141414]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-[#141414] border border-yard-gold/20 p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yard-gold/0 via-yard-gold to-yard-gold/0"></div>
            
            <h2 className="font-bebas text-4xl lg:text-5xl text-white mb-6">
              Want an <span className="text-yard-gold">Artist in Your City?</span>
            </h2>
            <p className="text-[#888] text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Create a demand and rally your community to bring your favorite artists to perform live in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleCreateDemand} className="bg-yard-gold text-black hover:bg-white font-bold tracking-[1px] uppercase transition-colors px-8 py-4">
                Create Demand
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}