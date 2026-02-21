import { NewsService } from './mongodb';
import { WArtistScraper } from './wArtistScraper';

// Helper to fetch a real Spotify access token using Client Credentials Flow
async function fetchSpotifyAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data.access_token || null;
}

// Artist information scraper for comprehensive data collection
export class ArtistInfoScraper {
  private spotifyToken: string | null = null;
  private lastfmApiKey: string | null = null;

  constructor() {
    this.lastfmApiKey = process.env.LASTFM_API_KEY || null;
  }

  // Ensure we have a valid Spotify token before scraping
  private async ensureSpotifyToken() {
    if (!this.spotifyToken) {
      this.spotifyToken = await fetchSpotifyAccessToken();
    }
  }

  // Main scraping method for comprehensive artist data
  async scrapeArtistInfo(artistName: string): Promise<any> {
    try {
      await this.ensureSpotifyToken();
      console.log(`🎵 Starting comprehensive scraping for: ${artistName}`);
      
      const artistData: any = {
        name: artistName,
        lastUpdated: new Date()
      };

      // Parallel scraping from multiple sources
      const [
        spotifyData,
        wikipediaData,
        lastfmData,
        newsData
      ] = await Promise.allSettled([
        this.scrapeSpotifyData(artistName),
        this.scrapeWikipediaData(artistName),
        this.scrapeLastfmData(artistName),
        this.scrapeRecentNews(artistName)
      ]);

      // Merge data from all sources
      if (spotifyData.status === 'fulfilled' && spotifyData.value) {
        Object.assign(artistData, spotifyData.value);
      }

      if (wikipediaData.status === 'fulfilled' && wikipediaData.value) {
        Object.assign(artistData, wikipediaData.value);
      }

      if (lastfmData.status === 'fulfilled' && lastfmData.value) {
        Object.assign(artistData, lastfmData.value);
      }

      if (newsData.status === 'fulfilled' && newsData.value) {
        artistData.recentNews = newsData.value;
      }

      // Fallback: If no imageUrl from Spotify or Last.fm, try Wikipedia
      if (!artistData.imageUrl) {
        const wikiScraper = new WArtistScraper();
        const wikiImage = await wikiScraper.fetchWikipediaImage(artistName);
        if (wikiImage) {
          artistData.imageUrl = wikiImage;
        }
      }

      // Determine region and verification status
      artistData.region = this.determineRegion(artistName);
      artistData.isJamaican = this.isJamaicanArtist(artistName);
      artistData.isVerified = this.isVerifiedArtist(artistName);

      // Calculate net worth estimate
      artistData.netWorth = this.estimateNetWorth(artistData);

      console.log(`✅ Completed scraping for: ${artistName}`);
      return artistData;

    } catch (error) {
      console.error(`❌ Error scraping artist info for ${artistName}:`, error);
      return null;
    }
  }

