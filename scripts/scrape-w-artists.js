import { WArtistScraper } from '../src/lib/wArtistScraper';

async function run() {
  const scraper = new WArtistScraper();
  await scraper.scrapeAndSaveAll();
}

run().catch(err => {
  console.error('[WArtistScraper Script] Fatal error:', err);
  process.exit(1);
}); 