require('dotenv').config();

async function main() {
  const { connectToDatabase } = require('../src/lib/mongodb');
  const { db } = await connectToDatabase();
  const res = await db.collection('news_items').deleteMany({});
  console.log(`Deleted ${res.deletedCount} corrupted articles.`);

  console.log('Running scraper to fetch real full-length articles...');
  const JamaicanNewsScraper = require('../src/lib/scraper').default;
  const scraper = new JamaicanNewsScraper();
  
  const results = await scraper.scrapeAllSources();
  console.log('Scraping completed!', results);
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
