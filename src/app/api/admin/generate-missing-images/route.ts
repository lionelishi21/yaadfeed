import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ImageService } from '@/lib/imageService';

async function extractOgImage(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    if (!res.ok) return '';
    const html = await res.text();
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["'][^>]*>/i);
    return ogMatch ? ogMatch[1] : '';
  } catch {
    return '';
  }
}

export async function GET() {
  try {
    // Get articles that need image generation
    const { db } = await connectToDatabase();
    const newsCollection = db.collection('news_items');
    
    const articlesNeedingImages = await newsCollection.find({
      $or: [
        { needsImageGeneration: true },
        { imageStatus: 'pending_admin_generation' },
        { imageUrl: { $exists: false } },
        { imageUrl: null },
        { imageUrl: "" },
        { imageUrl: { $regex: /^https:\/\/via\.placeholder\.com/ } } // Look for placeholder images instead of Unsplash
      ]
    }).limit(50).toArray();

    // Group by category for admin overview
    const categoryBreakdown: { [key: string]: number } = {};
    articlesNeedingImages.forEach(article => {
      const category = article.category || 'unknown';
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
    });

    // Get image stats
    const imageStats = await ImageService.getImageStats();

    return NextResponse.json({
      success: true,
      articlesNeedingImages: articlesNeedingImages.length,
      categoryBreakdown,
      imageStats,
      articles: articlesNeedingImages.map(article => ({
        id: article._id,
        title: article.title,
        category: article.category,
        summary: article.summary,
        keywords: article.keywords,
        imageUrl: article.imageUrl,
        needsImageGeneration: article.needsImageGeneration,
        imageStatus: article.imageStatus
      })),
      estimatedCost: (articlesNeedingImages.length * 0.04).toFixed(2)
    });

  } catch (error) {
    console.error('❌ Failed to get articles needing images:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Safely parse JSON; handle empty body gracefully
    let articleId: string | undefined = undefined;
    let generateAll: boolean = false;
    try {
      const raw = await request.text();
      if (raw && raw.trim().length > 0) {
        const parsed = JSON.parse(raw);
        articleId = parsed?.articleId;
        generateAll = Boolean(parsed?.generateAll);
      }
    } catch {
      // Ignore parse errors; treat as empty body
    }

    const { db } = await connectToDatabase();
    const newsCollection = db.collection('news_items');

    if (generateAll) {
      // Generate images for all articles needing them
      console.log('🎨 Starting bulk image generation for articles without images...');
      
      const articlesNeedingImages = await newsCollection.find({
        $or: [
          { needsImageGeneration: true },
          { imageStatus: 'pending_admin_generation' },
          { imageUrl: { $exists: false } },
          { imageUrl: null },
          { imageUrl: "" },
          { imageUrl: { $regex: /^https:\/\/via\.placeholder\.com/ } } // Look for placeholder images instead of Unsplash
        ]
      }).limit(20).toArray(); // Limit to 20 to avoid timeout

      const results = [];
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < articlesNeedingImages.length; i++) {
        const article = articlesNeedingImages[i];
        
        try {
          console.log(`🎨 Generating image ${i + 1}/${articlesNeedingImages.length} for: ${article.title?.substring(0, 50)}...`);
          
          // Mark as in progress
          await newsCollection.updateOne(
            { _id: article._id },
            { 
              $set: { 
                imageStatus: 'generating',
                imageGenerationStarted: new Date()
              }
            }
          );

          // Prefer real OG image first, else AI
          let imageUrl = await extractOgImage(article.url || '');
          if (!imageUrl) {
            imageUrl = await ImageService.getImageForArticle(
              article.title || '',
              article.category || 'general',
              article.keywords || [],
              article.summary || '',
              i,
              true
            );
          }

          // Update article with generated image
          await newsCollection.updateOne(
            { _id: article._id },
            { 
              $set: { 
                imageUrl,
                needsImageGeneration: false,
                imageStatus: imageUrl.startsWith('/images/generated/') ? 'generated' : 'fallback',
                imageGenerationCompleted: new Date(),
                updatedAt: new Date()
              }
            }
          );

          results.push({
            id: article._id,
            title: article.title?.substring(0, 50),
            imageUrl,
            status: 'success',
            type: imageUrl.startsWith('/images/generated/') ? 'ai-generated' : 'fallback'
          });

          successCount++;
          console.log(`✅ Generated image for: ${article.title?.substring(0, 50)}`);

          // Delay to respect API limits
          await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
          console.error(`❌ Failed to generate image for article: ${article.title}`, error);
          
          // Mark as failed
          await newsCollection.updateOne(
            { _id: article._id },
            { 
              $set: { 
                imageStatus: 'failed',
                imageGenerationError: error instanceof Error ? error.message : 'Unknown error',
                imageGenerationCompleted: new Date()
              }
            }
          );

          results.push({
            id: article._id,
            title: article.title?.substring(0, 50),
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          });

          failCount++;
        }
      }

      return NextResponse.json({
        success: true,
        message: `Bulk image generation completed. ${successCount} successful, ${failCount} failed.`,
        results,
        summary: {
          total: articlesNeedingImages.length,
          successful: successCount,
          failed: failCount
        }
      });

    } else if (articleId) {
      // Generate image for specific article
      const article = await newsCollection.findOne({ _id: articleId });
      
      if (!article) {
        return NextResponse.json(
          { success: false, error: 'Article not found' },
          { status: 404 }
        );
      }

      console.log(`🎨 Generating image for article: ${article.title?.substring(0, 50)}...`);

      // Mark as in progress
      await newsCollection.updateOne(
        { _id: articleId },
        { 
          $set: { 
            imageStatus: 'generating',
            imageGenerationStarted: new Date()
          }
        }
      );

      // Generate image
      const imageUrl = await ImageService.getImageForArticle(
        article.title || '',
        article.category || 'general',
        article.keywords || [],
        article.summary || '',
        0,
        true // Force generate
      );

      // Update article with generated image
      await newsCollection.updateOne(
        { _id: articleId },
        { 
          $set: { 
            imageUrl,
            needsImageGeneration: false,
            imageStatus: imageUrl.startsWith('/images/generated/') ? 'generated' : 'fallback',
            imageGenerationCompleted: new Date(),
            updatedAt: new Date()
          }
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Image generated successfully',
        article: {
          id: articleId,
          title: article.title,
          imageUrl,
          type: imageUrl.startsWith('/images/generated/') ? 'ai-generated' : 'fallback'
        }
      });

    } else {
      return NextResponse.json(
        { success: false, error: 'Either articleId or generateAll must be specified' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('❌ Admin image generation failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 