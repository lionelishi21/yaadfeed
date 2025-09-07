import ArtistInfoScraper from './artistScraper';
// Lazy-load NewsService when saving to DB to avoid bundling

// Comprehensive artist database from scraper.ts
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

export class BatchArtistScraper {
  private scraper: ArtistInfoScraper;
  private processedArtists: Set<string> = new Set();
  private results: any[] = [];

  constructor() {
    this.scraper = new ArtistInfoScraper();
  }

  // Get all artists from the database
  private getAllArtists(): string[] {
    return Object.values(DANCEHALL_ARTISTS).flat();
  }

  // Get artists by region
  private getArtistsByRegion(region: string): string[] {
    return DANCEHALL_ARTISTS[region as keyof typeof DANCEHALL_ARTISTS] || [];
  }

  // Scrape all artists
  async scrapeAllArtists(): Promise<{
    total: number;
    successful: number;
    failed: number;
    results: any[];
    regions: string[];
  }> {
    console.log('🎵 [BatchArtistScraper] Starting comprehensive artist scraping...');
    
    const allArtists = this.getAllArtists();
    const regions = Object.keys(DANCEHALL_ARTISTS);
    
    console.log(`📊 [BatchArtistScraper] Total artists to scrape: ${allArtists.length}`);
    console.log(`🌍 [BatchArtistScraper] Regions covered: ${regions.join(', ')}`);
    
    let successful = 0;
    let failed = 0;
    
    for (let i = 0; i < allArtists.length; i++) {
      const artist = allArtists[i];
      
      if (this.processedArtists.has(artist)) {
        console.log(`⏭️  [BatchArtistScraper] Skipping already processed: ${artist}`);
        continue;
      }
      
      try {
        console.log(`🎵 [BatchArtistScraper] Scraping ${i + 1}/${allArtists.length}: ${artist}`);
        
        const artistData = await this.scraper.scrapeArtistInfo(artist);
        
        if (artistData) {
          // Add region information
          artistData.region = this.getArtistRegion(artist);
          artistData.scrapedAt = new Date();
          
          this.results.push(artistData);
          this.processedArtists.add(artist);
          successful++;
          
          console.log(`✅ [BatchArtistScraper] Successfully scraped: ${artist}`);
        } else {
          failed++;
          console.log(`❌ [BatchArtistScraper] Failed to scrape: ${artist}`);
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        failed++;
        console.error(`❌ [BatchArtistScraper] Error scraping ${artist}:`, error);
      }
    }
    
    console.log(`🎉 [BatchArtistScraper] Batch scraping completed!`);
    console.log(`📈 [BatchArtistScraper] Results: ${successful} successful, ${failed} failed`);
    
    return {
      total: allArtists.length,
      successful,
      failed,
      results: this.results,
      regions
    };
  }

  // Scrape artists by region
  async scrapeArtistsByRegion(region: string): Promise<{
    region: string;
    total: number;
    successful: number;
    failed: number;
    results: any[];
  }> {
    console.log(`🌍 Starting scraping for region: ${region}`);
    
    const artists = this.getArtistsByRegion(region);
    let successful = 0;
    let failed = 0;
    const results: any[] = [];
    
    for (let i = 0; i < artists.length; i++) {
      const artist = artists[i];
      
      try {
        console.log(`🎵 Scraping ${i + 1}/${artists.length}: ${artist}`);
        
        const artistData = await this.scraper.scrapeArtistInfo(artist);
        
        if (artistData) {
          artistData.region = region;
          artistData.scrapedAt = new Date();
          
          results.push(artistData);
          successful++;
          
          console.log(`✅ Successfully scraped: ${artist}`);
        } else {
          failed++;
          console.log(`❌ Failed to scrape: ${artist}`);
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        failed++;
        console.error(`❌ Error scraping ${artist}:`, error);
      }
    }
    
    console.log(`🎉 Region scraping completed for ${region}!`);
    console.log(`📈 Results: ${successful} successful, ${failed} failed`);
    
    return {
      region,
      total: artists.length,
      successful,
      failed,
      results
    };
  }

  // Scrape top artists (most popular)
  async scrapeTopArtists(limit: number = 50): Promise<{
    total: number;
    successful: number;
    failed: number;
    results: any[];
  }> {
    console.log(`🏆 Starting scraping for top ${limit} artists...`);
    
    // Define top artists based on popularity and influence
    const topArtists = [
      // Jamaican Legends
      'Bob Marley', 'Sean Paul', 'Vybz Kartel', 'Shenseea', 'Skillibeng',
      'Popcaan', 'Alkaline', 'Beenie Man', 'Bounty Killer', 'Shaggy',
      'Koffee', 'Protoje', 'Chronixx', 'Damian Marley', 'Buju Banton',
      
      // International Stars
      'Burna Boy', 'Wizkid', 'Davido', 'Drake', 'The Weeknd',
      'Rihanna', 'Nicki Minaj', 'Shatta Wale', 'Stonebwoy',
      
      // Caribbean Icons
      'Machel Montano', 'Bunji Garlin', 'Rihanna',
      
      // UK Artists
      'Stylo G', 'Stefflon Don', 'Kano', 'Stormzy',
      
      // Latin Artists
      'Daddy Yankee', 'Don Omar', 'Tego Calderón'
    ].slice(0, limit);
    
    let successful = 0;
    let failed = 0;
    const results: any[] = [];
    
    for (let i = 0; i < topArtists.length; i++) {
      const artist = topArtists[i];
      
      try {
        console.log(`🎵 Scraping top artist ${i + 1}/${topArtists.length}: ${artist}`);
        
        const artistData = await this.scraper.scrapeArtistInfo(artist);
        
        if (artistData) {
          artistData.region = this.getArtistRegion(artist);
          artistData.scrapedAt = new Date();
          artistData.isTopArtist = true;
          
          results.push(artistData);
          successful++;
          
          console.log(`✅ Successfully scraped: ${artist}`);
        } else {
          failed++;
          console.log(`❌ Failed to scrape: ${artist}`);
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        failed++;
        console.error(`❌ Error scraping ${artist}:`, error);
      }
    }
    
    console.log(`🎉 Top artists scraping completed!`);
    console.log(`📈 Results: ${successful} successful, ${failed} failed`);
    
    return {
      total: topArtists.length,
      successful,
      failed,
      results
    };
  }

  // Determine artist region
  private getArtistRegion(artistName: string): string {
    for (const [region, artists] of Object.entries(DANCEHALL_ARTISTS)) {
      if (artists.includes(artistName)) {
        return region;
      }
    }
    return 'international';
  }

  // Save results to database
  async saveResultsToDatabase(results: any[]): Promise<{
    saved: number;
    failed: number;
  }> {
    console.log(`💾 [BatchArtistScraper] Saving ${results.length} artist records to database...`);
    
    let saved = 0;
    let failed = 0;
    
    const { NewsService } = await import('./mongodb');
    for (const artistData of results) {
      try {
        console.log(`💾 [BatchArtistScraper] Attempting to save artist: ${artistData.name}`);
        // Format data for database
        const dbArtist = {
          name: artistData.name,
          bio: artistData.bio || '',
          imageUrl: artistData.imageUrl,
          spotifyId: artistData.spotifyId,
          genres: artistData.genres || [],
          popularity: artistData.popularity || 0,
          followers: artistData.followers || 0,
          netWorth: artistData.netWorth,
          birthDate: artistData.birthDate,
          birthPlace: artistData.birthPlace,
          socialMedia: artistData.socialMedia || {},
          region: artistData.region,
          isJamaican: artistData.isJamaican || false,
          isVerified: artistData.isVerified || false,
          lastUpdated: artistData.lastUpdated || new Date(),
          recentNews: artistData.recentNews || []
        };
        
        // Save to database (this would need to be implemented in your database service)
        await NewsService.createArtist(dbArtist);
        
        saved++;
        console.log(`✅ [BatchArtistScraper] Saved: ${artistData.name}`);
        
      } catch (error) {
        failed++;
        console.error(`❌ [BatchArtistScraper] Failed to save ${artistData.name}:`, error);
      }
    }
    
    console.log(`💾 [BatchArtistScraper] Database save completed: ${saved} saved, ${failed} failed`);
    
    return { saved, failed };
  }

  // Generate summary report
  generateReport(results: any[]): string {
    const regions = [...new Set(results.map(r => r.region))];
    const totalArtists = results.length;
    const verifiedArtists = results.filter(r => r.isVerified).length;
    const jamaicanArtists = results.filter(r => r.isJamaican).length;
    
    const avgPopularity = results.reduce((sum, r) => sum + (r.popularity || 0), 0) / totalArtists;
    const avgFollowers = results.reduce((sum, r) => sum + (r.followers || 0), 0) / totalArtists;
    
    return `
🎵 Artist Scraping Report
========================

📊 Summary:
- Total Artists: ${totalArtists}
- Regions Covered: ${regions.length}
- Verified Artists: ${verifiedArtists}
- Jamaican Artists: ${jamaicanArtists}

📈 Metrics:
- Average Popularity: ${avgPopularity.toFixed(1)}/100
- Average Followers: ${numberFormat(avgFollowers)}

🌍 Regional Breakdown:
${regions.map(region => {
  const regionArtists = results.filter(r => r.region === region);
  return `- ${region}: ${regionArtists.length} artists`;
}).join('\n')}

🏆 Top Artists by Followers:
${results
  .sort((a, b) => (b.followers || 0) - (a.followers || 0))
  .slice(0, 10)
  .map((artist, i) => `${i + 1}. ${artist.name} (${numberFormat(artist.followers || 0)} followers)`)
  .join('\n')}
    `;
  }
}

// Helper function for number formatting
function numberFormat(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export default BatchArtistScraper;