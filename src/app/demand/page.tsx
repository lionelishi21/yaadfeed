'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Ticket, Users, TrendingUp } from 'lucide-react';
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
        setDemands(data.demands || []);
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
        return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-logo-dark via-logo-primary to-logo-secondary">
      <ClientHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-screen-2xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <Link href="/artists" className="flex items-center text-white/80 hover:text-white transition-colors mr-8">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Artists
              </Link>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Artist <span className="bg-gradient-to-r from-logo-secondary to-logo-accent bg-clip-text text-transparent">Demand Board</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Vote for your favorite artists to perform in your city. Make your voice heard and bring the music you love to your community.
            </p>
          </div>
        </div>
      </section>

      {/* Demands Grid */}
      <section className="py-16 bg-white/80 backdrop-blur-lg">
        <div className="max-w-screen-2xl mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-80 bg-white/60 backdrop-blur-lg animate-pulse">
                  <div className="p-8">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-6"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-8 max-w-md mx-auto">
                <div className="text-red-600 text-xl font-semibold mb-2">Error Loading Demands</div>
                <p className="text-red-500">{error}</p>
              </div>
            </div>
          ) : demands.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-12 max-w-md mx-auto border border-white/30 shadow-soft">
                <div className="text-gray-600 text-xl font-semibold mb-4">No Demands Yet</div>
                <p className="text-gray-500 mb-6">Be the first to request an artist in your area!</p>
                <Button variant="glamour">
                  Create First Demand
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {demands.map((demand) => (
                <Card key={demand.id} className="group cursor-pointer soft-card h-full">
                  <div className="p-8 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-logo-primary transition-colors">
                        {demand.artistName}
                      </h3>
                      <span className={`px-3 py-1 rounded-xl text-xs font-semibold border ${getStatusColor(demand.status)}`}>
                        {demand.status}
                      </span>
                    </div>
                    
                    {demand.description && (
                      <p className="text-gray-600 text-lg mb-6 leading-relaxed flex-1">
                        {demand.description}
                      </p>
                    )}
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-3 text-logo-primary" />
                        <span>{demand.location}</span>
                      </div>
                      {demand.venue && (
                        <div className="flex items-center text-gray-600">
                          <div className="w-5 h-5 mr-3 text-logo-primary">🏟️</div>
                          <span>{demand.venue}</span>
                        </div>
                      )}
                      {demand.expectedDate && (
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-5 h-5 mr-3 text-logo-primary" />
                          <span>{demand.expectedDate}</span>
                        </div>
                      )}
                      {demand.ticketPrice && (
                        <div className="flex items-center text-gray-600">
                          <Ticket className="w-5 h-5 mr-3 text-logo-primary" />
                          <span>{demand.ticketPrice}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-200">
                      <div className="flex items-center text-logo-primary font-semibold">
                        <Users className="w-5 h-5 mr-2" />
                        {demand.votes} votes
                      </div>
                      <Button variant="glamour">
                        Vote
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-logo-primary via-logo-secondary to-logo-accent">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-soft">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
              Want an Artist in Your City?
            </h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Create a demand and rally your community to bring your favorite artists to perform live.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white/90 backdrop-blur-lg text-logo-primary hover:bg-white shadow-soft hover:shadow-soft-xl transition-all duration-300 text-xl font-bold px-8 py-4">
                Create Demand
              </Button>
              <Button 
                variant="outline" 
                className="border-white/80 bg-white/10 backdrop-blur-lg text-white hover:bg-white hover:text-logo-primary shadow-soft text-xl font-bold px-8 py-4"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 