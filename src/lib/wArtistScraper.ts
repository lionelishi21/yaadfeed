import axios from 'axios';
import { NewsService } from './mongodb';

const WIKI_CATEGORIES = [
  'Category:Jamaican_musicians',
  'Category:Dancehall_musicians',
  'Category:Reggae_musicians',
  'Category:Afrobeats_musicians'
];

export class WArtistScraper {
  async fetchArtistsFromWikipediaCategory(category: string): Promise<string[]> {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=${encodeURIComponent(category)}&cmlimit=500&format=json`;
    try {
      console.log(`[WArtistScraper] Fetching artists from: ${category}`);
      const response = await axios.get(url);
      const members = response.data.query.categorymembers;
      // Filter out non-artist pages (e.g., subcategories)
      return members
        .filter((m: any) => !m.title.startsWith('Category:'))
        .map((m: any) => m.title);
    } catch (error) {
      console.error(`[WArtistScraper] Error fetching from ${category}:`, error);
      return [];
    }
  }

  async fetchWikipediaImage(artistName: string): Promise<string | null> {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(artistName)}&prop=pageimages&format=json&pithumbsize=400`;
    try {
      const response = await axios.get(url);
      const pages = response.data.query.pages;
      const page = Object.values(pages)[0];
      if (page && typeof page === 'object' && 'thumbnail' in page && page.thumbnail && typeof page.thumbnail === 'object' && 'source' in page.thumbnail) {
        return String(page.thumbnail.source);
      }
      return null;
    } catch (error) {
      console.error(`[WArtistScraper] Error fetching image for ${artistName}:`, error);
      return null;
    }
  }

  async scrapeAndSaveAll(): Promise<void> {
    let allArtists: Set<string> = new Set();
    for (const category of WIKI_CATEGORIES) {
      const artists = await this.fetchArtistsFromWikipediaCategory(category);
      artists.forEach(a => allArtists.add(a));
    }
    console.log(`[WArtistScraper] Total unique artists found: ${allArtists.size}`);
    let saved = 0, failed = 0;
    for (const name of allArtists) {
      try {
        const imageUrl = await this.fetchWikipediaImage(name);
        await NewsService.createArtist({ name, imageUrl });
        saved++;
        console.log(`[WArtistScraper] Saved artist: ${name} (image: ${imageUrl || 'none'})`);
      } catch (err) {
        failed++;
        console.error(`[WArtistScraper] Failed to save artist: ${name}`, err);
      }
    }
    console.log(`[WArtistScraper] Save complete. Saved: ${saved}, Failed: ${failed}`);
  }
}

export default WArtistScraper; 