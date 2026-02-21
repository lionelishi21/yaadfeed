import { NextRequest, NextResponse } from 'next/server';
import { artistSpotlightScraper, ArtistSpotlight } from '@/lib/scrapers/artistSpotlightScraper';

export async function GET(request: NextRequest) {
  try {
    console.log('🎵 [ARTIST SPOTLIGHTS API] Starting request...');
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const limit = parseInt(searchParams.get('limit') || '10');

    let result: any;

    switch (action) {
      case 'scrape':
        console.log('🔄 [ARTIST SPOTLIGHTS API] Running scraper...');
        result = await artistSpotlightScraper.scrapeNewReleases();
        break;
      
      case 'force-scrape':
        console.log('🔄 [ARTIST SPOTLIGHTS API] Force running scraper...');
        result = await artistSpotlightScraper.forceScrape();
        break;
      
      case 'featured':
        console.log('⭐ [ARTIST SPOTLIGHTS API] Getting featured spotlight...');
        result = await artistSpotlightScraper.getFeaturedSpotlight();
        break;
      
      case 'recent':
        console.log('📅 [ARTIST SPOTLIGHTS API] Getting recent spotlights...');
        result = await artistSpotlightScraper.getRecentSpotlights(limit);
        break;
      
      case 'stats':
        console.log('📊 [ARTIST SPOTLIGHTS API] Getting scraping stats...');
        result = await artistSpotlightScraper.getScrapingStats();
        break;
      
      default:
        console.log('📋 [ARTIST SPOTLIGHTS API] Getting all spotlights...');
        result = await artistSpotlightScraper.getExistingSpotlights();
    }

    console.log(`✅ [ARTIST SPOTLIGHTS API] Successfully processed ${action || 'default'} request`);
    
    return NextResponse.json({
      success: true,
      data: result,
      action: action || 'all',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ [ARTIST SPOTLIGHTS API] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch artist spotlights',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🎵 [ARTIST SPOTLIGHTS API] Starting POST request...');
    
    const body = await request.json();
    const { action, id, status } = body;

    let result: any;

    switch (action) {
      case 'update-status':
        if (!id || !status) {
          return NextResponse.json({
            success: false,
            error: 'Missing required fields: id and status'
          }, { status: 400 });
        }
        
        console.log(`🔄 [ARTIST SPOTLIGHTS API] Updating status for ${id} to ${status}`);
        await artistSpotlightScraper.updateSpotlightStatus(id, status);
        result = { message: 'Status updated successfully' };
        break;
      
      case 'force-scrape':
        console.log('🔄 [ARTIST SPOTLIGHTS API] Force running scraper via POST...');
        result = await artistSpotlightScraper.forceScrape();
        break;
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

    console.log(`✅ [ARTIST SPOTLIGHTS API] Successfully processed POST ${action} request`);
    
    return NextResponse.json({
      success: true,
      data: result,
      action,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ [ARTIST SPOTLIGHTS API] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process request',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
