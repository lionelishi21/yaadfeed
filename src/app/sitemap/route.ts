import { NextResponse } from 'next/server';
import { NewsService } from '@/lib/mongodb';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4000';
  const now = new Date().toISOString();

  try {
    const articles = await NewsService.getAllNews({ limit: 200 });

    const urls = [
      `${siteUrl}/`,
      `${siteUrl}/news`,
      `${siteUrl}/artists`,
    ];

    const articleUrls = articles.map((a: any) => `${siteUrl}/news/${a.slug}`);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${[...urls, ...articleUrls]
    .map(
      (loc) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>${loc === `${siteUrl}/` ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (e) {
    return new NextResponse('<urlset/>', {
      status: 200,
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}


