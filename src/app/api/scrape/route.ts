import { NextRequest, NextResponse } from 'next/server';
import JamaicanNewsScraper from '@/lib/scraper';

export async function POST(request: NextRequest) {
  try {
    // Add basic authentication to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const expectedAuth = process.env.SCRAPER_API_KEY || 'development-scraper-key';
    
    if (authHeader !== `Bearer ${expectedAuth}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🚀 Starting manual news scraping...');
    
    const scraper = new JamaicanNewsScraper();
    const results = await scraper.scrapeAllSources();
    
    // IMPORTANT: We do NOT cleanup old articles - new articles are APPENDED only
    // This ensures content history is preserved and URLs don't break
    // Old articles remain accessible for SEO and user experience
    
    return NextResponse.json({
      message: 'Scraping completed successfully - new articles appended (old articles preserved)',
      results: {
        ...results,
        note: 'Articles are appended, not replaced. Old content is preserved.'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Scraping API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Return scraping status or last run info
  try {
    return NextResponse.json({
      message: 'News scraper endpoint',
      usage: 'POST with Authorization: Bearer <key> to trigger scraping',
      lastRun: 'Use POST method to run scraper'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 