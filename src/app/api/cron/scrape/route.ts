import { NextRequest, NextResponse } from 'next/server';
import { scrapeNewsWithPagination } from '@/lib/scraper';

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from a cron job (Vercel cron or authorized source)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-cron-secret';
    
    // For Vercel cron jobs, check the cron secret
    if (authHeader !== `Bearer ${cronSecret}`) {
      console.log('❌ Unauthorized cron request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('⏰ Starting scheduled news scraping at', new Date().toISOString());
    console.log('🎨 AI image generation will be enabled for new articles');
    console.log('🎵 Artist linking will be enabled for new articles');
    
    // Run the enhanced scraper with pagination
    const results = await scrapeNewsWithPagination(1, 50); // First page, 50 articles per page
    
    const response = {
      message: 'Scheduled scraping completed with AI image generation and artist linking',
      timestamp: new Date().toISOString(),
      results: {
        ...results,
        imageGeneration: 'enabled',
        artistLinking: 'enabled',
        pagination: {
          currentPage: 1,
          articlesPerPage: 50,
          hasMore: results.hasMore,
          totalPages: results.totalPages
        }
      }
    };
    
    console.log('✅ Scheduled scraping completed with AI images and artist links:', response);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Cron scraping error:', error);
    
    // Return success even on error to prevent Vercel from retrying
    return NextResponse.json({
      error: 'Scraping failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 200 });
  }
}

// Also support POST for manual testing
export async function POST(request: NextRequest) {
  return GET(request);
} 