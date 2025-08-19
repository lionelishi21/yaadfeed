import NewsService from '@/lib/mongodb';
import { ImageService } from '@/lib/imageService';

interface ScrapedArticle {
  title: string;
  summary: string;
  content: string;
  url: string;
  imageUrl?: string;
  category: string;
  source: string;
  publishedAt: string;
  author?: string;
}

class JamaicanNewsScraper {
  // Define news sources with their RSS feeds and basic scraping configs
  private sources = [
    {
      name: 'jamaica-gleaner',
      displayName: 'Jamaica Gleaner',
      rssUrl: 'https://jamaica-gleaner.com/feeds/all.xml',
      baseUrl: 'https://jamaica-gleaner.com'
    },
    {
      name: 'jamaica-observer',
      displayName: 'Jamaica Observer',
      rssUrl: 'https://www.jamaicaobserver.com/feed/',
      baseUrl: 'https://www.jamaicaobserver.com'
    },
    {
      name: 'jamaica-star',
      displayName: 'Jamaica Star',
      rssUrl: 'https://jamaica-star.com/feed',
      baseUrl: 'https://jamaica-star.com'
    }
  ];

  // Categorize articles based on title and content keywords
  private categorizeArticle(title: string, content: string): string {
    const titleLower = title.toLowerCase();
    const contentLower = content.toLowerCase();
    const text = `${titleLower} ${contentLower}`;

    const categories = [
      {
        name: 'sports',
        keywords: ['football', 'cricket', 'athletics', 'track', 'field', 'olympic', 'world cup', 'reggae boyz', 'netball', 'basketball', 'swimming', 'boxing', 'usain bolt', 'shelly-ann', 'athlete']
      },
      {
        name: 'entertainment',
        keywords: ['music', 'reggae', 'dancehall', 'concert', 'festival', 'artist', 'singer', 'bob marley', 'shaggy', 'sean paul', 'koffee', 'spice', 'popcaan', 'skillibeng', 'movie', 'film', 'celebrity']
      },
      {
        name: 'politics',
        keywords: ['government', 'minister', 'parliament', 'election', 'political', 'policy', 'andrew holness', 'mark golding', 'pnp', 'jlp', 'constituency', 'mp', 'senator']
      },
      {
        name: 'business',
        keywords: ['economy', 'business', 'trade', 'investment', 'gdp', 'financial', 'bank', 'tourism', 'hotel', 'export', 'import', 'dollar', 'economic', 'market', 'company', 'corporate']
      },
      {
        name: 'culture',
        keywords: ['culture', 'heritage', 'tradition', 'patois', 'jamaica cultural', 'festival', 'art', 'craft', 'food', 'cuisine', 'history', 'independence', 'emancipation']
      },
      {
        name: 'health',
        keywords: ['health', 'hospital', 'medical', 'doctor', 'covid', 'pandemic', 'vaccine', 'disease', 'treatment', 'healthcare', 'medicine', 'clinic']
      },
      {
        name: 'education',
        keywords: ['school', 'university', 'education', 'student', 'teacher', 'exam', 'csec', 'cape', 'utech', 'uwi', 'learning', 'academic']
      }
    ];

    for (const category of categories) {
      if (category.keywords.some(keyword => text.includes(keyword))) {
        return category.name;
      }
    }

    return 'local'; // Default category
  }

