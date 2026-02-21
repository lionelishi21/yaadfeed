import { NextRequest, NextResponse } from 'next/server';
import { ImageService } from '@/lib/imageService';

export async function POST(request: NextRequest) {
  try {
    const { title, category, keywords, summary = '', forceGenerate = false } = await request.json();

    if (!title || !category) {
      return NextResponse.json(
        { error: 'Title and category are required' },
        { status: 400 }
      );
    }

    console.log(`🖼️ API: Processing image request for: ${title.substring(0, 50)}...`);

    let imageUrl: string;
    let type: string;

    if (forceGenerate) {
      // Force generate new AI image
      console.log(`🎨 Generating new AI image for: ${title.substring(0, 50)}...`);
      imageUrl = await ImageService.generateAndSaveDALLEImage(
        title,
        category,
        keywords || [],
        summary
      );
      type = imageUrl.startsWith('/images/generated/') ? 'ai-generated' : 'fallback';
    } else {
      // Check for existing image first, then generate if needed
      const existingImage = await ImageService.getDisplayImage(title, category, keywords || []);
      
      if (existingImage.startsWith('/images/generated/')) {
        // Use existing local image
        imageUrl = existingImage;
        type = 'existing-local';
      } else {
        // Generate new AI image
        console.log(`🎨 No local image found, generating new AI image for: ${title.substring(0, 50)}...`);
        imageUrl = await ImageService.generateAndSaveDALLEImage(
          title,
          category,
          keywords || [],
          summary
        );
        type = imageUrl.startsWith('/images/generated/') ? 'ai-generated' : 'fallback';
      }
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      title: title.substring(0, 50),
      type,
      generated: type === 'ai-generated'
    });

  } catch (error) {
    console.error('❌ Image generation API failed:', error);
    
    // Return fallback image on error
    const fallbackUrl = await ImageService.getFallbackImage(
      'general',
      800,
      600
    );

    return NextResponse.json({
      success: false,
      imageUrl: fallbackUrl,
      error: error instanceof Error ? error.message : 'Unknown error',
      type: 'fallback'
    });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'general';
  const width = parseInt(searchParams.get('width') || '800');
  const height = parseInt(searchParams.get('height') || '600');

  // Return fallback image for GET requests
  const fallbackUrl = await ImageService.getFallbackImage(category, width, height);
  
  return NextResponse.json({
    success: true,
    imageUrl: fallbackUrl,
    type: 'fallback'
  });
} 