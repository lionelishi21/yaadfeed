'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Clock, ExternalLink, Search, Filter, Star } from 'lucide-react';
import Header from '@/components/Header';
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
        <Header />
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
    <div className="min-h-screen bg-gradient-to-br from-logo-light via-white to-logo-muted">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-logo-primary to-logo-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Upcoming Events
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Don't miss out on the best concerts, festivals, and cultural events happening across Jamaica
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events, artists, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-primary/30 focus:border-transparent outline-none shadow-soft"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as EventCategory | 'all')}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-logo-primary/30 focus:border-transparent outline-none shadow-soft"
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
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No events found matching your criteria.</p>
              <p className="text-gray-500 mt-2">Check back soon for more exciting events!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredEvents.map((event) => (
                <Card key={event.id} variant="event" className="h-full group soft-card">
                  <div className="flex items-start space-x-6">
                    {/* Date Box */}
                    <div className="bg-gradient-to-br from-logo-primary to-logo-secondary text-white p-4 rounded-xl text-center min-w-[80px] group-hover:scale-105 transition-transform duration-200 shadow-soft">
                      <div className="text-2xl font-bold">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-xs uppercase">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-sm">
                        {new Date(event.date).getFullYear()}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1">
                      {/* Category and Popular Badge */}
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="bg-logo-primary/10 text-logo-primary/80 px-2 py-1 rounded-xl text-xs font-medium shadow-soft">
                          {stringUtils.capitalize(event.category.replace('-', ' '))}
                        </span>
                        {event.isPopular && (
                          <div className="flex items-center text-logo-secondary">
                            <Star className="w-4 h-4 mr-1" />
                            <span className="text-xs">Popular</span>
                          </div>
                        )}
                      </div>

                      {/* Event Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-logo-primary transition-colors duration-200">
                        {event.title}
                      </h3>

                      {/* Artist Name */}
                      {event.artistName && (
                        <p className="text-logo-primary font-medium mb-2">
                          {event.artistName}
                        </p>
                      )}

                      {/* Event Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{event.venue}, {event.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{event.time}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      {/* Price and Action */}
                      <div className="flex items-center justify-between">
                        <div>
                          {event.price && (
                            <div className="text-lg font-semibold text-logo-primary">
                              {event.price}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {event.ticketUrl && (
                            <Button size="sm" variant="outline">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Tickets
                            </Button>
                          )}
                          <Button size="sm" variant="glamour">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event Image */}
                  {event.imageUrl && (
                    <div className="mt-6 aspect-video overflow-hidden rounded-xl">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        width={600}
                        height={300}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-12 text-center bg-gradient-to-r from-logo-light to-logo-muted rounded-3xl p-8 shadow-soft">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Want to list your event?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Reach thousands of music lovers and event-goers across Jamaica and the diaspora. 
              Submit your event for consideration on YaadFeed.
            </p>
            <Button size="lg" variant="glamour">
              Submit Event
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventsPage;