  // Generate SEO-friendly slug from title
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  // Extract text content and clean it
  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n\n') // Clean up paragraph breaks
      .trim();
  }

  // Generate article summary from content
  private generateSummary(content: string, maxLength: number = 200): string {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    let summary = '';
    
    for (const sentence of sentences) {
      if ((summary + sentence).length > maxLength) break;
      summary += sentence.trim() + '. ';
    }
    
    return summary.trim() || content.substring(0, maxLength) + '...';
  }

  // Parse RSS XML using regex (simple approach to avoid cheerio issues)
  private parseRSSFeed(xmlText: string): any[] {
    const items: any[] = [];
    
    // Extract items using regex
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    let itemMatch;
    
    while ((itemMatch = itemRegex.exec(xmlText)) !== null) {
      const itemContent = itemMatch[1];
      
      // Extract individual fields
      const title = this.extractXMLTag(itemContent, 'title');
      const link = this.extractXMLTag(itemContent, 'link');
      const description = this.extractXMLTag(itemContent, 'description');
      const pubDate = this.extractXMLTag(itemContent, 'pubDate');
      const content = this.extractXMLTag(itemContent, 'content:encoded') || description;
      
      if (title && link) {
        items.push({
          title: this.cleanHTML(title),
          link: link.trim(),
          description: this.cleanHTML(description),
          pubDate: pubDate,
          content: this.cleanHTML(content)
        });
      }
    }
    
    return items.slice(0, 10); // Limit to latest 10 articles per source
  }

  // Extract content from XML tag using regex
  private extractXMLTag(xml: string, tagName: string): string {
    const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
    const match = xml.match(regex);
    return match ? match[1].trim() : '';
  }

  // Remove HTML tags and decode entities
  private cleanHTML(html: string): string {
    if (!html) return '';
    
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
      .replace(/<[^>]+>/g, ' ') // Remove HTML tags
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Fetch and parse RSS feed
  private async fetchRSSFeed(source: any): Promise<any[]> {
    try {
      const response = await fetch(source.rssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const xmlText = await response.text();
      return this.parseRSSFeed(xmlText);
      
    } catch (error) {
      console.error(`Error fetching RSS for ${source.name}:`, error);
      return [];
    }
  }

  // Save article to MongoDB
  private async saveArticle(article: ScrapedArticle): Promise<boolean> {
    try {
      const slug = this.generateSlug(article.title);
      const summary = this.generateSummary(article.content);
      
      // Generate AI image for the article
      let imageUrl: string;
      try {
        console.log(`🎨 Generating AI image for: ${article.title.substring(0, 50)}...`);
        imageUrl = await ImageService.generateAndSaveDALLEImage(
          article.title,
          article.category,
          this.extractKeywords(article.title + ' ' + article.content),
          summary
        );
        console.log(`✅ AI image generated: ${imageUrl}`);
      } catch (error) {
        console.error(`❌ Failed to generate AI image for: ${article.title}`, error);
        // Use fallback image if AI generation fails
        imageUrl = await ImageService.getFallbackImage(article.category, 800, 600);
      }
      
      const newsData = {
        title: article.title,
        slug: slug,
        summary: summary,
        content: article.content,
        imageUrl: imageUrl, // Use the generated AI image
        category: article.category,
        source: article.source,
        publishedAt: new Date(article.publishedAt),
        author: article.author,
        tags: this.extractTags(article.title + ' ' + article.content),
        keywords: this.extractKeywords(article.title + ' ' + article.content),
        isPopular: false,
        viewCount: 0,
        url: article.url,
        imageStatus: 'ai-generated',
        needsImageGeneration: false // Mark as already generated
      };
      
      const result = await NewsService.createNews(newsData);
      return result !== null;
    } catch (error) {
      console.error('Error saving article:', error);
      return false;
    }
  }

  // Extract tags from text
  private extractTags(text: string): string[] {
    const commonTags = [
      'jamaica', 'kingston', 'montego bay', 'spanish town', 'portmore',
      'reggae', 'dancehall', 'bob marley', 'usain bolt', 'blue mountains',
      'tourism', 'economy', 'government', 'education', 'health', 'sports',
      'entertainment', 'culture', 'politics', 'business'
    ];
    
    const textLower = text.toLowerCase();
    return commonTags.filter(tag => textLower.includes(tag));
  }

  // Extract keywords from text
  private extractKeywords(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const stopWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'man', 'men', 'put', 'say', 'she', 'too', 'use'];
    
    const keywords = words.filter(word => !stopWords.includes(word));
    
    // Count frequency and return top keywords
    const frequency: { [key: string]: number } = {};
    keywords.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  // Main scraping method
  public async scrapeAllSources(): Promise<{ added: number; skipped: number; errors: number }> {
    let added = 0;
    let skipped = 0;
    let errors = 0;
    
    console.log('🔍 Starting news scraping...');
    
    for (const source of this.sources) {
      console.log(`📰 Scraping ${source.displayName}...`);
      
      try {
        const rssItems = await this.fetchRSSFeed(source);
        
        for (const item of rssItems) {
          try {
            // Check if article already exists
            if (await NewsService.newsExists(item.title, item.link)) {
              skipped++;
              continue;
            }
            
            // Create article object
            const article: ScrapedArticle = {
              title: item.title || 'Untitled Article',
              summary: this.generateSummary(item.content || item.description),
              content: item.content || item.description || 'Content not available',
              url: item.link,
              imageUrl: undefined, // Will be extracted later if needed
              category: this.categorizeArticle(item.title, item.content || item.description),
              source: source.name,
              publishedAt: new Date(item.pubDate || Date.now()).toISOString(),
              author: undefined // Will be extracted from content if available
            };
            
            // Save to database
            if (await this.saveArticle(article)) {
              added++;
              console.log(`✅ Added: ${article.title}`);
            } else {
              errors++;
              console.log(`❌ Failed to save: ${article.title}`);
            }
            
            // Add delay between requests to be respectful
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (error) {
            errors++;
            console.error(`❌ Error processing article ${item.title}:`, error);
          }
        }
      } catch (error) {
        errors++;
        console.error(`❌ Error scraping ${source.displayName}:`, error);
      }
    }
    
    console.log(`🎉 Scraping complete! Added: ${added}, Skipped: ${skipped}, Errors: ${errors}`);
    
    return { added, skipped, errors };
  }

  // Clean up old articles (optional - keep only last 30 days)
  public async cleanupOldArticles(): Promise<number> {
    try {
      const deletedCount = await NewsService.deleteOldNews(30);
      console.log(`🧹 Cleaned up ${deletedCount} old articles`);
      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up old articles:', error);
      return 0;
    }
  }
}

export default JamaicanNewsScraper; 

// Enhanced RSS feed sources with comprehensive dancehall coverage
const RSS_FEEDS = [
  // Original Jamaican sources
  { 
    url: 'https://www.jamaica-gleaner.com/rss/latest',
    source: 'Jamaica Gleaner',
    baseUrl: 'https://www.jamaica-gleaner.com'
  },
  { 
    url: 'https://www.jamaicaobserver.com/rss/latest',
    source: 'Jamaica Observer',
    baseUrl: 'https://www.jamaicaobserver.com'
  },
  
  // Dancehall-focused news sites
  { 
    url: 'https://www.dancehallmag.com/feed',
    source: 'Dancehall Mag',
    baseUrl: 'https://www.dancehallmag.com'
  },
  { 
    url: 'https://www.reggaeville.com/feed',
    source: 'Reggaeville',
    baseUrl: 'https://www.reggaeville.com'
  },
  { 
    url: 'https://urbanislandz.com/feed',
    source: 'Urban Islandz',
    baseUrl: 'https://urbanislandz.com'
  },
  { 
    url: 'https://www.largeup.com/feed',
    source: 'LargeUp',
    baseUrl: 'https://www.largeup.com'
  },
  { 
    url: 'https://jamaica.loopnews.com/feed',
    source: 'Loop Jamaica',
    baseUrl: 'https://jamaica.loopnews.com'
  },
  { 
    url: 'https://jamaica-star.com/feed',
    source: 'Jamaica Star',
    baseUrl: 'https://jamaica-star.com'
  },
  
  // Caribbean sources
  { 
    url: 'https://tt.loopnews.com/feed',
    source: 'Loop Trinidad',
    baseUrl: 'https://tt.loopnews.com'
  },
  { 
    url: 'https://trinidadexpress.com/feed',
    source: 'Trinidad Express',
    baseUrl: 'https://trinidadexpress.com'
  },
  
  // African sources (Ghana/Nigeria dancehall)
  { 
    url: 'https://www.ghanaweb.com/rss/entertainment.xml',
    source: 'GhanaWeb Entertainment',
    baseUrl: 'https://www.ghanaweb.com'
  },
  { 
    url: 'https://www.pulse.ng/entertainment/feed',
    source: 'Pulse Nigeria',
    baseUrl: 'https://www.pulse.ng'
  },
  
  // UK Dancehall sources
  { 
    url: 'https://www.voice-online.co.uk/feed',
    source: 'The Voice UK',
    baseUrl: 'https://www.voice-online.co.uk'
  },
  
  // US Caribbean sources
  { 
    url: 'https://www.caribbeanlifenews.com/feed',
    source: 'Caribbean Life News',
    baseUrl: 'https://www.caribbeanlifenews.com'
  }
];

// Enhanced artist database with comprehensive global dancehall scene
const DANCEHALL_ARTISTS = {
  // Jamaica (Core)
  jamaica: [
    'Vybz Kartel', 'Shenseea', 'Spice', 'Popcaan', 'Alkaline', 'Masicka',
    'Skillibeng', 'Chronic Law', 'Teejay', 'Rygin King', 'Dovey Magnum',
    'Beenie Man', 'Bounty Killer', 'Elephant Man', 'Sean Paul', 'Shaggy',
    'Busy Signal', 'Konshens', 'Tarrus Riley', 'Protoje', 'Chronixx',
    'Koffee', 'Lila Iké', 'Jah Cure', 'Buju Banton', 'Capleton',
    'Damian Marley', 'Stephen Marley', 'Ziggy Marley', 'Julian Marley',
    'Lauryn Hill', 'Wyclef Jean', 'Beres Hammond', 'Luciano', 'Sizzla',
    'Anthony B', 'Morgan Heritage', 'Third World', 'Inner Circle',
    'Natural Black', 'Vybes Kartel'
  ],
  
  // Trinidad & Tobago
  trinidad: [
    'Machel Montano', 'Bunji Garlin', 'Fay-Ann Lyons', 'Voice',
    'Prince Swanny', 'Jahllano', 'Medz Boss', 'Plumpy Boss',
    'Kes the Band', 'Destra Garcia', 'Patrice Roberts'
  ],
  
  // Grenada
  grenada: [
    'Mr. Killa'
  ],
  
  // Guyana
  guyana: [
    'Eddy Grant'
  ],
  
  // Ghana (Afro-Dancehall)
  ghana: [
    'Shatta Wale', 'Stonebwoy', 'Samini', 'Jupitar', 'AK Songstress',
    'Kaakie', 'Hailom', 'Pope Skinny', 'Fancy Gadam', 'Black Sherif',
    'Kwesi Arthur', 'Medikal', 'Sarkodie', 'Efya'
  ],
  
  // Nigeria
  nigeria: [
    'Patoranking', 'Timaya', 'Burna Boy', 'Cynthia Morgan',
    'General Pype', 'Orezi', 'Duncan Mighty', 'Speed Darlington',
    'Wizkid', 'Davido', 'Omah Lay', 'Rema', 'Asake', 'Ayra Starr'
  ],
  
  // UK (British-Jamaican)
  uk: [
    'Stylo G', 'Gappy Ranks', 'Ava Leigh', 'Yung Saber',
    'Stefflon Don', 'Don Andre', 'Lady Leshurr', 'Kano',
    'Skepta', 'Stormzy', 'Dave', 'AJ Tracey', 'Yxng Bane', 'Wiley', 'Chip'
  ],
  
  // US/Canada
  northAmerica: [
    'HoodCelebrityy', 'Red Rat', 'Honorebel', 'Serani',
    'Sean Kingston', 'Snow', 'Kranium', 'Kardinal Offishall',
    'Maestro Fresh Wes', 'Drake', 'The Weeknd', 'Collie Buddz'
  ],
  
  // French Caribbean
  frenchCaribbean: [
    'Admiral T', 'Kalash', 'Saïk', 'Tiwony', 'Kassav',
    'Zouk Machine', 'Carimi'
  ],
  
  // Other Caribbean
  otherCaribbean: [
    'Lava Man', 'Lil Natty & Thunda', 'Lil Rick', 'Peter Ram',
    'Ricardo Drue', 'Hypasounds', 'Rihanna', 'Nicki Minaj'
  ],
  
  // Europe
  europe: [
    'Gentleman', 'Seeed', 'Taïro', 'Nuttea', 'Alborosie',
    'SOJA'
  ],
  
  // Latin America
  latinAmerica: [
    'El General', 'Nando Boom', 'Mr. Saik', 'Aldo Ranks',
    'Toledo', 'Tapón', 'El Meco', 'Tego Calderón',
    'Daddy Yankee', 'Don Omar', 'Wisin & Yandel'
  ]
};

// Artist information sources for enhanced scraping
const ARTIST_INFO_SOURCES = {
  spotify: 'https://api.spotify.com/v1/artists/',
  wikipedia: 'https://en.wikipedia.org/api/rest_v1/page/summary/',
  lastfm: 'https://ws.audioscrobbler.com/2.0/',
  genius: 'https://api.genius.com/search?q=',
  instagram: 'https://www.instagram.com/',
  twitter: 'https://twitter.com/',
  youtube: 'https://www.youtube.com/c/'
};

// Standalone function to fetch RSS feed
async function fetchRSSFeed(feed: any): Promise<any[]> {
  try {
    const response = await fetch(feed.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const xmlText = await response.text();
    // For now, return empty array as we need to implement RSS parsing
    // This is a simplified version - you may want to add proper RSS parsing
    return [];
    
  } catch (error) {
    console.error(`Error fetching RSS for ${feed.source}:`, error);
    return [];
  }
}

// Enhanced scraping with pagination and artist linking
export async function scrapeNewsWithPagination(page: number = 1, limit: number = 20): Promise<{ 
  articlesAdded: number; 
  duplicatesSkipped: number; 
  totalProcessed: number;
  sources: string[];
  hasMore: boolean;
  totalPages: number;
  artistLinks: number;
}> {
  console.log(`🚀 Starting enhanced dancehall news scraping (Page ${page})...`);
  
  let totalArticles: any[] = [];
  let sourcesProcessed: string[] = [];
  let artistLinks = 0;
  
  // Process all RSS feeds with pagination
  for (const feed of RSS_FEEDS) {
    try {
      const articles = await fetchRSSFeed(feed);
      if (articles.length > 0) {
        totalArticles.push(...articles);
        sourcesProcessed.push(feed.source);
      }
    } catch (error) {
      console.error(`Error processing ${feed.source}:`, error);
    }
  }
  
  // Sort articles by publication date (most recent first)
  totalArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  
  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedArticles = totalArticles.slice(startIndex, endIndex);
  const hasMore = endIndex < totalArticles.length;
  const totalPages = Math.ceil(totalArticles.length / limit);
  
  console.log(`📊 Total articles collected: ${totalArticles.length} from ${sourcesProcessed.length} sources`);
  console.log(`📄 Page ${page}/${totalPages} (${paginatedArticles.length} articles)`);
  
  // Save to database with deduplication and artist linking
  let articlesAdded = 0;
  let duplicatesSkipped = 0;
  
  for (const article of paginatedArticles) {
    try {
      const isDuplicate = await NewsService.newsExists(article.title, article.url);
      
      if (!isDuplicate) {
        // Extract and link artists mentioned in the article
        const mentionedArtists = extractMentionedArtists(article.title + ' ' + article.content);
        if (mentionedArtists.length > 0) {
          artistLinks += mentionedArtists.length;
          console.log(`🎵 Found artists in article: ${mentionedArtists.join(', ')}`);
        }
        
        const newsData = {
          title: article.title,
          slug: article.slug,
          summary: article.summary,
          content: article.content,
          category: article.category,
          source: article.source,
          url: article.url,
          publishedAt: article.publishedAt,
          author: article.author,
          tags: article.tags,
          keywords: article.tags, // Use tags as keywords for now
          isPopular: false,
          viewCount: 0,
          mentionedArtists: mentionedArtists, // Add artist links
          artistCount: mentionedArtists.length
        };
        
        const createdNews = await NewsService.createNews(newsData);
        if (createdNews) {
          articlesAdded++;
          console.log(`✅ Added: ${article.title.substring(0, 60)}...`);
          
          // Update artist mentions in database
          if (mentionedArtists.length > 0 && createdNews._id) {
            await updateArtistMentions(createdNews._id, mentionedArtists);
          }
        }
      } else {
        duplicatesSkipped++;
        console.log(`⏭️  Skipped duplicate: ${article.title.substring(0, 60)}...`);
      }
    } catch (error) {
      console.error(`Error saving article "${article.title}":`, error);
    }
  }
  
  // Clean up old articles (older than 30 days)
  const deletedCount = await NewsService.deleteOldNews(30);
  console.log(`🗑️  Cleaned up ${deletedCount} old articles`);
  
  console.log(`🎉 Scraping completed!`);
  console.log(`📈 Results: ${articlesAdded} new articles, ${duplicatesSkipped} duplicates skipped`);
  console.log(`🌐 Sources processed: ${sourcesProcessed.join(', ')}`);
  console.log(`🎵 Artist links found: ${artistLinks}`);
  
  return {
    articlesAdded,
    duplicatesSkipped,
    totalProcessed: paginatedArticles.length,
    sources: sourcesProcessed,
    hasMore,
    totalPages,
    artistLinks
  };
}

// Extract artists mentioned in content
function extractMentionedArtists(content: string): string[] {
  const mentionedArtists: string[] = [];
  const contentLower = content.toLowerCase();
  
  // Check all artists from our database
  Object.values(DANCEHALL_ARTISTS).flat().forEach(artist => {
    const artistLower = artist.toLowerCase();
    if (contentLower.includes(artistLower)) {
      mentionedArtists.push(artist);
    }
  });
  
  return mentionedArtists;
}

// Update artist mentions in database
async function updateArtistMentions(articleId: string, artists: string[]): Promise<void> {
  try {
    // This would update the artist database with article references
    // Implementation depends on your database structure
    console.log(`📝 Updating artist mentions for article ${articleId}: ${artists.join(', ')}`);
  } catch (error) {
    console.error('Error updating artist mentions:', error);
  }
} 