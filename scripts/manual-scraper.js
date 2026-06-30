#!/usr/bin/env node

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SCRAPER_KEY = process.env.SCRAPER_API_KEY || 'development-scraper-key';

async function runManualScraper() {
  console.log(`🚀 Starting manual news scraper against ${BASE_URL}...`);
  console.log('ℹ️ Duplicate articles will be skipped automatically.');
  
  try {
    const response = await fetch(`${BASE_URL}/api/scrape`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SCRAPER_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Scraping completed successfully!');
      if (data.results) {
        console.log('\n📊 Results:');
        console.log(`   - New Articles Added: ${data.results.articlesAdded || 0}`);
        console.log(`   - Duplicates Skipped: ${data.results.duplicatesSkipped || 0}`);
        console.log(`   - Total Processed: ${data.results.totalProcessed || 0}`);
      }
    } else {
      console.error('❌ Scraping failed:', data.error || data.message || response.statusText);
    }
  } catch (error) {
    console.error('❌ Execution error:', error.message);
    console.log('Make sure the Next.js development server is running on port 3000 (npm run dev).');
  }
}

runManualScraper();
