import { NextRequest, NextResponse } from 'next/server';

async function fetchAndExtractMainContent(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      cache: 'no-store'
    });
    if (!res.ok) return '';
    const html = await res.text();
    // Try extracting <article> or <main>, or common content containers
    let segment = '';
    const articleMatch = html.match(/<article[\s\S]*?>([\s\S]*?)<\/article>/i);
    if (articleMatch) segment = articleMatch[1];
    if (!segment) {
      const mainMatch = html.match(/<main[\s\S]*?>([\s\S]*?)<\/main>/i);
      if (mainMatch) segment = mainMatch[1];
    }
    if (!segment) {
      const divMatch = html.match(/<div[^>]*(class|id)=["']([^"']*(article|content|post|story|entry)[^"']*)["'][^>]*>([\s\S]*?)<\/div>/i);
      if (divMatch) segment = divMatch[4];
    }
    const withBreaks = (segment || html)
      .replace(/\r/g, '')
      .replace(/<\/(p|div|section|article|h\d|li)>/gi, '\n\n')
      .replace(/<br\s*\/??\s*>/gi, '\n')
      .replace(/<li>/gi, '• ');
    const cleaned = withBreaks
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned;
  } catch {
    return '';
  }
}

// Generate static params for static export
export async function generateStaticParams() {
  try {
    const { default: NewsService } = await import('@/lib/mongodb');
    const slugs = await NewsService.getAllSlugs();
    return slugs.map(slug => ({ slug }));
  } catch (error) {
    console.error('Error fetching slugs for generateStaticParams:', error);
    // Fallback to empty array if database is not available
    return [];
  }
}
// lazy import heavy service

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { default: NewsService } = await import('@/lib/mongodb');
    const { slug } = await params;

    // Try to find article by slug first
    let article = await NewsService.getNewsBySlug(slug);

    // If not found by slug, try by ID
    if (!article) {
      article = await NewsService.getNewsById(slug);
    }

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Update view count
    await NewsService.updateViewCount(article.slug);

    // Get related articles
    const relatedArticles = await NewsService.getRelatedNews(
      article.category, 
      article.slug, 
      3
    );

    // Transform article data (defensive)
    let articleContent = typeof article.content === 'string' ? article.content : '';
    // If content is too short, try expanding from original source URL when available
    const originalUrl: string = (article as any).url || '';
    if (articleContent.trim().length < 400 && originalUrl) {
      const expanded = await fetchAndExtractMainContent(originalUrl);
      if (expanded && expanded.length > articleContent.length) {
        articleContent = expanded;
      }
    }
    const articleViewCount = typeof article.viewCount === 'number' ? article.viewCount : 0;
    const transformedArticle = {
      id: (article as any)._id,
      title: article.title || '',
      slug: article.slug || '',
      summary: (article.summary && article.summary.length > 40) ? article.summary : (articleContent ? (articleContent.slice(0, 320) + (articleContent.length > 320 ? '…' : '')) : ''),
      content: articleContent,
      imageUrl: article.imageUrl || '',
      category: article.category || 'general',
      source: article.source || '',
      url: originalUrl,
      publishedAt: article.publishedAt,
      author: article.author || '',
      tags: Array.isArray(article.tags) ? article.tags : [],
      keywords: Array.isArray(article.keywords) ? article.keywords : [],
      isPopular: !!article.isPopular,
      viewCount: articleViewCount + 1, // Include the increment
      readTime: Math.max(1, Math.ceil(articleContent.length / 1000))
    };

    // Transform related articles (defensive)
    const transformedRelated = relatedArticles.map(item => {
      const c = typeof item.content === 'string' ? item.content : '';
      return {
        id: (item as any)._id,
        title: item.title || '',
        slug: item.slug || '',
        summary: item.summary || '',
        imageUrl: item.imageUrl || '',
        category: item.category || 'general',
        source: item.source || '',
        publishedAt: item.publishedAt,
        author: item.author || '',
        viewCount: typeof item.viewCount === 'number' ? item.viewCount : 0,
        readTime: Math.max(1, Math.ceil(c.length / 1000))
      }
    });

    return NextResponse.json({
      article: transformedArticle,
      relatedArticles: transformedRelated
    });

  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch article',
      details: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Make sure MongoDB is running locally',
      code: ''
    }, { status: 500 });
  }
} 

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { default: NewsService } = await import('@/lib/mongodb');
    const { slug } = await params;
    const data = await request.json();
    // Update article (partial update)
    const updated = await NewsService.updateNews(slug, data);
    if (!updated) {
      return NextResponse.json({ error: 'Article not found or failed to update' }, { status: 404 });
    }
    return NextResponse.json({ article: updated });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: 'Failed to update article', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { default: NewsService } = await import('@/lib/mongodb');
    const { slug } = await params;
    const deleted = await NewsService.deleteNews(slug);
    if (!deleted) {
      return NextResponse.json({ error: 'Article not found or failed to delete' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Failed to delete article', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 