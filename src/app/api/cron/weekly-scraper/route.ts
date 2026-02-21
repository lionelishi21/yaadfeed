import { NextRequest, NextResponse } from 'next/server';
import { handleWeeklyScraper } from '@/lib/cron/weeklyScraper';

/**
 * Vercel Cron Job Endpoint
 * This endpoint is called by Vercel's cron service every week
 * 
 * To set up the cron job in Vercel:
 * 1. Add to vercel.json:
 *    {
 *      "crons": [
 *        {
 *          "path": "/api/cron/weekly-scraper",
 *          "schedule": "0 0 * * 0"
 *        }
 *      ]
 *    }
 * 
 * 2. Or use Vercel Dashboard > Functions > Cron Jobs
 */

export async function GET(request: NextRequest) {
  try {
    console.log('⏰ [CRON API] Weekly scraper cron job triggered');
    
    // Verify the request is from Vercel cron (optional security check)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.log('❌ [CRON API] Unauthorized cron request');
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Run the weekly scraper
    await handleWeeklyScraper();

    console.log('✅ [CRON API] Weekly scraper cron job completed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Weekly scraper completed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ [CRON API] Error in weekly scraper cron job:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Weekly scraper failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 [CRON API] Manual weekly scraper trigger');
    
    const body = await request.json();
    const { action } = body;

    if (action === 'trigger') {
      await handleWeeklyScraper();
      
      return NextResponse.json({
        success: true,
        message: 'Weekly scraper manually triggered and completed',
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('❌ [CRON API] Error in manual trigger:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Manual trigger failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
