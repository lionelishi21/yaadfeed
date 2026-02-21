import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Star, MapPin, Calendar, Phone } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface FeaturedAd {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  category: 'business' | 'events' | 'services' | 'products' | 'tourism';
  sponsor: string;
  location?: string;
  phone?: string;
  rating?: number;
  price?: string;
  discount?: string;
  featured: boolean;
}

const featuredAds: FeaturedAd[] = [
  {
    id: '1',
    title: 'Blue Mountain Coffee Tours',
    description: 'Experience authentic Jamaican coffee culture. Guided tours through historic plantations with tastings.',
    imageUrl: '/images/jamaica-flag-bg.jpg',
    ctaText: 'Book Tour',
    ctaUrl: '#',
    category: 'tourism',
    sponsor: 'Blue Mountain Coffee Co.',
    location: 'Blue Mountains, Jamaica',
    phone: '+1-876-555-0123',
    rating: 4.9,
    price: 'From $85/person',
    featured: true
  },
  {
    id: '2',
    title: 'Reggae Music Studio',
    description: 'Professional recording studio in Kingston. Book your session with Grammy-winning engineers.',
    imageUrl: '/images/jamaica-flag-bg.jpg',
    ctaText: 'Book Session',
    ctaUrl: '#',
    category: 'services',
    sponsor: 'Tuff Gong Studios',
    location: 'Kingston, Jamaica',
    phone: '+1-876-555-0234',
    rating: 4.8,
    price: 'From $200/hour',
    featured: true
  },
  {
    id: '3',
    title: 'Jamaican Jerk Festival 2024',
    description: 'The biggest jerk food festival in the Caribbean. Live music, authentic cuisine, and cultural performances.',
    imageUrl: '/images/jamaica-flag-bg.jpg',
    ctaText: 'Get Tickets',
    ctaUrl: '#',
    category: 'events',
    sponsor: 'Jamaica Cultural Events',
    location: 'Hope Gardens, Kingston',
    price: 'From $25',
    discount: '20% OFF Early Bird',
    featured: true
  },
  {
    id: '4',
    title: 'Authentic Jamaican Spices',
    description: 'Premium jerk seasoning, curry powder, and scotch bonnet sauce. Shipped worldwide.',
    imageUrl: '/images/jamaica-flag-bg.jpg',
    ctaText: 'Shop Now',
    ctaUrl: '#',
    category: 'products',
    sponsor: 'Island Spice Company',
    discount: '15% OFF First Order',
    featured: false
  },
  {
    id: '5',
    title: 'Montego Bay Beach Resort',
    description: 'Luxury all-inclusive resort with pristine beaches, spa services, and authentic Jamaican cuisine.',
    imageUrl: '/images/jamaica-flag-bg.jpg',
    ctaText: 'Book Now',
    ctaUrl: '#',
    category: 'tourism',
    sponsor: 'Paradise Beach Resort',
    location: 'Montego Bay, Jamaica',
    phone: '+1-876-555-0345',
    rating: 4.7,
    price: 'From $299/night',
    featured: false
  },
  {
    id: '6',
    title: 'Bob Marley Museum Tours',
    description: 'Walk through the legendary reggae icon\'s former home. Interactive exhibits and rare memorabilia.',
    imageUrl: '/images/jamaica-flag-bg.jpg',
    ctaText: 'Visit Museum',
    ctaUrl: '#',
    category: 'tourism',
    sponsor: 'Bob Marley Foundation',
    location: 'Kingston, Jamaica',
    phone: '+1-876-555-0456',
    rating: 4.9,
    price: '$25 Adults / $12 Children',
    featured: false
  },
  {
    id: '7',
    title: 'Caribbean Car Rental',
    description: 'Explore Jamaica at your own pace. Modern fleet, competitive rates, and island-wide service.',
    imageUrl: '/images/jamaica-flag-bg.jpg',
    ctaText: 'Rent Car',
    ctaUrl: '#',
    category: 'services',
    sponsor: 'Island Drive Rentals',
    phone: '+1-876-555-0567',
    rating: 4.6,
    price: 'From $45/day',
    discount: '10% OFF Weekly Rentals',
    featured: false
  },
  {
    id: '8',
    title: 'Jamaican Craft Market',
    description: 'Handmade crafts, artwork, and souvenirs by local artisans. Support Jamaican artists and culture.',
    imageUrl: '/images/jamaica-flag-bg.jpg',
    ctaText: 'Shop Local',
    ctaUrl: '#',
    category: 'products',
    sponsor: 'Kingston Craft Collective',
    location: 'Devon House, Kingston',
    featured: false
  },
  {
    id: '9',
    title: 'Dancehall Dance Classes',
    description: 'Learn authentic Jamaican dancehall moves from professional dancers. All skill levels welcome.',
    imageUrl: '/images/jamaica-flag-bg.jpg',
    ctaText: 'Join Class',
    ctaUrl: '#',
    category: 'services',
    sponsor: 'Island Moves Dance Studio',
    location: 'Spanish Town, Jamaica',
    phone: '+1-876-555-0678',
    price: '$30/class or $100/month',
    featured: false
  },
  {
    id: '10',
    title: 'Ocho Rios Adventure Tours',
    description: 'Dunn\'s River Falls, zip-lining, and river tubing. Complete adventure package with lunch included.',
    imageUrl: '/images/jamaica-flag-bg.jpg',
    ctaText: 'Book Adventure',
    ctaUrl: '#',
    category: 'tourism',
    sponsor: 'Ocho Rios Adventures',
    location: 'Ocho Rios, Jamaica',
    phone: '+1-876-555-0789',
    rating: 4.8,
    price: 'From $125/person',
    featured: false
  }
];

