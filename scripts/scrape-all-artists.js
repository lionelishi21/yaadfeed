async function scrapeAllArtistsAndNews() {
  console.log('🎵 Starting comprehensive artist and news scraping...');
  try {
    // Trigger the scraping via the API endpoint
    console.log('📊 Triggering scraping via API...');
    const response = await fetch('http://localhost:4000/api/scrape-artists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (result.success) {
      console.log('✅ Scraping completed successfully!');
      // ... (rest of your reporting code)
    } else {
      console.error('❌ Scraping failed:', result.message);
      if (result.error) {
        console.error('Error details:', result.error);
      }
    }
  } catch (error) {
    console.error('❌ Error during scraping:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  scrapeAllArtistsAndNews();
} 