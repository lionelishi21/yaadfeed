import OpenAI from 'openai';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

// Only initialize OpenAI on server-side
const openai = typeof window === 'undefined' ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
}) : null;

interface ImageCache {
  [key: string]: string;
}

class ImageServiceClass {
  private cache: ImageCache = {};
  private generatingImages = new Set<string>();
  private readonly imagesDir = 'public/images/generated';
  private readonly publicPath = '/images/generated';

  // Check if we're on server-side
  private isServerSide(): boolean {
    return typeof window === 'undefined';
  }

  // Ensure the generated images directory exists
  private async ensureDirectoryExists(): Promise<void> {
    if (!this.isServerSide()) return;
    
    try {
      if (!existsSync(this.imagesDir)) {
        await mkdir(this.imagesDir, { recursive: true });
        console.log(`📁 Created directory: ${this.imagesDir}`);
      }
    } catch (error) {
      console.error('❌ Failed to create images directory:', error);
    }
  }

  // Generate a unique filename based on article content
  private generateImageFilename(title: string, category: string, keywords: string[]): string {
    const content = `${title}-${category}-${keywords.slice(0, 3).join('-')}`;
    const hash = crypto.createHash('md5').update(content).digest('hex');
    return `${category}-${hash.substring(0, 12)}.jpg`;
  }

  // Check if local image exists
  private getLocalImagePath(filename: string): string | null {
    const fullPath = path.join(process.cwd(), this.imagesDir, filename);
    return existsSync(fullPath) ? `${this.publicPath}/${filename}` : null;
  }

  // Download and save image from URL
  private async downloadAndSaveImage(imageUrl: string, filename: string): Promise<string | null> {
    if (!this.isServerSide()) return null;

    try {
      console.log(`💾 Downloading image: ${filename}`);
      
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const buffer = await response.arrayBuffer();
      const fullPath = path.join(process.cwd(), this.imagesDir, filename);
      
      await writeFile(fullPath, Buffer.from(buffer));
      console.log(`✅ Saved image: ${filename}`);
      
      return `${this.publicPath}/${filename}`;
    } catch (error) {
      console.error(`❌ Failed to download/save image ${filename}:`, error);
      return null;
    }
  }

  // Check if content is dancehall/music related
  isDancehallContent(title: string, summary: string, keywords: string[]): boolean {
    const dancehallTerms = [
      // Jamaican dancehall
      'dancehall', 'reggae', 'soca', 'bashment', 'riddim',
      'artist', 'music', 'song', 'album', 'concert', 'festival',
      
      // Jamaican artists
      'vybz kartel', 'shenseea', 'spice', 'skillibeng', 'chronic law',
      'popcaan', 'mavado', 'beenie man', 'bounty killer', 'sean paul',
      'koffee', 'protoje', 'shaggy', 'bob marley', 'damian marley',
      
      // International dancehall/Caribbean
      'machel montano', 'bunji garlin', 'fay-ann lyons', 'voice',
      'stylo g', 'kano', 'kardinal offishall', 'maestro fresh wes',
      'admiral t', 'tego calderon', 'el general', 'rihanna',
      
      // Afrobeats artists
      'burna boy', 'wizkid', 'davido', 'omah lay', 'stonebwoy', 
      'shatta wale', 'black sherif', 'master kg', 'afrobeats',
      'afro-fusion', 'afropop', 'amapiano',
      
      // Genres and terms
      'afrobeats', 'afro-fusion', 'reggaeton', 'soca', 'calypso',
      'uk-dancehall', 'trap-dancehall', 'ragga-soca', 'zouk',
      'caribbean music', 'jamaican music', 'nigerian music',
      'ghanaian music', 'trinidad music', 'barbados music'
    ];

    const content = `${title} ${summary} ${keywords.join(' ')}`.toLowerCase();
    return dancehallTerms.some(term => content.includes(term));
  }

