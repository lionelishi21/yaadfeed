import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { NewsService } = await import('@/lib/mongodb');
    const artist = await NewsService.getArtistById(params.id);
    
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
  { params }: { params: { id: string } }
) {
  try {
    const { NewsService } = await import('@/lib/mongodb');
    const updates = await request.json();
    
    // Update artist in database
    const updatedArtist = await NewsService.updateArtist(params.id, updates);
    
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
  { params }: { params: { id: string } }
) {
  try {
    const { NewsService } = await import('@/lib/mongodb');
    
    const deleted = await NewsService.deleteArtist(params.id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting artist:', error);
    return NextResponse.json({ error: 'Failed to delete artist' }, { status: 500 });
  }
}