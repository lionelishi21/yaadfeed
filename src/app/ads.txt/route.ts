import { NextResponse } from 'next/server';

// Serve ads.txt as a Next.js route so it's ALWAYS available,
// even if the standalone build doesn't copy public/ files.
// This ensures Google AdSense can always find and verify the file.

const ADS_TXT_CONTENT = `google.com, pub-8872711759728449, DIRECT, f08c47fec0942fa0
`;

export async function GET() {
  return new NextResponse(ADS_TXT_CONTENT, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
