import { NextResponse } from 'next/server';

export async function GET() {
  const content = `google.com, pub-8872711759728449, DIRECT, f08c47fec0942fa0
# Ezoic Ads.txt Manager Integration for yardvybz.news
# Automated updates via https://srv.adstxtmanager.com/19390/yardvybz.news`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
