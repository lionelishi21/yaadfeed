import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No artist IDs provided' }, { status: 400 });
    }

    const { NewsService } = await import('@/lib/mongodb');
    
    const result = await NewsService.bulkDeleteArtists(ids);
    
    return NextResponse.json({ 
      success: true, 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error bulk deleting artists:', error);
    return NextResponse.json({ error: 'Failed to delete artists' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { ids, updates } = await request.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No artist IDs provided' }, { status: 400 });
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    const { NewsService } = await import('@/lib/mongodb');
    
    const result = await NewsService.bulkUpdateArtists(ids, updates);
    
    return NextResponse.json({ 
      success: true, 
      updatedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error bulk updating artists:', error);
    return NextResponse.json({ error: 'Failed to update artists' }, { status: 500 });
  }
}
