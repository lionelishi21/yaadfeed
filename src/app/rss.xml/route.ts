import { NextResponse } from 'next/server';
import { NewsService } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const baseUrl = 'https://yardvybz.news';

  try {
    const articles = await NewsService.getAllNews({ limit: 20 });

    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>YardVybz News</title>
    <link>${baseUrl}</link>
    <description>The latest news, music, and culture from Jamaica.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${articles
      .map((article) => {
        const itemUrl = `${baseUrl}/news/${article.slug}`;
        const pubDate = new Date(article.publishedAt).toUTCString();
        return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${itemUrl}</link>
      <guid isPermaLink="true">${itemUrl}</guid>
      <description><![CDATA[${article.summary}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${article.category}]]></category>
      ${
        article.imageUrl
          ? `<media:content url="${article.imageUrl}" medium="image" />`
          : ''
      }
    </item>`;
      })
      .join('')}
  </channel>
</rss>`;

    return new NextResponse(rssFeed, {
      headers: {
        'Content-Type': 'text/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
