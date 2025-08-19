import { NextRequest, NextResponse } from 'next/server';
import { NewsService } from '@/lib/mongodb';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    // Get real database statistics
    const dbStats = await NewsService.getDatabaseStats();
    
    // Get recent articles count (last 30 days)
    const { db } = await connectToDatabase();
    const newsCollection = db.collection('news_items');
    const usersCollection = db.collection('users');
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentArticles = await newsCollection.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get total users count
    const totalUsers = await usersCollection.countDocuments();
    
    // Get total view count across all articles
    const viewCountResult = await newsCollection.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$viewCount" } } }
    ]).toArray();
    
    const totalViews = viewCountResult.length > 0 ? viewCountResult[0].totalViews : 0;
    
    // Get articles with images count
    const articlesWithImages = await newsCollection.countDocuments({
      imageUrl: { $exists: true, $ne: "", $type: "string" }
    });
    
    // Calculate conversion rate (simplified - views to engagement)
    const conversionRate = dbStats.totalArticles > 0 ? 
      parseFloat(((totalViews / dbStats.totalArticles) / 100).toFixed(2)) : 0;
    
    // Simulated revenue data (replace with actual revenue tracking)
    const adRevenue = parseFloat((totalViews * 0.001).toFixed(2)); // $0.001 per view estimate
    
    const dashboardStats = {
      totalArticles: dbStats.totalArticles,
      totalUsers: totalUsers,
      totalRevenue: adRevenue * 3.2, // Total revenue including other sources
      totalImages: articlesWithImages,
      monthlyViews: totalViews,
      conversionRate: conversionRate,
      adRevenue: adRevenue,
      articlesGenerated: recentArticles,
      categories: dbStats.categories,
      sources: dbStats.sources,
      withImages: dbStats.withImages,
      withoutImages: dbStats.withoutImages
    };

    return NextResponse.json({
      success: true,
      stats: dashboardStats,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    
    // Return fallback stats on error
    return NextResponse.json({
      success: false,
      stats: {
        totalArticles: 0,
        totalUsers: 0,
        totalRevenue: 0,
        totalImages: 0,
        monthlyViews: 0,
        conversionRate: 0,
        adRevenue: 0,
        articlesGenerated: 0,
        categories: {},
        sources: {},
        withImages: 0,
        withoutImages: 0
      },
      error: error instanceof Error ? error.message : 'Unknown error',
      lastUpdated: new Date().toISOString()
    });
  }
} 