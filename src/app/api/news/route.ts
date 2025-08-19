import { NextRequest, NextResponse } from 'next/server';
import NewsService from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const category = searchParams.get('category');
    const source = searchParams.get('source');
    const limit = searchParams.get('limit');
    const search = searchParams.get('search');

    // Build filters object
    const filters: any = {};
    
    if (category && category !== 'all') {
      filters.category = category;
    }
    
    if (source) {
      filters.source = source;
    }
    
    if (limit) {
      filters.limit = parseInt(limit);
    }
    
    if (search) {
      filters.search = search;
    }

    // Fetch news from MongoDB
    const news = await NewsService.getAllNews(filters);

    return NextResponse.json({
      news: news.map(item => ({
        id: item._id,
        title: item.title,
        slug: item.slug,
        summary: item.summary,
        content: item.content,
        imageUrl: item.imageUrl,
        category: item.category,
        source: item.source,
        publishedAt: item.publishedAt,
        author: item.author,
        tags: item.tags,
        keywords: item.keywords,
        isPopular: item.isPopular,
        viewCount: item.viewCount,
        readTime: Math.ceil(item.content.length / 1000) // Approximate reading time
      })),
      total: news.length,
      filters: filters
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch news',
      details: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Make sure MongoDB is running locally',
      code: ''
    }, { status: 500 });
  }
} 

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // Validate required fields
    const required = ['title', 'slug', 'summary', 'content', 'category', 'source', 'publishedAt'];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    // Create article
    const created = await NewsService.createNews({
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: data.content,
      imageUrl: data.imageUrl || '',
      category: data.category,
      source: data.source,
      url: data.url || '',
      publishedAt: new Date(data.publishedAt),
      author: data.author || '',
      tags: data.tags || [],
      keywords: data.keywords || [],
      isPopular: !!data.isPopular,
      viewCount: data.viewCount || 0
    });
    if (!created) {
      return NextResponse.json({ error: 'Article already exists or failed to create' }, { status: 409 });
    }
    return NextResponse.json({ article: created });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ error: 'Failed to create article', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 