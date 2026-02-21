// Using stub to reduce bundle size
import OpenAI from '@/lib/stubs/openai';
import { ImageService } from './imageService';
import { connectToDatabase, NewsService } from './mongodb';

// Only initialize OpenAI on server-side
const openai = typeof window === 'undefined' ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
}) : null;

interface GeneratedArticle {
  title: string;
  content: string;
  summary: string;
  category: string;
  keywords: string[];
  author: string;
  slug: string;
  readTime: number;
  imageUrl?: string;
  publishedAt: Date;
  isPopular: boolean;
}

class ArticleGeneratorClass {
  private categories = [
    'politics', 'business', 'sports', 'entertainment', 'health', 
    'education', 'culture', 'music', 'dancehall', 'technology'
  ];

  // Check if we're on server-side
  private isServerSide(): boolean {
    return typeof window === 'undefined';
  }

  private jamaican_topics = [
    // Music & Culture - Jamaican
    'Reggae Revival movement gaining international attention',
    'New dancehall riddim taking over the airwaves',
    'Jamaican artist collaborates with international superstar',
    'Bob Marley Museum unveils new exhibition',
    'Jamaica Music Conference announces lineup',
    'Dancehall Queen competition returns to Kingston',
    'Jamaican sound system culture documentary wins award',
    'Reggae artist wins Grammy nomination',
    'Vybz Kartel releases new album from prison',
    'Skillibeng and Popcaan announce joint tour',
    'Shenseea signs major record deal',
    'Koffee headlines international reggae festival',
    
    // International Dancehall & Caribbean
    'UK dancehall scene explodes with new talent',
    'Canadian Caribbean artists dominate charts',
    'French Caribbean dancehall artist tours Europe',
    'Trinidadian soca meets Jamaican dancehall collaboration',
    'Machel Montano and Sean Paul announce Caribbean unity concert',
    'Bunji Garlin brings soca energy to dancehall festival',
    'Stylo G represents UK at Jamaica Music Conference',
    'Admiral T brings French Caribbean flavor to reggae scene',
    
    // Afrobeats & African Music
    'Burna Boy announces Jamaica collaboration album',
    'Wizkid and Popcaan team up for Caribbean-African fusion',
    'Davido visits Jamaica to explore reggae roots',
    'Ghanaian dancehall artist Stonebwoy tours Caribbean',
    'Shatta Wale collaborates with Jamaican producers',
    'Afrobeats influence grows in Caribbean music scene',
    'Black Sherif brings drill influences to dancehall',
    'Nigerian artists embrace reggae and dancehall sounds',
    'South African amapiano meets Jamaican riddims',
    'Master KG Jerusalema gets dancehall remix treatment',
    
    // Cross-Cultural Music
    'Reggaeton artists seek Jamaican dancehall collaboration',
    'Major Lazer announces Caribbean music documentary',
    'Tego Calderon celebrates reggaeton-dancehall fusion',
    'Latin American artists study in Jamaica music schools',
    'Rihanna returns to Caribbean roots with new album',
    'International artists flock to Jamaica for riddim sessions',
    
    // Sports
    'Jamaican sprinter breaks world record at Diamond League',
    'West Indies cricket team prepares for upcoming series',
    'Jamaica football team advances in World Cup qualifiers',
    'Young Jamaican boxer wins international championship',
    'Jamaica dominates at Pan American Games',
    'New athletics training facility opens in Kingston',
    'Jamaican swimmer qualifies for Olympics',
    'Caribbean Games showcase regional athletic talent',
    
    // Business & Economy
    'Jamaica Stock Exchange reaches all-time high',
    'New tech startup raises millions in funding',
    'Tourism numbers exceed pre-pandemic levels',
    'Jamaican coffee exports increase by 25%',
    'Digital payment adoption grows across the island',
    'Green energy project launches in rural communities',
    'Jamaican diaspora investment reaches record levels',
    'Caribbean economic partnership strengthens trade',
    'Music industry contributes billions to Jamaica economy',
    
    // Politics & Society
    'Education reform bill passes in Parliament',
    'New healthcare initiatives launched nationwide',
    'Jamaica leads Caribbean climate change discussions',
    'Crime reduction strategies show positive results',
    'Digital transformation accelerates in government services',
    'Youth empowerment programs expand island-wide',
    'Infrastructure development projects commence',
    'Caribbean integration talks progress in Kingston',
    
    // Culture & Entertainment
    'Carnival celebrations break attendance records',
    'New Jamaican film premieres at international festival',
    'Traditional craft revival movement grows',
    'Cultural festival celebrates Jamaican heritage',
    'Local theater production gains international recognition',
    'Jamaican cuisine festival attracts food tourists',
    'Art gallery showcases emerging Jamaican artists',
    'Caribbean cultural exchange program launches',
    'Jamaican fashion week features international designers',
    
    // Technology & Innovation
    'Kingston tech hub attracts international startups',
    'Jamaican developers create breakthrough app',
    'Caribbean fintech revolution spreads across region',
    'Music streaming platform focuses on Caribbean content',
    'Blockchain technology adopted by local businesses',
    'Digital healthcare solutions expand to rural areas',
    'Educational technology transforms Jamaican classrooms'
  ];