  // Generate and save AI image using DALL-E (only during article creation)
  async generateAndSaveDALLEImage(
    title: string, 
    category: string, 
    keywords: string[], 
    summary: string
  ): Promise<string> {
    try {
      // Server-side only check
      if (!this.isServerSide()) {
        console.warn('DALL-E generation attempted on client-side, using fallback');
        return this.getFallbackImage(category, 800, 600);
      }

      if (!process.env.OPENAI_API_KEY || !openai) {
        console.log('OpenAI API key not configured, using fallback');
        return this.getFallbackImage(category, 800, 600);
      }

      // Ensure directory exists
      await this.ensureDirectoryExists();

      // Generate filename and check if image already exists locally
      const filename = this.generateImageFilename(title, category, keywords);
      const existingPath = this.getLocalImagePath(filename);
      
      if (existingPath) {
        console.log(`🔄 Using existing local image: ${filename}`);
        return existingPath;
      }

      // Prevent duplicate generation
      if (this.generatingImages.has(filename)) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const retryPath = this.getLocalImagePath(filename);
        return retryPath || this.getFallbackImage(category, 800, 600);
      }

      this.generatingImages.add(filename);

      // Create smart prompt based on content
      const prompt = this.createImagePrompt(title, category, keywords, summary);
      
      console.log(`🎨 Generating DALL-E image for: ${title.slice(0, 50)}...`);
      console.log(`📝 Prompt: ${prompt}`);

      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural"
      });

      const imageUrl = response.data?.[0]?.url;
      
      if (imageUrl) {
        // Download and save the image locally
        const localPath = await this.downloadAndSaveImage(imageUrl, filename);
        
        if (localPath) {
          console.log(`✅ Generated and saved image: ${filename}`);
          return localPath;
        } else {
          throw new Error('Failed to save image locally');
        }
      } else {
        throw new Error('No image URL returned from DALL-E');
      }

    } catch (error) {
      console.error('❌ DALL-E generation failed:', error);
      return this.getFallbackImage(category, 800, 600);
    } finally {
      const filename = this.generateImageFilename(title, category, keywords);
      this.generatingImages.delete(filename);
    }
  }

  // Create intelligent prompts for different content types
  private createImagePrompt(title: string, category: string, keywords: string[], summary: string): string {
    const isMusic = this.isDancehallContent(title, summary, keywords);
    const keywordStr = keywords.slice(0, 3).join(', ');
    
    // Base realistic requirements for all images
    const realisticBase = "realistic photography, natural lighting, professional quality, no cartoons, no illustrations, no artistic interpretations";

    if (isMusic) {
      // Music/Dancehall specific prompts
      if (title.toLowerCase().includes('concert') || title.toLowerCase().includes('festival')) {
        return `Real jamaican music festival with authentic stage setup, genuine crowd of people, actual musicians performing, vibrant colorful lighting, tropical outdoor venue, ${keywordStr}, ${realisticBase}, documentary style photography`;
      } else if (title.toLowerCase().includes('album') || title.toLowerCase().includes('song')) {
        return `Authentic jamaican recording studio interior, real music equipment and mixing board, actual musician at work, professional lighting, modern studio environment, ${keywordStr}, ${realisticBase}, music industry photography`;
      } else {
        return `Real jamaican dancehall scene, authentic caribbean music venue, actual performers and audience, natural vibrant atmosphere, genuine cultural setting, ${keywordStr}, ${realisticBase}, cultural documentation photography`;
      }
    }

    // Category-based prompts with enhanced realism
    switch (category.toLowerCase()) {
      case 'sports':
        return `Authentic jamaican sports venue, real athletes in action, actual sporting event, genuine crowd atmosphere, professional sports photography, ${keywordStr}, ${realisticBase}, sports journalism quality`;
      
      case 'politics':
        return `Real jamaican government building exterior, actual architectural structure, professional political environment, authentic caribbean architecture, formal institutional setting, ${keywordStr}, ${realisticBase}, news photography quality`;
      
      case 'business':
        return `Authentic jamaican business district, real modern office buildings, actual professionals at work, genuine commercial environment, contemporary architecture, ${keywordStr}, ${realisticBase}, corporate photography quality`;
      
      case 'entertainment':
        return `Real jamaican cultural event, authentic caribbean celebration, actual people enjoying festivities, genuine traditional atmosphere, vibrant natural colors, ${keywordStr}, ${realisticBase}, event photography quality`;
      
      case 'health':
        return `Actual jamaican healthcare facility, real medical environment, authentic hospital or clinic interior, professional healthcare setting, clean modern facilities, ${keywordStr}, ${realisticBase}, medical documentation photography`;
      
      case 'education':
        return `Real jamaican educational institution, authentic school or university campus, actual students and learning environment, genuine academic setting, tropical campus architecture, ${keywordStr}, ${realisticBase}, educational photography quality`;
      
      case 'culture':
        return `Authentic jamaican cultural scene, real traditional arts and crafts, actual cultural practitioners, genuine heritage preservation, natural cultural setting, ${keywordStr}, ${realisticBase}, cultural documentation photography`;
      
      case 'technology':
        return `Modern jamaican tech office, real computer equipment and workstations, actual tech professionals at work, contemporary digital environment, professional workspace, ${keywordStr}, ${realisticBase}, tech industry photography`;
      
      case 'general':
      default:
        return `Beautiful authentic jamaican landscape, real tropical caribbean scenery, actual jamaican location, natural environmental setting, genuine island atmosphere, ${keywordStr}, ${realisticBase}, travel photography quality`;
    }
  }

  // Get fallback image (AI-generated instead of Unsplash)
  async getFallbackImage(category: string, width: number, height: number): Promise<string> {
    try {
      // Try to generate an AI image for the fallback
      const keywords = this.getCategoryKeywords(category);
      const prompt = this.createImagePrompt(`Jamaica ${category}`, category, keywords, '');
      
      console.log(`🎨 Generating AI fallback image for ${category}...`);
      
      const imageUrl = await this.generateAndSaveDALLEImage(
        `Jamaica ${category}`,
        category,
        keywords,
        ''
      );
      
      return imageUrl;
    } catch (error) {
      console.error('❌ AI fallback generation failed, using local placeholder:', error);
      // Use a local placeholder image instead of external service
      return `/images/placeholder-${category}.jpg`;
    }
  }

  // Helper method to get category keywords
  private getCategoryKeywords(category: string): string[] {
    const categoryMap: { [key: string]: string[] } = {
      'sports': ['sports', 'jamaica', 'athletic', 'competition'],
      'politics': ['government', 'building', 'professional', 'jamaica'],
      'business': ['business', 'office', 'success', 'jamaica'],
      'entertainment': ['party', 'celebration', 'fun', 'jamaica'],
      'health': ['health', 'medical', 'wellness', 'jamaica'],
      'education': ['education', 'school', 'learning', 'jamaica'],
      'culture': ['culture', 'art', 'heritage', 'jamaica'],
      'music': ['music', 'reggae', 'jamaica', 'dancehall'],
      'dancehall': ['dancehall', 'music', 'jamaica', 'reggae'],
      'general': ['jamaica', 'tropical', 'caribbean', 'island']
    };

    return categoryMap[category.toLowerCase()] || categoryMap['general'];
  }

  // Main method to get image for article (now prioritizes AI generation)
  async getImageForArticle(
    title: string, 
    category: string, 
    keywords: string[] = [], 
    summary: string = '',
    index: number = 0,
    forceGenerate: boolean = false
  ): Promise<string> {
    try {
      // Check for existing local image first
      const filename = this.generateImageFilename(title, category, keywords);
      const existingPath = this.getLocalImagePath(filename);
      
      if (existingPath && !forceGenerate) {
        console.log(`🖼️ Using existing local image: ${filename}`);
        return existingPath;
      }

      // Always try to generate AI image if on server-side
      if (this.isServerSide()) {
        console.log(`🎨 Generating AI image for: ${title?.substring(0, 50)}...`);
        return await this.generateAndSaveDALLEImage(title, category, keywords, summary);
      } else {
        // For client-side, use AI fallback instead of Unsplash
        return await this.getFallbackImage(category, 800, 600);
      }
    } catch (error) {
      console.error('Error getting image for article:', error);
      return await this.getFallbackImage(category, 800, 600);
    }
  }

  // Batch generate and save images for articles (only during article creation)
  async generateAndSaveImagesForArticles(articles: any[]): Promise<void> {
    if (!this.isServerSide()) {
      console.warn('Batch image generation attempted on client-side, skipping');
      return;
    }

    console.log(`🎨 Starting batch image generation and saving for ${articles.length} articles...`);
    
    await this.ensureDirectoryExists();
    
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      try {
        console.log(`📸 Processing article ${i + 1}/${articles.length}: ${article.title?.slice(0, 50)}...`);
        
        const imageUrl = await this.getImageForArticle(
          article.title || '',
          article.category || 'general',
          article.keywords || [],
          article.summary || '',
          i,
          true // Force generate for article creation
        );
        
        // Store the local image path in the article
        article.imageUrl = imageUrl;
        
        // Delay to respect API limits
        if (i < 5 || this.isDancehallContent(article.title || '', article.summary || '', article.keywords || [])) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (error) {
        console.error(`❌ Failed to generate image for article: ${article.title}`, error);
        article.imageUrl = await this.getFallbackImage(article.category || 'general', 800, 600);
      }
    }
    
    console.log('✅ Batch image generation and saving completed!');
  }

  // Get existing local image or fallback (for website display)
  async getDisplayImage(title: string, category: string, keywords: string[] = []): Promise<string> {
    // For client-side and website display, only use existing local images
    if (this.isServerSide()) {
      const filename = this.generateImageFilename(title, category, keywords);
      const localPath = this.getLocalImagePath(filename);
      if (localPath) {
        return localPath;
      }
    }
    
    // Use fallback if no local image exists
    return await this.getFallbackImage(category, 800, 600);
  }

  // Clear cache
  clearCache(): void {
    this.cache = {};
    console.log('🗑️ Image cache cleared');
  }

  // Get stats about local images
  async getImageStats(): Promise<{ totalImages: number; directory: string }> {
    if (!this.isServerSide()) return { totalImages: 0, directory: '' };
    
    try {
      const fs = await import('fs/promises');
      const fullPath = path.join(process.cwd(), this.imagesDir);
      
      if (existsSync(fullPath)) {
        const files = await fs.readdir(fullPath);
        return {
          totalImages: files.filter(f => f.endsWith('.jpg') || f.endsWith('.png')).length,
          directory: this.imagesDir
        };
      }
    } catch (error) {
      console.error('Error getting image stats:', error);
    }
    
    return { totalImages: 0, directory: this.imagesDir };
  }
}

export const ImageService = new ImageServiceClass(); 