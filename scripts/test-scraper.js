#!/usr/bin/env node

/**
 * YaadFeed Scraper Test Script
 * 
 * This script helps test your scraping setup and API endpoints.
 * Run with: node scripts/test-scraper.js
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002';
const SCRAPER_KEY = process.env.SCRAPER_API_KEY || 'development-scraper-key';

async function testEndpoint(url, options = {}) {
  try {
    console.log(`🔍 Testing: ${url}`);
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Success:', response.status);
      return data;
    } else {
      console.log('❌ Error:', response.status, data.error || data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Failed:', error.message);
    return null;
  }
}

async function testScraperAPI() {
  console.log('\n🚀 Testing Scraper API...\n');
  
  // Test GET (info)
  await testEndpoint(`${BASE_URL}/api/scrape`);
  
  console.log('\n');
  
  // Test POST (actual scraping)
  const scrapingResult = await testEndpoint(`${BASE_URL}/api/scrape`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SCRAPER_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (scrapingResult) {
    console.log('📊 Scraping Results:');
    console.log(`   - Added: ${scrapingResult.results?.added || 0} articles`);
    console.log(`   - Skipped: ${scrapingResult.results?.skipped || 0} articles`);
    console.log(`   - Errors: ${scrapingResult.results?.errors || 0} articles`);
    console.log(`   - Cleaned up: ${scrapingResult.results?.cleanedUp || 0} old articles`);
  }
}

async function testNewsAPI() {
  console.log('\n📰 Testing News API...\n');
  
  // Test news listing
  const newsData = await testEndpoint(`${BASE_URL}/api/news`);
  
  if (newsData && newsData.news?.length > 0) {
    console.log(`✅ Found ${newsData.news.length} articles`);
    
    // Test individual article
    const firstArticle = newsData.news[0];
    console.log(`\n🔍 Testing individual article: ${firstArticle.slug || firstArticle.id}`);
    await testEndpoint(`${BASE_URL}/api/news/${firstArticle.slug || firstArticle.id}`);
  } else {
    console.log('ℹ️  No articles found. Try running the scraper first.');
  }
}

async function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase().trim());
    });
  });
}

async function main() {
  console.log('🇯🇲 YaadFeed Scraper Test Script');
  console.log('================================\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Scraper Key: ${SCRAPER_KEY}\n`);
  
  const choice = await promptUser(
    'What would you like to test?\n' +
    '1. Scraper API (scrape news)\n' +
    '2. News API (view articles)\n' +
    '3. Both\n' +
    'Enter choice (1/2/3): '
  );
  
  switch (choice) {
    case '1':
      await testScraperAPI();
      break;
    case '2':
      await testNewsAPI();
      break;
    case '3':
    default:
      await testScraperAPI();
      await testNewsAPI();
      break;
  }
  
  console.log('\n✅ Testing completed!');
  console.log('\nNext steps:');
  console.log('- Check your Supabase dashboard for scraped articles');
  console.log('- Visit /news in your browser to see the articles');
  console.log('- Deploy to Vercel for automatic daily scraping');
  
  rl.close();
}

// Handle fetch polyfill for Node.js < 18
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ or a fetch polyfill');
  process.exit(1);
}

main().catch(console.error); 