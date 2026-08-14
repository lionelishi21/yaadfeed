import { NextResponse } from 'next/server';

// Serve ads.txt as a Next.js route for both Google AdSense and Ezoic.
// It dynamically fetches Ezoic's adstxtmanager file for yardvybz.news,
// ensures Google AdSense DIRECT line is included, and provides full fallback.

const GOOGLE_ADSENSE_LINE = `google.com, pub-8872711759728449, DIRECT, f08c47fec0942fa0`;
const EZOIC_ADSTXT_URL = `https://srv.adstxtmanager.com/19390/yardvybz.news`;

export async function GET() {
  let content = '';

  try {
    const res = await fetch(EZOIC_ADSTXT_URL, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (res.ok) {
      const ezoicContent = await res.text();
      content = ezoicContent;
    }
  } catch (error) {
    console.error('Failed to fetch Ezoic ads.txt:', error);
  }

  // Ensure Google AdSense line is included
  if (!content.includes('pub-8872711759728449')) {
    content = `${GOOGLE_ADSENSE_LINE}\n${content}`;
  }

  return new NextResponse(content.trim() + '\n', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
