import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { NewsService } = await import('@/lib/mongodb');
    // Fetch all artists from MongoDB
    const artists = await NewsService.getAllArtists();
    
    // Transform MongoDB _id to id for frontend compatibility
    const transformedArtists = artists.map(artist => ({
      ...artist,
      id: artist._id?.toString() || artist.id,
      _id: undefined // Remove _id to avoid confusion
    }));
    
    return NextResponse.json({ artists: transformedArtists });
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
  }
} 