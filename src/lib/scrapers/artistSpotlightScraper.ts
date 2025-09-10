import { connectToDatabase } from '@/lib/mongodb';

export interface ArtistSpotlight {
  _id?: string;
  artistName: string;
  songTitle: string;
  releaseDate: string;
  imageUrl?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  genre: string;
  status: 'NEW_RELEASE' | 'TRENDING' | 'HOT' | 'POPULAR' | 'CONSCIOUS';
  views?: number;
  likes?: number;
  description: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Jamaican artists to monitor for new releases
const MONITORED_ARTISTS = [
  'Vybz Kartel',
  'Spice',
  'Popcaan',
  'Skillibeng',
  'Shenseea',
  'Chronixx',
  'Protoje',
  'Jada Kingdom',
  'Koffee',
  'Sean Paul',
  'Shaggy',
  'Buju Banton',
  'Beenie Man',
  'Bounty Killer',
  'Mavado',
  'Dexta Daps',
  'Teejay',
  'Valiant',
  'RajahWild',
  'Intence'
];

// Mock data for demonstration - in production, this would come from APIs
const MOCK_SPOTLIGHT_DATA: ArtistSpotlight[] = [
  {
    artistName: 'Vybz Kartel',
    songTitle: 'New Ting',
    releaseDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    imageUrl: '/images/vybz-kartel.jpg',
    spotifyUrl: 'https://open.spotify.com/track/example1',
    youtubeUrl: 'https://youtube.com/watch?v=example1',
    genre: 'Dancehall',
    status: 'NEW_RELEASE',
    views: 125000,
    likes: 8200,
    description: 'The World Boss returns with another dancehall anthem that\'s already trending across the Caribbean.',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    artistName: 'Spice',
    songTitle: 'So Mi Like It',
    releaseDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    imageUrl: '/images/spice.jpg',
    spotifyUrl: 'https://open.spotify.com/track/example2',
    youtubeUrl: 'https://youtube.com/watch?v=example2',
    genre: 'Dancehall',
    status: 'TRENDING',
    views: 89000,
    likes: 5600,
    description: 'Queen of Dancehall drops new single',
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    artistName: 'Popcaan',
    songTitle: 'Unruly Vibes',
    releaseDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    imageUrl: '/images/popcaan.jpg',
    spotifyUrl: 'https://open.spotify.com/track/example3',
    youtubeUrl: 'https://youtube.com/watch?v=example3',
    genre: 'Dancehall',
    status: 'HOT',
    views: 156000,
    likes: 12000,
    description: 'Unruly Boss releases new track',
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    artistName: 'Skillibeng',
    songTitle: 'Brik Pan Brik',
    releaseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    imageUrl: '/images/skillibeng.jpg',
    spotifyUrl: 'https://open.spotify.com/track/example4',
    youtubeUrl: 'https://youtube.com/watch?v=example4',
    genre: 'Dancehall',
    status: 'NEW',
    views: 78000,
    likes: 4500,
    description: 'Rising star drops new single',
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    artistName: 'Shenseea',
    songTitle: 'Blessed',
    releaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    imageUrl: '/images/shenseea.jpg',
    spotifyUrl: 'https://open.spotify.com/track/example5',
    youtubeUrl: 'https://youtube.com/watch?v=example5',
    genre: 'Dancehall',
    status: 'POPULAR',
    views: 234000,
    likes: 18900,
    description: 'International diva releases new track',
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    artistName: 'Chronixx',
    songTitle: 'Likes',
    releaseDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    imageUrl: '/images/chronixx.jpg',
    spotifyUrl: 'https://open.spotify.com/track/example6',
    youtubeUrl: 'https://youtube.com/watch?v=example6',
    genre: 'Reggae',
    status: 'CONSCIOUS',
    views: 167000,
    likes: 13400,
    description: 'Reggae revivalist drops new single',
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export class ArtistSpotlightScraper {
  private static instance: ArtistSpotlightScraper;
  private lastScrapeTime: Date | null = null;
  private scrapeInterval: number = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  private constructor() {}

  public static getInstance(): ArtistSpotlightScraper {
    if (!ArtistSpotlightScraper.instance) {
      ArtistSpotlightScraper.instance = new ArtistSpotlightScraper();
    }
    return ArtistSpotlightScraper.instance;
  }

  /**
   * Main scraping function that checks for new releases
   */
  public async scrapeNewReleases(): Promise<ArtistSpotlight[]> {
    console.log('🎵 [ARTIST SPOTLIGHT SCRAPER] Starting weekly scrape...');
    
    try {
      // Check if we need to scrape (weekly interval)
      if (this.shouldSkipScrape()) {
        console.log('⏭️ [ARTIST SPOTLIGHT SCRAPER] Skipping scrape - not time yet');
        return await this.getExistingSpotlights();
      }

      const newReleases: ArtistSpotlight[] = [];

      // In production, this would make API calls to:
      // - Spotify API for new releases
      // - YouTube API for new uploads
      // - Social media APIs for announcements
      // - Music blogs and news sites
      
      for (const artist of MONITORED_ARTISTS) {
        const releases = await this.scrapeArtistReleases(artist);
        newReleases.push(...releases);
      }

      // Save new releases to database
      if (newReleases.length > 0) {
        await this.saveSpotlights(newReleases);
        console.log(`✅ [ARTIST SPOTLIGHT SCRAPER] Found ${newReleases.length} new releases`);
      } else {
        console.log('ℹ️ [ARTIST SPOTLIGHT SCRAPER] No new releases found');
      }

      this.lastScrapeTime = new Date();
      return newReleases;

    } catch (error) {
      console.error('❌ [ARTIST SPOTLIGHT SCRAPER] Error during scraping:', error);
      return await this.getExistingSpotlights();
    }
  }

  /**
   * Scrape releases for a specific artist
   */
  private async scrapeArtistReleases(artistName: string): Promise<ArtistSpotlight[]> {
    console.log(`🔍 [ARTIST SPOTLIGHT SCRAPER] Checking releases for ${artistName}`);
    
    // Mock implementation - in production, this would:
    // 1. Check Spotify API for new releases
    // 2. Check YouTube for new uploads
    // 3. Check social media for announcements
    // 4. Check music blogs for news
    
    const mockReleases = MOCK_SPOTLIGHT_DATA.filter(
      release => release.artistName === artistName
    );

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return mockReleases;
  }

  /**
   * Save spotlights to database
   */
  private async saveSpotlights(spotlights: ArtistSpotlight[]): Promise<void> {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('artist_spotlights');

      for (const spotlight of spotlights) {
        // Check if already exists
        const existing = await collection.findOne({
          artistName: spotlight.artistName,
          songTitle: spotlight.songTitle
        });

        if (!existing) {
          await collection.insertOne({
            ...spotlight,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          console.log(`💾 [ARTIST SPOTLIGHT SCRAPER] Saved new release: ${spotlight.artistName} - ${spotlight.songTitle}`);
        }
      }
    } catch (error) {
      console.error('❌ [ARTIST SPOTLIGHT SCRAPER] Error saving to database:', error);
    }
  }

  /**
   * Get existing spotlights from database
   */
  public async getExistingSpotlights(): Promise<ArtistSpotlight[]> {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('artist_spotlights');
      
      const spotlights = await collection
        .find({})
        .sort({ releaseDate: -1 })
        .limit(10)
        .toArray();

      return spotlights as ArtistSpotlight[];
    } catch (error) {
      console.error('❌ [ARTIST SPOTLIGHT SCRAPER] Error fetching from database:', error);
      return MOCK_SPOTLIGHT_DATA; // Fallback to mock data
    }
  }

  /**
   * Check if we should skip scraping based on time interval
   */
  private shouldSkipScrape(): boolean {
    if (!this.lastScrapeTime) {
      return false; // First time scraping
    }

    const timeSinceLastScrape = Date.now() - this.lastScrapeTime.getTime();
    return timeSinceLastScrape < this.scrapeInterval;
  }

  /**
   * Force a scrape regardless of time interval
   */
  public async forceScrape(): Promise<ArtistSpotlight[]> {
    console.log('🔄 [ARTIST SPOTLIGHT SCRAPER] Force scraping...');
    this.lastScrapeTime = null; // Reset last scrape time
    return await this.scrapeNewReleases();
  }

  /**
   * Get featured spotlight (the main one to highlight)
   */
  public async getFeaturedSpotlight(): Promise<ArtistSpotlight | null> {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('artist_spotlights');
      
      const featured = await collection
        .findOne({ isFeatured: true }, { sort: { releaseDate: -1 } });

      return featured as ArtistSpotlight | null;
    } catch (error) {
      console.error('❌ [ARTIST SPOTLIGHT SCRAPER] Error fetching featured spotlight:', error);
      return MOCK_SPOTLIGHT_DATA.find(s => s.isFeatured) || null;
    }
  }

  /**
   * Get recent spotlights (non-featured)
   */
  public async getRecentSpotlights(limit: number = 5): Promise<ArtistSpotlight[]> {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('artist_spotlights');
      
      const spotlights = await collection
        .find({ isFeatured: false })
        .sort({ releaseDate: -1 })
        .limit(limit)
        .toArray();

      return spotlights as ArtistSpotlight[];
    } catch (error) {
      console.error('❌ [ARTIST SPOTLIGHT SCRAPER] Error fetching recent spotlights:', error);
      return MOCK_SPOTLIGHT_DATA.filter(s => !s.isFeatured).slice(0, limit);
    }
  }

  /**
   * Update spotlight status (NEW_RELEASE, TRENDING, etc.)
   */
  public async updateSpotlightStatus(id: string, status: ArtistSpotlight['status']): Promise<void> {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('artist_spotlights');
      
      await collection.updateOne(
        { _id: id },
        { 
          $set: { 
            status,
            updatedAt: new Date()
          }
        }
      );
      
      console.log(`✅ [ARTIST SPOTLIGHT SCRAPER] Updated status for ${id} to ${status}`);
    } catch (error) {
      console.error('❌ [ARTIST SPOTLIGHT SCRAPER] Error updating status:', error);
    }
  }

  /**
   * Get scraping statistics
   */
  public async getScrapingStats(): Promise<{
    totalSpotlights: number;
    lastScrapeTime: Date | null;
    nextScrapeTime: Date | null;
    monitoredArtists: number;
  }> {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('artist_spotlights');
      
      const totalSpotlights = await collection.countDocuments();
      const nextScrapeTime = this.lastScrapeTime 
        ? new Date(this.lastScrapeTime.getTime() + this.scrapeInterval)
        : null;

      return {
        totalSpotlights,
        lastScrapeTime: this.lastScrapeTime,
        nextScrapeTime,
        monitoredArtists: MONITORED_ARTISTS.length
      };
    } catch (error) {
      console.error('❌ [ARTIST SPOTLIGHT SCRAPER] Error getting stats:', error);
      return {
        totalSpotlights: 0,
        lastScrapeTime: null,
        nextScrapeTime: null,
        monitoredArtists: MONITORED_ARTISTS.length
      };
    }
  }
}

// Export singleton instance
export const artistSpotlightScraper = ArtistSpotlightScraper.getInstance();
