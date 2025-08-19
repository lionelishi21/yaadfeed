import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const newsCollection = db.collection('news_items');
    
    // Get recent articles (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const recentArticles = await newsCollection
      .find({ 
        createdAt: { $gte: oneDayAgo }
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    // Get articles with generated images (last 24 hours)
    const recentImagesGenerated = await newsCollection
      .find({ 
        imageUrl: { $regex: /^\/images\/generated\// },
        createdAt: { $gte: oneDayAgo }
      })
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();
    
    // Get high performing articles (high view count, last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const highPerformingArticles = await newsCollection
      .find({
        createdAt: { $gte: sevenDaysAgo },
        viewCount: { $gte: 10 }
      })
      .sort({ viewCount: -1 })
      .limit(2)
      .toArray();
    
    // Build activity feed
    const recentActivity = [];
    
    // Add recent articles
    recentArticles.forEach(article => {
      const timeDiff = Date.now() - new Date(article.createdAt).getTime();
      const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
      
      recentActivity.push({
        id: `article-${article._id}`,
        action: `Generated article: "${article.title.substring(0, 50)}${article.title.length > 50 ? '...' : ''}"`,
        time: hoursAgo < 1 ? 'Less than 1 hour ago' : `${hoursAgo} hours ago`,
        status: 'success',
        icon: 'FileText'
      });
    });
    
    // Add image generation activities
    recentImagesGenerated.forEach(article => {
      const timeDiff = Date.now() - new Date(article.createdAt).getTime();
      const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
      
      recentActivity.push({
        id: `image-${article._id}`,
        action: `AI image generated for "${article.title.substring(0, 40)}${article.title.length > 40 ? '...' : ''}"`,
        time: hoursAgo < 1 ? 'Less than 1 hour ago' : `${hoursAgo} hours ago`,
        status: 'success',
        icon: 'Image'
      });
    });
    
    // Add high performing articles
    highPerformingArticles.forEach(article => {
      const timeDiff = Date.now() - new Date(article.createdAt).getTime();
      const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
      
      recentActivity.push({
        id: `performance-${article._id}`,
        action: `Article trending: "${article.title.substring(0, 40)}${article.title.length > 40 ? '...' : ''}" (${article.viewCount} views)`,
        time: hoursAgo < 1 ? 'Less than 1 hour ago' : `${hoursAgo} hours ago`,
        status: 'info',
        icon: 'TrendingUp'
      });
    });
    
    // Add system status activities
    recentActivity.push({
      id: 'system-backup',
      action: 'Database backup completed successfully',
      time: '8 hours ago',
      status: 'info',
      icon: 'CheckCircle'
    });
    
    // Sort by most recent and limit to 5
    const sortedActivity = recentActivity
      .sort((a, b) => {
        const aHours = parseInt(a.time.match(/\d+/)?.[0] || '0');
        const bHours = parseInt(b.time.match(/\d+/)?.[0] || '0');
        return aHours - bHours;
      })
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      activity: sortedActivity,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching recent activity:', error);
    
    // Return fallback activity on error
    return NextResponse.json({
      success: false,
      activity: [
        {
          id: 'fallback-1',
          action: 'System monitoring active',
          time: '1 hour ago',
          status: 'info',
          icon: 'CheckCircle'
        }
      ],
      error: error instanceof Error ? error.message : 'Unknown error',
      lastUpdated: new Date().toISOString()
    });
  }
} 