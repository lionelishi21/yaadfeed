import { NextRequest, NextResponse } from 'next/server';
import { ArticleGenerator } from '@/lib/articleGenerator';
import { ImageService } from '@/lib/imageService';

export async function POST(request: NextRequest) {
  try {
    const { count = 10, mode = 'generate' } = await request.json();

    console.log(`🚀 Starting article regeneration: ${mode} mode, count: ${count}`);

    if (mode === 'update-images') {
      // Update existing articles with new local images
      await ArticleGenerator.updateExistingArticlesWithImages();
      
      // Get image stats
      const imageStats = await ImageService.getImageStats();
      
      return NextResponse.json({
        success: true,
        message: 'Successfully updated existing articles with local images',
        mode: 'update-images',
        imageStats
      });
    } else {
      // Generate new articles with local images
      const result = await ArticleGenerator.regenerateAllContent(count);
      
      // Get image stats
      const imageStats = await ImageService.getImageStats();
      
      return NextResponse.json({
        success: result.success,
        count: result.count,
        articles: result.articles.map(article => ({
          title: article.title,
          category: article.category,
          slug: article.slug,
          imageUrl: article.imageUrl,
          imageType: article.imageUrl?.startsWith('/images/generated/') ? 'local-ai' : 'fallback'
        })),
        mode: 'generate',
        imageStats
      });
    }

  } catch (error) {
    console.error('❌ Article regeneration failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return image statistics
    const imageStats = await ImageService.getImageStats();
    
    return NextResponse.json({
      success: true,
      message: 'YaadFeed Article Generation System - Local Image Storage',
      imageStats,
      info: {
        description: 'Images are generated once during article creation and saved locally',
        costSaving: 'No image generation on website visits - images served from local storage',
        directory: imageStats.directory
      }
    });
  } catch (error) {
    console.error('❌ Failed to get stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 