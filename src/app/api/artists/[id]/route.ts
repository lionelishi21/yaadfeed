import { NextRequest, NextResponse } from 'next/server';

// Generate static params for all artist IDs
export async function generateStaticParams() {
  // Return the known artist IDs from the sample data
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
  ];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { NewsService } = await import('@/lib/mongodb');
    const artist = await NewsService.getArtistById(id);
    
    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    return NextResponse.json({ artist });
  } catch (error) {
    console.error('Error fetching artist:', error);
    return NextResponse.json({ error: 'Failed to fetch artist' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { NewsService } = await import('@/lib/mongodb');
    const updates = await request.json();
    
    // Update artist in database
    const updatedArtist = await NewsService.updateArtist(id, updates);
    
    if (!updatedArtist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    return NextResponse.json({ artist: updatedArtist });
  } catch (error) {
    console.error('Error updating artist:', error);
    return NextResponse.json({ error: 'Failed to update artist' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { NewsService } = await import('@/lib/mongodb');
    
    const deleted = await NewsService.deleteArtist(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting artist:', error);
    return NextResponse.json({ error: 'Failed to delete artist' }, { status: 500 });
  }
}