  // Spotify data scraping
  private async scrapeSpotifyData(artistName: string): Promise<any> {
    await this.ensureSpotifyToken();
    if (!this.spotifyToken) {
      console.log('⚠️  Spotify token not available, skipping Spotify data');
      return null;
    }

    try {
      const searchResponse = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
        {
          headers: {
            'Authorization': `Bearer ${this.spotifyToken}`
          }
        }
      );

      if (!searchResponse.ok) return null;

      const searchData = await searchResponse.json();
      const artist = searchData.artists?.items?.[0];

      if (!artist) return null;

      return {
        spotifyId: artist.id,
        imageUrl: artist.images?.[0]?.url,
        genres: artist.genres || [],
        popularity: artist.popularity || 0,
        followers: artist.followers?.total || 0,
        socialMedia: {
          spotify: artist.external_urls?.spotify
        },
        discography: {
          albums: [],
          singles: []
        }
      };

    } catch (error) {
      console.error('Error scraping Spotify data:', error);
      return null;
    }
  }

  // Wikipedia data scraping
  private async scrapeWikipediaData(artistName: string): Promise<any> {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(artistName)}`
      );

      if (!response.ok) return null;

      const data = await response.json();

      if (data.type === 'disambiguation') {
        return null;
      }

      return {
        bio: data.extract || '',
        birthPlace: this.extractBirthPlace(data.extract || ''),
        birthDate: this.extractBirthDate(data.extract || '')
      };

    } catch (error) {
      console.error('Error scraping Wikipedia data:', error);
      return null;
    }
  }

  // Last.fm data scraping
  private async scrapeLastfmData(artistName: string): Promise<any> {
    if (!this.lastfmApiKey) {
      console.log('⚠️  Last.fm API key not available, skipping Last.fm data');
      return null;
    }

    try {
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${this.lastfmApiKey}&format=json`
      );

      if (!response.ok) return null;

      const data = await response.json();
      const artist = data.artist;

      if (!artist) return null;

      return {
        bio: artist.bio?.summary || '',
        imageUrl: artist.image?.[2]?.['#text'],
        genres: artist.tags?.tag?.map((tag: any) => tag.name) || [],
        totalPlays: parseInt(artist.stats?.playcount || '0'),
        socialMedia: {
          website: artist.url
        }
      };

    } catch (error) {
      console.error('Error scraping Last.fm data:', error);
      return null;
    }
  }

  // Recent news scraping
  private async scrapeRecentNews(artistName: string): Promise<any[]> {
    try {
      // Search for recent news articles mentioning the artist
      const articles = await NewsService.getAllNews({ search: artistName, limit: 10 });
      
      return articles.map((article: any) => ({
        id: article._id,
        title: article.title,
        summary: article.summary,
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source
      }));

    } catch (error) {
      console.error('Error scraping recent news:', error);
      return [];
    }
  }

  // Helper methods
  private determineRegion(artistName: string): string {
    const jamaicanArtists = [
      'Bob Marley', 'Sean Paul', 'Koffee', 'Vybz Kartel', 'Shenseea',
      'Skillibeng', 'Popcaan', 'Alkaline', 'Masicka', 'Beenie Man'
    ];

    const nigerianArtists = [
      'Burna Boy', 'Wizkid', 'Davido', 'Omah Lay', 'Rema', 'Asake'
    ];

    const ghanaianArtists = [
      'Shatta Wale', 'Stonebwoy', 'Black Sherif', 'Kwesi Arthur'
    ];

    if (jamaicanArtists.some(name => artistName.toLowerCase().includes(name.toLowerCase()))) {
      return 'Jamaica';
    } else if (nigerianArtists.some(name => artistName.toLowerCase().includes(name.toLowerCase()))) {
      return 'Nigeria';
    } else if (ghanaianArtists.some(name => artistName.toLowerCase().includes(name.toLowerCase()))) {
      return 'Ghana';
    }

    return 'International';
  }

  private isJamaicanArtist(artistName: string): boolean {
    const jamaicanArtists = [
      'Bob Marley', 'Sean Paul', 'Koffee', 'Vybz Kartel', 'Shenseea',
      'Skillibeng', 'Popcaan', 'Alkaline', 'Masicka', 'Beenie Man',
      'Bounty Killer', 'Elephant Man', 'Shaggy', 'Busy Signal',
      'Konshens', 'Tarrus Riley', 'Protoje', 'Chronixx', 'Lila Iké',
      'Jah Cure', 'Buju Banton', 'Capleton', 'Damian Marley'
    ];

    return jamaicanArtists.some(name => artistName.toLowerCase().includes(name.toLowerCase()));
  }

  private isVerifiedArtist(artistName: string): boolean {
    const verifiedArtists = [
      'Bob Marley', 'Sean Paul', 'Koffee', 'Vybz Kartel', 'Shenseea',
      'Skillibeng', 'Popcaan', 'Burna Boy', 'Wizkid', 'Davido',
      'Shatta Wale', 'Stonebwoy', 'Drake', 'The Weeknd'
    ];

    return verifiedArtists.some(name => artistName.toLowerCase().includes(name.toLowerCase()));
  }

  private estimateNetWorth(artistData: any): number {
    // Simple estimation based on popularity and followers
    const baseWorth = 100000; // $100k base
    const popularityMultiplier = (artistData.popularity || 0) / 100;
    const followerMultiplier = (artistData.followers || 0) / 1000000; // 1M followers = $1M
    
    return Math.round(baseWorth + (popularityMultiplier * 5000000) + (followerMultiplier * 1000000));
  }

  private extractBirthPlace(bio: string): string | undefined {
    const birthPlaceMatch = bio.match(/(?:born|from|in)\s+([^,\.]+(?:,\s*[^,\.]+)*)/i);
    return birthPlaceMatch ? birthPlaceMatch[1].trim() : undefined;
  }

  private extractBirthDate(bio: string): string | undefined {
    const dateMatch = bio.match(/(?:born|birth)\s+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i);
    return dateMatch ? dateMatch[1] : undefined;
  }

  // Batch scraping for multiple artists
  async scrapeMultipleArtists(artistNames: string[]): Promise<any[]> {
    console.log(`🎵 Starting batch scraping for ${artistNames.length} artists`);
    
    const results: any[] = [];
    
    for (const artistName of artistNames) {
      try {
        const artistData = await this.scrapeArtistInfo(artistName);
        if (artistData) {
          results.push(artistData);
          console.log(`✅ Scraped: ${artistName}`);
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Failed to scrape ${artistName}:`, error);
      }
    }
    
    console.log(`🎉 Batch scraping completed: ${results.length}/${artistNames.length} artists`);
    return results;
  }
}

export default ArtistInfoScraper; 