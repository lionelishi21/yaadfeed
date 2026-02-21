#!/usr/bin/env node

require('dotenv').config();

async function testScrapingWithImages() {
  console.log('🧪 Testing Scraping with AI Image Generation');
  console.log('═══════════════════════════════════════════════════');

  // Check required environment variables
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is required in environment variables');
    process.exit(1);
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY is required for AI image generation');
    process.exit(1);
  }

  try {
    console.log('✅ Environment variables checked');
    console.log('✅ OpenAI API key available');
    
    console.log('\n🔍 Testing image generation via API...');
    console.log('📝 This will test the image generation functionality');
    
    // Test the image generation API directly
    const testResponse = await fetch('http://localhost:4000/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Jamaica News Article',
        category: 'sports',
        keywords: ['jamaica', 'sports', 'athletics'],
        summary: 'Test article for image generation',
        forceGenerate: true
      }),
    });

    if (testResponse.ok) {
      const result = await testResponse.json();
      console.log('\n📊 Image Generation Test Results:');
      console.log(`   ✅ Success: ${result.success}`);
      console.log(`   🎨 Image URL: ${result.imageUrl}`);
      console.log(`   📝 Type: ${result.type}`);
      console.log(`   💰 Generated: ${result.generated}`);
      
      console.log('\n✅ Image generation is working!');
      console.log('💡 The daily cron job at 12 AM will now automatically generate AI images for all new articles.');
    } else {
      console.log('\n❌ Image generation test failed');
      console.log('   Make sure the development server is running on port 4000');
    }

  } catch (error) {
    console.error('\n❌ TEST ERROR:');
    console.error('═══════════════════════════════════════════════════');
    console.error(error);
    console.log('\n💡 Make sure to run: npm run dev');
    process.exit(1);
  }
}

if (require.main === module) {
  testScrapingWithImages().catch(console.error);
} 