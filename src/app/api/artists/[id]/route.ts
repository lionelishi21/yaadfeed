import { NextRequest, NextResponse } from 'next/server';
import { NewsService } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('🔍 [ARTIST API] Fetching artist with ID:', id);

    // Fetch artist from MongoDB - try both _id and id fields
    let artist = await NewsService.getArtistById(id);
    
    // If not found by _id, try to find by name or other fields
    if (!artist) {
      const allArtists = await NewsService.getAllArtists();
      artist = allArtists.find(a => 
        a._id?.toString() === id || 
        a.id === id || 
        a.name?.toLowerCase() === id.toLowerCase()
      );
    }
    
    if (!artist) {
      console.log('🔍 [ARTIST API] Artist not found:', id);
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // Transform MongoDB _id to id for frontend compatibility
    const transformedArtist = {
      ...artist,
      id: artist._id?.toString() || artist.id,
      _id: undefined
    };

    // Fetch related articles for this artist
    let relatedArticles: any[] = [];
    try {
      // Search for articles that mention this artist
      const searchQuery = transformedArtist.name;
      const articles = await NewsService.getAllNews();
      
      // Filter articles that mention the artist (case-insensitive)
      relatedArticles = articles.filter(article => {
        const content = `${article.title} ${article.summary} ${article.tags?.join(' ') || ''}`.toLowerCase();
        const artistName = searchQuery.toLowerCase();
        
        // Check if artist name appears in title, summary, or tags
        return content.includes(artistName) || 
               article.tags?.some(tag => tag.toLowerCase().includes(artistName)) ||
               article.title.toLowerCase().includes(artistName);
      });

      // Sort by relevance and date
      relatedArticles.sort((a, b) => {
        // Prioritize articles with artist name in title
        const aInTitle = a.title.toLowerCase().includes(transformedArtist.name.toLowerCase());
        const bInTitle = b.title.toLowerCase().includes(transformedArtist.name.toLowerCase());
        
        if (aInTitle && !bInTitle) return -1;
        if (!aInTitle && bInTitle) return 1;
        
        // Then by date (newest first)
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });

      // Limit to 10 most relevant articles
      relatedArticles = relatedArticles.slice(0, 10);
      
      console.log('🔍 [ARTIST API] Found', relatedArticles.length, 'related articles for artist:', transformedArtist.name);
    } catch (articleError) {
      console.error('🔍 [ARTIST API] Error fetching related articles:', articleError);
      // Continue without articles if there's an error
    }

    const response = {
      artist: transformedArtist,
      relatedArticles,
      totalArticles: relatedArticles.length,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('🔍 [ARTIST API] Error fetching artist:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch artist',
        details: error.message,
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}
