import { NextResponse } from 'next/server';

// Fallback artists data
const getFallbackArtists = () => [
  {
    id: '1',
    name: 'Chronixx',
    bio: 'Jamaican reggae artist known for his conscious lyrics and modern reggae sound.',
    imageUrl: '/images/chronixx.jpg',
    genres: ['Reggae', 'Roots Reggae', 'Conscious Reggae'],
    popularity: 95,
    followers: 1000000,
    isJamaican: true,
    isVerified: true,
    socialMedia: {
      instagram: 'https://instagram.com/chronixxmusic',
      twitter: 'https://twitter.com/chronixxmusic'
    },
    discography: [],
    upcomingEvents: []
  },
  {
    id: '2',
    name: 'Koffee',
    bio: 'Grammy-winning Jamaican reggae artist who has taken the world by storm.',
    imageUrl: '/images/koffee.jpg',
    genres: ['Reggae', 'Dancehall', 'Pop Reggae'],
    popularity: 92,
    followers: 800000,
    isJamaican: true,
    isVerified: true,
    socialMedia: {
      instagram: 'https://instagram.com/koffee',
      twitter: 'https://twitter.com/koffee'
    },
    discography: [],
    upcomingEvents: []
  },
  {
    id: '3',
    name: 'Protoje',
    bio: 'Jamaican reggae artist and producer known for his conscious lyrics and modern sound.',
    imageUrl: '/images/protoje.jpg',
    genres: ['Reggae', 'Roots Reggae', 'Conscious Reggae'],
    popularity: 88,
    followers: 600000,
    isJamaican: true,
    isVerified: true,
    socialMedia: {
      instagram: 'https://instagram.com/protoje',
      twitter: 'https://twitter.com/protoje'
    },
    discography: [],
    upcomingEvents: []
  },
  {
    id: '4',
    name: 'Jah9',
    bio: 'Jamaican reggae artist known for her powerful vocals and conscious lyrics.',
    imageUrl: '/images/jah9.jpg',
    genres: ['Reggae', 'Roots Reggae', 'Conscious Reggae'],
    popularity: 85,
    followers: 500000,
    isJamaican: true,
    isVerified: true,
    socialMedia: {
      instagram: 'https://instagram.com/jah9',
      twitter: 'https://twitter.com/jah9'
    },
    discography: [],
    upcomingEvents: []
  }
];

export async function GET() {
  try {
    const { ArtistService } = await import('@/lib/mongodb');
    
    // Fetch artists from MongoDB with default limit
    const artists = await ArtistService.getAllArtists(4);
    
    // Transform MongoDB _id to id for frontend compatibility
    let transformedArtists = artists.map(artist => ({
      ...artist,
      id: artist._id?.toString() || artist.id,
      _id: undefined // Remove _id to avoid confusion
    }));

    // If no artists found, return fallback data
    if (transformedArtists.length === 0) {
      console.log('No artists found in database, using fallback data');
      transformedArtists = getFallbackArtists();
    }
    
    return NextResponse.json({ 
      artists: transformedArtists,
      total: transformedArtists.length 
    }, { 
      headers: { 
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'public, s-maxage=300',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
      } 
    });
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch artists',
      artists: [] // Return empty array as fallback
    }, { status: 500 });
  }
} 