  // Generate article content using ChatGPT
  async generateArticleContent(topic: string, category: string): Promise<Partial<GeneratedArticle>> {
    try {
      // Server-side only check
      if (!this.isServerSide()) {
        console.warn('Article generation attempted on client-side, using fallback');
        return this.createFallbackArticle(topic, category);
      }

      if (!process.env.OPENAI_API_KEY || !openai) {
        throw new Error('OpenAI API key not configured or client not available');
      }

      const prompt = this.createArticlePrompt(topic, category);
      
      console.log(`🤖 Generating article content for: ${topic}`);

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional Jamaican journalist writing for YaadFeed, Jamaica's premier news platform. Write engaging, authentic articles that capture Jamaican culture, language, and perspective. Use proper journalism standards but with a distinctly Jamaican voice."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content generated');
      }

      // Parse the structured response
      const article = this.parseGeneratedContent(content, topic, category);
      
      console.log(`✅ Generated article: ${article.title}`);
      return article;

    } catch (error) {
      console.error('❌ Failed to generate article content:', error);
      // Return a fallback article
      return this.createFallbackArticle(topic, category);
    }
  }

  // Create intelligent prompts for article generation
  private createArticlePrompt(topic: string, category: string): string {
    return `
Generate a complete Jamaican news article about: "${topic}"

Category: ${category}

Please structure your response EXACTLY as follows:

TITLE: [Write an engaging headline]

SUMMARY: [Write a 2-3 sentence summary]

KEYWORDS: [List 5-7 relevant keywords separated by commas]

CONTENT: [Write the full article content (400-600 words). Include:
- Strong lead paragraph
- Multiple body paragraphs with facts and quotes
- Jamaican context and perspective
- Engaging conclusion
- Use some Jamaican expressions naturally]

AUTHOR: [Choose a realistic Jamaican journalist name]

Requirements:
- Use professional journalism style
- Include realistic quotes from officials or experts
- Reference real Jamaican locations and institutions
- Maintain authenticity to Jamaican culture
- Write in present/recent past tense
- Include specific details and numbers where appropriate
    `;
  }

  // Parse the structured response from ChatGPT
  private parseGeneratedContent(content: string, topic: string, category: string): Partial<GeneratedArticle> {
    const lines = content.split('\n');
    const result: Partial<GeneratedArticle> = {
      category,
      publishedAt: new Date(),
      isPopular: Math.random() > 0.7, // 30% chance of being popular
    };

    let currentSection = '';
    let contentLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('TITLE:')) {
        result.title = trimmed.replace('TITLE:', '').trim();
        result.slug = this.generateSlug(result.title);
      } else if (trimmed.startsWith('SUMMARY:')) {
        result.summary = trimmed.replace('SUMMARY:', '').trim();
      } else if (trimmed.startsWith('KEYWORDS:')) {
        const keywordsStr = trimmed.replace('KEYWORDS:', '').trim();
        result.keywords = keywordsStr.split(',').map(k => k.trim()).filter(k => k.length > 0);
      } else if (trimmed.startsWith('CONTENT:')) {
        currentSection = 'content';
        const contentStart = trimmed.replace('CONTENT:', '').trim();
        if (contentStart) contentLines.push(contentStart);
      } else if (trimmed.startsWith('AUTHOR:')) {
        result.author = trimmed.replace('AUTHOR:', '').trim();
      } else if (currentSection === 'content' && trimmed) {
        contentLines.push(trimmed);
      }
    }

    // Join content and calculate read time
    result.content = contentLines.join('\n\n');
    result.readTime = Math.ceil(result.content.split(' ').length / 250); // 250 WPM reading speed

    // Fallbacks
    if (!result.title) result.title = topic;
    if (!result.slug) result.slug = this.generateSlug(topic);
    if (!result.summary) result.summary = `Latest developments in ${category} from Jamaica.`;
    if (!result.keywords) result.keywords = [category, 'jamaica', 'news'];
    if (!result.author) result.author = 'YaadFeed Editorial Team';
    if (!result.content) result.content = this.createFallbackContent(topic, category);

    return result;
  }

  // Generate URL-friendly slug
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 60);
  }

  // Create fallback article if ChatGPT fails
  private createFallbackArticle(topic: string, category: string): Partial<GeneratedArticle> {
    return {
      title: topic,
      slug: this.generateSlug(topic),
      summary: `Latest developments in ${category} from Jamaica's dynamic landscape.`,
      content: this.createFallbackContent(topic, category),
      category,
      keywords: [category, 'jamaica', 'news', 'caribbean'],
      author: 'YaadFeed Editorial Team',
      readTime: 3,
      publishedAt: new Date(),
      isPopular: Math.random() > 0.7,
    };
  }

  // Create fallback content
  private createFallbackContent(topic: string, category: string): string {
    return `
Jamaica continues to make headlines in the ${category} sector with ${topic}.

This developing story represents the ongoing evolution of Jamaica's ${category} landscape, showcasing the island's dynamic spirit and forward-thinking approach.

Local experts and community leaders are closely monitoring these developments, which are expected to have significant impact on the broader Caribbean region.

"This is an exciting time for Jamaica," said a local official. "We're seeing tremendous growth and innovation across all sectors."

The initiative aligns with Jamaica's broader goals of sustainable development and community empowerment, reflecting the nation's commitment to progress while honoring its rich cultural heritage.

Further updates on this story will be provided as more information becomes available.

Stay tuned to YaadFeed for the latest news and developments from Jamaica and the Caribbean diaspora.
    `.trim();
  }

  // Generate multiple articles
  async generateMultipleArticles(count: number = 10): Promise<GeneratedArticle[]> {
    // Server-side only check
    if (!this.isServerSide()) {
      console.warn('Multiple article generation attempted on client-side, returning empty array');
      return [];
    }

    console.log(`🚀 Starting generation of ${count} articles...`);
    const articles: GeneratedArticle[] = [];

    for (let i = 0; i < count; i++) {
      try {
        // Select random topic and category
        const topic = this.jamaican_topics[Math.floor(Math.random() * this.jamaican_topics.length)];
        const category = this.categories[Math.floor(Math.random() * this.categories.length)];

        console.log(`📝 Generating article ${i + 1}/${count}: ${topic.substring(0, 50)}...`);

        // Generate content
        const articleData = await this.generateArticleContent(topic, category);
        
        // Generate image
        console.log(`🎨 Generating image for article ${i + 1}...`);
        const imageUrl = await ImageService.getImageForArticle(
          articleData.title || topic,
          articleData.category || category,
          articleData.keywords || [],
          articleData.summary || '',
          i,
          true // Force generate and save during article creation
        );

        const completeArticle: GeneratedArticle = {
          title: articleData.title || topic,
          content: articleData.content || '',
          summary: articleData.summary || '',
          category: articleData.category || category,
          keywords: articleData.keywords || [],
          author: articleData.author || 'YaadFeed Editorial Team',
          slug: articleData.slug || this.generateSlug(topic),
          readTime: articleData.readTime || 3,
          imageUrl,
          publishedAt: articleData.publishedAt || new Date(),
          isPopular: articleData.isPopular || false,
        };

        articles.push(completeArticle);

        // Small delay to respect API limits
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`❌ Failed to generate article ${i + 1}:`, error);
      }
    }

    console.log(`✅ Generated ${articles.length} articles successfully!`);
    return articles;
  }

  // Save articles to database
  async saveArticlesToDatabase(articles: GeneratedArticle[]): Promise<void> {
    // Server-side only check
    if (!this.isServerSide()) {
      console.warn('Database save attempted on client-side, skipping');
      return;
    }

    try {
      console.log(`💾 Saving ${articles.length} articles to database...`);
      
      for (const article of articles) {
        await NewsService.createNews({
          ...article,
          url: `https://yaadfeed.com/news/${article.slug}`,
          source: 'YaadFeed Generated Content',
          tags: article.keywords,
          isPopular: article.isPopular,
          viewCount: 0,
        });
      }

      console.log(`✅ Successfully saved ${articles.length} articles to database!`);
    } catch (error) {
      console.error('❌ Failed to save articles to database:', error);
      throw error;
    }
  }

  // Main method to regenerate all content
  async regenerateAllContent(count: number = 10): Promise<{ success: boolean; count: number; articles: GeneratedArticle[] }> {
    // Server-side only check
    if (!this.isServerSide()) {
      console.warn('Content regeneration attempted on client-side');
      return {
        success: false,
        count: 0,
        articles: []
      };
    }

    try {
      console.log('🔄 Starting complete content regeneration...');
      
      // Generate new articles
      const articles = await this.generateMultipleArticles(count);
      
      // Save to database
      await this.saveArticlesToDatabase(articles);
      
      console.log('🎉 Content regeneration completed successfully!');
      
      return {
        success: true,
        count: articles.length,
        articles
      };
    } catch (error) {
      console.error('❌ Content regeneration failed:', error);
      return {
        success: false,
        count: 0,
        articles: []
      };
    }
  }

  // Update existing articles with new images
  async updateExistingArticlesWithImages(): Promise<void> {
    // Server-side only check
    if (!this.isServerSide()) {
      console.warn('Image update attempted on client-side, skipping');
      return;
    }

    try {
      console.log('🖼️ Updating existing articles with new images...');
      
      const { db } = await connectToDatabase();
      const articlesCollection = db.collection('articles');
      
      // Get articles without images or with old images
      const articlesNeedingImages = await articlesCollection.find({
        $or: [
          { imageUrl: { $exists: false } },
          { imageUrl: null },
          { imageUrl: { $regex: /via\.placeholder\.com/ } }, // Update placeholder images with AI ones
          { imageUrl: { $regex: /^https:\/\/.*/ } } // Update external URLs with local ones
        ]
      }).limit(20).toArray();

      console.log(`📸 Found ${articlesNeedingImages.length} articles needing image updates`);

      for (let i = 0; i < articlesNeedingImages.length; i++) {
        const article = articlesNeedingImages[i];
        
        try {
          console.log(`🎨 Generating and saving image ${i + 1}/${articlesNeedingImages.length} for: ${article.title?.substring(0, 50)}...`);
          
          const imageUrl = await ImageService.getImageForArticle(
            article.title || '',
            article.category || 'general',
            article.keywords || [],
            article.summary || '',
            i,
            true // Force generate and save new image
          );

          // Update the article with new local image path
          await articlesCollection.updateOne(
            { _id: article._id },
            { 
              $set: { 
                imageUrl,
                updatedAt: new Date()
              }
            }
          );

          console.log(`✅ Updated image for: ${article.title?.substring(0, 50)}`);

          // Delay to respect API limits
          await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
          console.error(`❌ Failed to update image for article: ${article.title}`, error);
        }
      }

      console.log('🎉 Completed updating existing articles with local images!');
    } catch (error) {
      console.error('❌ Failed to update existing articles:', error);
      throw error;
    }
  }
}

export const ArticleGenerator = new ArticleGeneratorClass(); 