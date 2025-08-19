import { NextResponse } from 'next/server';
import { NewsService } from '@/lib/mongodb';

export async function GET() {
  try {
    // Fetch all artists from MongoDB
    const artists = await NewsService.getAllArtists();
    return NextResponse.json({ artists });
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
  }
} 