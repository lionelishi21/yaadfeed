'use client';

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Clock, ExternalLink, Search, Filter, Star } from 'lucide-react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Event, EventCategory } from '@/types';
import { formatters, stringUtils } from '@/utils';
import { EventSkeleton } from '@/components/ui/LoadingSkeleton';

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const categories: { value: EventCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Events' },
    { value: 'concert', label: 'Concerts' },
    { value: 'festival', label: 'Festivals' },
    { value: 'club-night', label: 'Club Nights' },
    { value: 'cultural-event', label: 'Cultural Events' },
    { value: 'music-competition', label: 'Competitions' },
    { value: 'workshop', label: 'Workshops' },
  ];

  useEffect(() => {
    const loadEvents = async () => {
      try {
        // Load events from artists data
        const response = await fetch('/data/sample-artists.json');
        const data = await response.json();
        
        // Extract all events from artists
        const allEvents: Event[] = data.artists.flatMap((artist: any) => 
          (artist.upcomingEvents || []).map((event: any) => ({
            ...event,
            category: event.category || 'concert'
          }))
        );

        // Sort events by date
        allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setEvents(allEvents);
        setFilteredEvents(allEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.artistName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [events, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-logo-light via-white to-logo-muted">
        <ClientHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yard-dark text-white font-sans overflow-x-hidden">
      <ClientHeader />
      
      {/* Page Header */}
      <section className="relative bg-yard-dark border-b border-[#141414] py-16 overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-yard-gold/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-14">
          <div className="text-center">
            {/* Minimalist badge */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 border border-yard-gold/30 bg-yard-gold/10 px-3.5 py-1.5 rounded-none">
                <span className="w-1.5 h-1.5 bg-yard-gold rounded-full animate-dot"></span>
                <span className="text-[11px] font-bold tracking-[2px] uppercase text-yard-gold">Live Experience</span>
              </div>
            </div>

            <h1 className="font-bebas text-[clamp(48px,5vw,72px)] leading-none text-white mb-6">
              Upcoming <span className="text-yard-gold">Events</span>
            </h1>
            <p className="text-[#888] text-base max-w-2xl mx-auto leading-[1.65]">
              Don't miss out on the best concerts, festivals, and cultural events happening across Jamaica
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-[#0a0a0a] py-6 border-b border-[#141414]">
        <div className="max-w-7xl mx-auto px-6 sm:px-14">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#555]" />
              </div>
              <input
                type="text"
                placeholder="Search events, artists, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141414] border border-[#222] text-white pl-11 pr-4 py-3.5 focus:outline-none focus:border-yard-gold/50 transition-colors text-sm placeholder:text-[#555]"
              />
            </div>

            {/* Category Filter */}
            <div className="flex-shrink-0 relative w-full lg:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-[#555]" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as EventCategory | 'all')}
                className="w-full bg-[#141414] border border-[#222] text-[#888] pl-10 pr-8 py-3.5 focus:outline-none focus:border-yard-gold/50 transition-colors appearance-none cursor-pointer text-[12px] font-bold tracking-[0.5px] uppercase"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Events Content */}
      <section className="py-16 bg-yard-dark">
        <div className="max-w-7xl mx-auto px-6 sm:px-14">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20 border border-white/5 bg-[#0f0f0f]">
              <div className="w-24 h-24 bg-yard-gray rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-yard-gold" />
              </div>
              <p className="text-[#888] text-lg">No events found matching your criteria.</p>
              <p className="text-[#555] mt-2">Check back soon for more exciting events!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-[#0f0f0f] border border-white/5 group hover:border-yard-gold/30 transition-colors h-full flex flex-col p-6">
                  <div className="flex items-start gap-6">
                    {/* Date Box */}
                    <div className="bg-[#141414] border border-white/10 text-center min-w-[70px] py-3 rounded-none group-hover:border-yard-gold/50 transition-colors shrink-0">
                      <div className="text-2xl font-bebas text-yard-gold">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-[10px] font-bold tracking-[1px] uppercase text-[#888]">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-[10px] text-[#555]">
                        {new Date(event.date).getFullYear()}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1">
                      {/* Category and Popular Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-transparent border border-white/10 text-yard-gold px-2 py-0.5 text-[9px] font-bold tracking-[1px] uppercase">
                          {stringUtils.capitalize(event.category.replace('-', ' '))}
                        </span>
                        {event.isPopular && (
                          <div className="flex items-center text-yard-gold border border-yard-gold/30 px-2 py-0.5 text-[9px] font-bold tracking-[1px] uppercase bg-yard-gold/10">
                            <Star className="w-3 h-3 mr-1" />
                            <span>Popular</span>
                          </div>
                        )}
                      </div>

                      {/* Event Title */}
                      <h3 className="text-xl font-bebas tracking-[1px] text-white mb-2 group-hover:text-yard-gold transition-colors duration-200">
                        {event.title}
                      </h3>

                      {/* Artist Name */}
                      {event.artistName && (
                        <p className="text-[#ccc] text-sm mb-3 font-semibold">
                          {event.artistName}
                        </p>
                      )}

                      {/* Event Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-[#888] text-[13px]">
                          <MapPin className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-[#666]" />
                          <span>{event.venue}, {event.location}</span>
                        </div>
                        <div className="flex items-center text-[#888] text-[13px]">
                          <Clock className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-[#666]" />
                          <span>{event.time}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[#888] text-[13px] mb-6 line-clamp-2 leading-[1.6]">
                        {event.description}
                      </p>

                      {/* Price and Action */}
                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          {event.price && (
                            <div className="text-[18px] font-bebas text-yard-gold tracking-[1px]">
                              {event.price}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3">
                          {event.ticketUrl && (
                            <div className="bg-transparent border border-[#333] text-[#ccc] text-[11px] font-bold tracking-[1px] uppercase px-3 py-2 cursor-pointer hover:border-white transition-colors flex items-center">
                              <ExternalLink className="w-3 h-3 mr-1.5" />
                              Tickets
                            </div>
                          )}
                          <div className="bg-transparent border border-yard-gold text-yard-gold text-[11px] font-bold tracking-[1px] uppercase px-3 py-2 cursor-pointer hover:bg-yard-gold hover:text-yard-dark transition-colors">
                            Details
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event Image */}
                  {event.imageUrl && (
                    <div className="mt-6 aspect-[21/9] overflow-hidden bg-[#141414] relative border border-white/5">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        width={600}
                        height={300}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-20 border border-yard-gold/30 bg-[#0f0f0f] p-10 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yard-gold/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-yard-gold/10 transition-colors duration-1000"></div>
            <h3 className="text-[32px] font-bebas tracking-[1px] text-white mb-4 leading-none">
              Want to list your event?
            </h3>
            <p className="text-[#888] text-[14px] mb-8 max-w-2xl mx-auto leading-[1.65]">
              Reach thousands of music lovers and event-goers across Jamaica and the diaspora. 
              Submit your event for consideration on YaadFeed.
            </p>
            <div className="inline-block bg-yard-gold text-yard-dark text-[13px] font-bold tracking-[1px] uppercase px-8 py-3.5 cursor-pointer hover:bg-white transition-colors">
              Submit Event
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventsPage;
