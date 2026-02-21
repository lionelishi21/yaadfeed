import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [DEBUG] Starting MongoDB debug check...');
    
    const startTime = Date.now();
    
    const { getConnectionStatus, testConnection, connectToDatabase } = await import('@/lib/mongodb');
    // Get connection status
    const connectionStatus = getConnectionStatus();
    console.log('🔍 [DEBUG] Connection status:', connectionStatus);
    
    // Test connection
    const testResult = await testConnection();
    console.log('🔍 [DEBUG] Connection test result:', testResult);
    
    // Try to connect and get database info
    let dbInfo = null;
    let collectionInfo = null;
    
    try {
      const { db } = await connectToDatabase();
      
      // Get database stats
      dbInfo = await db.stats();
      
      // Get collection info
      const collections = await db.listCollections().toArray();
      collectionInfo = await Promise.all(
        collections.map(async (col) => {
          const count = await db.collection(col.name).countDocuments();
          return {
            name: col.name,
            count: count,
            type: col.type
          };
        })
      );
      
    } catch (dbError: any) {
      console.error('🔍 [DEBUG] Database connection error:', dbError);
      dbInfo = { error: dbError.message };
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const response = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      connection: {
        status: connectionStatus,
        test: testResult,
      },
      database: {
        info: dbInfo,
        collections: collectionInfo,
      },
      environment_variables: {
        NODE_ENV: process.env.NODE_ENV || 'not set',
        MONGODB_URI: process.env.MONGODB_URI ? 'set' : 'not set',
        MONGODB_DB: process.env.MONGODB_DB || 'not set',
        VERCEL: process.env.VERCEL ? 'yes' : 'no',
        VERCEL_ENV: process.env.VERCEL_ENV || 'not set',
      },
      performance: {
        duration_ms: duration,
        timestamp: new Date().toISOString()
      }
    };
    
    return NextResponse.json(response, {
      status: testResult.success ? 200 : 503
    });
    
  } catch (error: any) {
    console.error('🔍 [DEBUG] Debug check error:', error);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      error: error.message,
      status: 'error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, {
      status: 500
    });
  }
}
