import { NextRequest, NextResponse } from 'next/server';
// lazy to keep bundle small

export async function GET(request: NextRequest) {
  try {
    const { connectToDatabase } = await import('@/lib/mongodb');
    const { db } = await connectToDatabase();
    const newsCollection = db.collection('news_items');
    
    // Accurate fields for admin management
    const articles = await newsCollection.find({}, {
      projection: {
        _id: 1,
        title: 1,
        slug: 1,
        source: 1,
        category: 1,
        imageUrl: 1,
        summary: 1,
        keywords: 1,
        tags: 1,
        author: 1,
        url: 1,
        publishedAt: 1,
        createdAt: 1,
        updatedAt: 1,
        needsImageGeneration: 1,
        imageStatus: 1,
        viewCount: 1,
        isPopular: 1
      }
    }).sort({ createdAt: -1 }).limit(100).toArray();

    // Transform the data for frontend
    const transformedArticles = articles.map(article => ({
      id: article._id.toString(),
      title: article.title,
      slug: article.slug,
      source: article.source,
      category: article.category,
      imageUrl: article.imageUrl,
      summary: article.summary,
      keywords: article.keywords,
      tags: article.tags || [],
      author: article.author || '',
      url: article.url || '',
      publishedAt: article.publishedAt,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      hasImage: !!article.imageUrl,
      needsImageGeneration: !!article.needsImageGeneration,
      imageStatus: article.imageStatus,
      viewCount: article.viewCount || 0,
      isPopular: !!article.isPopular
    }));

    return NextResponse.json({
      success: true,
      articles: transformedArticles,
      total: transformedArticles.length
    }, { headers: { 'Cache-Control': 'no-store' } });

  } catch (error) {
    console.error('❌ Failed to fetch articles:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 