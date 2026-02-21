import { NextRequest, NextResponse } from 'next/server';
import { getConnectionStatus, testConnection, connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const status = getConnectionStatus();
    
    // Test the connection
    const testResult = await testConnection();
    
    // Try to get some basic stats if connected
    let dbStats = null;
    let collectionCounts: Record<string, number> | null = null;
    
    if (testResult.success) {
      try {
        const { db } = await connectToDatabase();
        
        // Get database stats
        dbStats = await db.stats();
        
        // Get collection counts
        const collections = await db.listCollections().toArray();
        collectionCounts = {} as Record<string, number>;
        
        for (const collection of collections) {
          const count = await db.collection(collection.name).countDocuments();
          collectionCounts[collection.name] = count;
        }
      } catch (error: any) {
        console.error('Error getting database stats:', error.message);
      }
    }
    
    const response = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      connection: {
        status,
        test: testResult,
      },
      database: {
        stats: dbStats,
        collections: collectionCounts,
      },
      environment_variables: {
        NODE_ENV: process.env.NODE_ENV || 'not set',
        MONGODB_URI: process.env.MONGODB_URI ? 'set' : 'not set',
        MONGODB_DB: process.env.MONGODB_DB || 'not set',
      }
    };
    
    return NextResponse.json(response, {
      status: testResult.success ? 200 : 503
    });
    
  } catch (error: any) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      error: error.message,
      status: 'error'
    }, {
      status: 500
    });
  }
}
