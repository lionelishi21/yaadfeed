import { NextRequest, NextResponse } from 'next/server';

// Generate static params for static export
export async function generateStaticParams() {
  return [
    { slug: 'bob-marleys-legacy-continues-to-inspire-new-generation-of-jamaican-artists' },
    { slug: 'jamaicas-tourism-industry-shows-strong-recovery-post-pandemic' },
    { slug: 'reggae-sumfest-2025-lineup-announced-featuring-international-and-local-stars' }
  ];
}
import NewsService from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

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

    // Transform article data
    const transformedArticle = {
      id: article._id,
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      content: article.content,
      imageUrl: article.imageUrl,
      category: article.category,
      source: article.source,
      publishedAt: article.publishedAt,
      author: article.author,
      tags: article.tags,
      keywords: article.keywords,
      isPopular: article.isPopular,
      viewCount: article.viewCount + 1, // Include the increment
      readTime: Math.ceil(article.content.length / 1000)
    };

    // Transform related articles
    const transformedRelated = relatedArticles.map(item => ({
      id: item._id,
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      imageUrl: item.imageUrl,
      category: item.category,
      source: item.source,
      publishedAt: item.publishedAt,
      author: item.author,
      viewCount: item.viewCount,
      readTime: Math.ceil(item.content.length / 1000)
    }));

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

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
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

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
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