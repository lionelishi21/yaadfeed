import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const newsCollection = db.collection('news_items');
    
    // Get all articles with basic info
    const articles = await newsCollection.find({}, {
      projection: {
        _id: 1,
        title: 1,
        category: 1,
        imageUrl: 1,
        summary: 1,
        keywords: 1,
        createdAt: 1,
        updatedAt: 1,
        needsImageGeneration: 1,
        imageStatus: 1
      }
    }).sort({ createdAt: -1 }).limit(100).toArray();

    // Transform the data for frontend
    const transformedArticles = articles.map(article => ({
      id: article._id.toString(),
      title: article.title,
      category: article.category,
      imageUrl: article.imageUrl,
      summary: article.summary,
      keywords: article.keywords,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      hasImage: !!article.imageUrl,
      needsImageGeneration: !!article.needsImageGeneration,
      imageStatus: article.imageStatus
    }));

    return NextResponse.json({
      success: true,
      articles: transformedArticles,
      total: transformedArticles.length
    });

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