const getCategoryColor = (category: string) => {
  const colors = {
    business: 'bg-blue-100 text-blue-800',
    events: 'bg-purple-100 text-purple-800',
    services: 'bg-green-100 text-green-800',
    products: 'bg-orange-100 text-orange-800',
    tourism: 'bg-jamaica-green-100 text-jamaica-green-800'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'tourism': return <MapPin className="w-3 h-3" />;
    case 'events': return <Calendar className="w-3 h-3" />;
    case 'services': return <Phone className="w-3 h-3" />;
    default: return null;
  }
};

const FeaturedAds: React.FC = () => {
  const featuredCount = featuredAds.filter(ad => ad.featured).length;
  const regularAds = featuredAds.filter(ad => !ad.featured);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured <span className="text-jamaica-green-600">Partners</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover authentic Jamaican experiences from our trusted local partners
          </p>
        </div>

        {/* Featured Ads (Top Row) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredAds.filter(ad => ad.featured).map((ad, index) => (
            <Card 
              key={ad.id} 
              className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Featured Badge */}
              <div className="absolute top-4 left-4 z-10 bg-jamaica-gold-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                FEATURED
              </div>

              {/* Discount Badge */}
              {ad.discount && (
                <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                  {ad.discount}
                </div>
              )}

              {/* Image */}
              <div className="aspect-video mb-4 overflow-hidden rounded-lg bg-gray-200">
                <Image
                  src={ad.imageUrl}
                  alt={ad.title}
                  width={400}
                  height={240}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/jamaica-flag-bg.jpg';
                  }}
                />
              </div>

              <div className="p-6">
                {/* Category and Rating */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(ad.category)}`}>
                    {getCategoryIcon(ad.category)}
                    <span className="capitalize">{ad.category}</span>
                  </div>
                  {ad.rating && (
                    <div className="flex items-center space-x-1 text-jamaica-gold-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{ad.rating}</span>
                    </div>
                  )}
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-jamaica-green-600 transition-colors">
                  {ad.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {ad.description}
                </p>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  {ad.location && (
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      {ad.location}
                    </div>
                  )}
                  {ad.phone && (
                    <div className="flex items-center text-gray-500 text-sm">
                      <Phone className="w-4 h-4 mr-2" />
                      {ad.phone}
                    </div>
                  )}
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    {ad.price && (
                      <div className="text-jamaica-green-600 font-bold text-lg">
                        {ad.price}
                      </div>
                    )}
                    <div className="text-gray-500 text-xs">
                      by {ad.sponsor}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-jamaica-green-600 hover:bg-jamaica-green-700 text-white"
                    onClick={() => window.open(ad.ctaUrl, '_blank')}
                  >
                    {ad.ctaText}
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Regular Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {regularAds.map((ad, index) => (
            <Card 
              key={ad.id} 
              className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] relative"
              style={{ animationDelay: `${(featuredCount + index) * 0.1}s` }}
            >
              {/* Discount Badge */}
              {ad.discount && (
                <div className="absolute top-2 right-2 z-10 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  {ad.discount}
                </div>
              )}

              {/* Compact Image */}
              <div className="aspect-[4/3] mb-3 overflow-hidden rounded-lg bg-gray-200">
                <Image
                  src={ad.imageUrl}
                  alt={ad.title}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/jamaica-flag-bg.jpg';
                  }}
                />
              </div>

              <div className="p-4">
                {/* Category and Rating */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(ad.category)}`}>
                    {ad.category}
                  </span>
                  {ad.rating && (
                    <div className="flex items-center space-x-1 text-jamaica-gold-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs">{ad.rating}</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h4 className="text-md font-semibold text-gray-900 mb-1 group-hover:text-jamaica-green-600 transition-colors line-clamp-1">
                  {ad.title}
                </h4>

                {/* Description */}
                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                  {ad.description}
                </p>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    {ad.price && (
                      <div className="text-jamaica-green-600 font-bold text-sm">
                        {ad.price.split('/')[0]}
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs hover:bg-jamaica-green-50 hover:border-jamaica-green-300"
                    onClick={() => window.open(ad.ctaUrl, '_blank')}
                  >
                    {ad.ctaText}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Sponsor Note */}
        <div className="text-center mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            <strong>Partner with YaadFeed:</strong> Promote your business to Jamaica's digital community. 
            <Link href="/advertise" className="text-jamaica-green-600 hover:underline ml-1">
              Learn more about advertising
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAds; 