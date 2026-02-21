import { NextRequest, NextResponse } from 'next/server';
import { BatchArtistScraper } from '@/lib/batchArtistScraper';
import { scrapeNewsWithPagination } from '@/lib/scraper';

export async function POST(request: NextRequest) {
  try {
    console.log('🎵 [API] Starting comprehensive artist and news scraping via API...');
    
    // Initialize the batch artist scraper
    const batchScraper = new BatchArtistScraper();
    
    // Step 1: Scrape all artists
    console.log('📊 [API] Step 1: Scraping artist information...');
    const artistResults = await batchScraper.scrapeAllArtists();
    console.log('📊 [API] Scraping complete. Results:', artistResults);

    // Step 1.5: Save artists to database
    console.log('💾 [API] Saving scraped artists to database...');
    const saveResults = await batchScraper.saveResultsToDatabase(artistResults.results);
    console.log('💾 [API] Save results:', saveResults);
    
    // Step 2: Scrape news and link to artists
    console.log('📰 [API] Step 2: Scraping news and linking to artists...');
    const newsResults = await scrapeNewsWithPagination(1, 50);
    console.log('📰 [API] News scraping results:', newsResults);
    
    // Generate summary
    const summary = {
      artists: {
        total: artistResults.total,
        successful: artistResults.successful,
        failed: artistResults.failed,
        regions: artistResults.regions,
        saved: saveResults.saved,
        saveFailed: saveResults.failed
      },
      news: {
        articlesAdded: newsResults.articlesAdded,
        artistLinks: newsResults.artistLinks,
        sources: newsResults.sources
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ [API] Scraping completed successfully! Summary:', summary);
    
    return NextResponse.json({
      success: true,
      message: 'Artist and news scraping completed successfully',
      summary
    });
    
  } catch (error) {
    console.error('❌ [API] Error during scraping:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error during scraping',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to trigger artist and news scraping',
    endpoints: {
      POST: '/api/scrape-artists - Trigger comprehensive scraping'
    }
  });
} 