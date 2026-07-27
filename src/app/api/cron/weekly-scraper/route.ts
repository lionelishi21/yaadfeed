import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('⏰ Automated weekly scraping is DISABLED to maintain AdSense compliance.');
  return NextResponse.json({
    message: 'Scraper disabled. Use the custom Antigravity skill instead to generate original content.',
    status: 'disabled',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  return GET(request);
}
