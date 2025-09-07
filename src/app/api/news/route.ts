import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('📰 [NEWS API] Starting news fetch request...');
    
    // Check connection status first
    const { getConnectionStatus, testConnection } = await import('@/lib/mongodb');
    const connectionStatus = getConnectionStatus();
    console.log('📰 [NEWS API] Connection status:', connectionStatus);
    
    // Test connection if not connected
    if (!connectionStatus.isConnected) {
      console.log('📰 [NEWS API] Testing MongoDB connection...');
      const testResult = await testConnection();
      console.log('📰 [NEWS API] Connection test result:', testResult);
      
      if (!testResult.success) {
        return NextResponse.json({
          error: 'Database connection failed',
          details: testResult.error,
          connection_status: connectionStatus,
          test_result: testResult,
          hint: 'Check MongoDB connection and environment variables',
          timestamp: new Date().toISOString()
        }, { status: 503 });
      }
    }
    
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const category = searchParams.get('category');
    const source = searchParams.get('source');
    const limit = searchParams.get('limit');
    const search = searchParams.get('search');

    console.log('📰 [NEWS API] Query parameters:', { category, source, limit, search });

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

    console.log('📰 [NEWS API] Fetching news with filters:', filters);

    // Fetch news from MongoDB with better error handling
    const { default: NewsService } = await import('@/lib/mongodb');
    let news;
    try {
      news = await NewsService.getAllNews(filters);
      console.log(`📰 [NEWS API] Raw news data length: ${news?.length || 0}`);
      
      if (!news || news.length === 0) {
        console.log('📰 [NEWS API] No news found, checking database collection...');
        
        // Try to get collection info for debugging
        try {
          const { db } = await import('@/lib/mongodb').then(m => m.connectToDatabase());
          const collection = db.collection('news_items');
          const count = await collection.countDocuments();
          const sample = await collection.findOne({});
          
          console.log(`📰 [NEWS API] Collection info - Total documents: ${count}`);
          console.log(`📰 [NEWS API] Sample document:`, sample ? 'Found' : 'None');
          
          if (count === 0) {
            return NextResponse.json({
              news: [],
              total: 0,
              filters: filters,
              debug: {
                collection_count: count,
                collection_name: 'news_items',
                database: process.env.MONGODB_DB || 'not set',
                environment: process.env.NODE_ENV || 'development'
              },
              performance: {
                duration_ms: Date.now() - startTime,
                timestamp: new Date().toISOString()
              }
            });
          }
        } catch (dbError) {
          console.error('📰 [NEWS API] Error checking collection:', dbError);
        }
      }
    } catch (newsError) {
      console.error('📰 [NEWS API] Error in NewsService.getAllNews:', newsError);
      throw newsError;
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`📰 [NEWS API] Successfully fetched ${news.length} articles in ${duration}ms`);

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
      filters: filters,
      performance: {
        duration_ms: duration,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.error('📰 [NEWS API] Error fetching news:', {
      error: error.message,
      stack: error.stack,
      duration_ms: duration,
      timestamp: new Date().toISOString()
    });
    
    // Get connection status for debugging
    const { getConnectionStatus } = await import('@/lib/mongodb');
    const connectionStatus = getConnectionStatus();
    
    return NextResponse.json({ 
      error: 'Failed to fetch news',
      details: error.message || 'Unknown error',
      connection_status: connectionStatus,
      performance: {
        duration_ms: duration,
        timestamp: new Date().toISOString()
      },
      hint: 'Check MongoDB connection and database status',
      environment: process.env.NODE_ENV || 'development'
    }, { status: 500 });
  }
} 

export async function POST(request: NextRequest) {
  try {
    const { default: NewsService } = await import('@/lib/mongodb');
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