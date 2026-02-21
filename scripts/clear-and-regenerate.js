#!/usr/bin/env node

require('dotenv').config();

async function clearAndRegenerate() {
  console.log('🇯🇲 YaadFeed Database Clear & Regenerate Tool');
  console.log('═════════════════════════════════════════════════════════');

  // Check required environment variables
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY is required in environment variables');
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is required in environment variables');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const count = parseInt(args.find(arg => arg.startsWith('--count='))?.split('=')[1] || '20');

  console.log(`📊 Regenerating ${count} articles with local AI images`);
  console.log(`💾 Images will be saved to: public/images/generated/`);
  console.log('═════════════════════════════════════════════════════════');

  try {
    const { NewsService } = require('../src/lib/mongodb');
    const { ArticleGenerator } = require('../src/lib/articleGenerator');
    const { ImageService } = require('../src/lib/imageService');

    // Step 1: Get current database stats
    console.log('\n📊 Current Database Status:');
    const currentStats = await NewsService.getDatabaseStats();
    console.log(`   Total Articles: ${currentStats.totalArticles}`);
    console.log(`   With Images: ${currentStats.withImages}`);
    console.log(`   Without Images: ${currentStats.withoutImages}`);
    
    if (currentStats.totalArticles > 0) {
      console.log('\n   Categories:');
      Object.entries(currentStats.categories).forEach(([cat, count]) => {
        console.log(`     ${cat}: ${count} articles`);
      });
    }

    // Step 2: Clear existing database
    console.log('\n🗑️ Clearing existing database...');
    const clearResult = await NewsService.clearAllNews();
    
    if (clearResult.success) {
      console.log(`✅ ${clearResult.message}`);
    } else {
      console.error(`❌ Failed to clear database: ${clearResult.message}`);
      process.exit(1);
    }

    // Step 3: Get current image stats
    const imageStatsBefore = await ImageService.getImageStats();
    console.log(`\n📸 Current Local Images: ${imageStatsBefore.totalImages}`);

    // Step 4: Generate new articles with local images
    console.log(`\n🚀 Generating ${count} fresh articles with AI local images...`);
    console.log('⏳ This may take several minutes (AI generation + image download)...');
    
    const startTime = Date.now();
    const result = await ArticleGenerator.regenerateAllContent(count);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    // Step 5: Get final stats
    const finalStats = await NewsService.getDatabaseStats();
    const imageStatsAfter = await ImageService.getImageStats();

    console.log('\n' + '═'.repeat(65));
    
    if (result.success) {
      console.log('✅ REGENERATION COMPLETED SUCCESSFULLY!');
      console.log('═════════════════════════════════════════════════════════');
      console.log(`⏱️  Total Duration: ${duration} seconds`);
      console.log(`📝 Articles Generated: ${result.count}`);
      console.log(`🖼️  Local Images: ${imageStatsAfter.totalImages} total (+${imageStatsAfter.totalImages - imageStatsBefore.totalImages} new)`);
      console.log(`📁 Image Directory: ${imageStatsAfter.directory}`);
      
      console.log('\n📊 Final Database Stats:');
      console.log(`   Total Articles: ${finalStats.totalArticles}`);
      console.log(`   With Images: ${finalStats.withImages}`);
      console.log(`   Without Images: ${finalStats.withoutImages}`);
      
      console.log('\n   Categories:');
      Object.entries(finalStats.categories).forEach(([cat, count]) => {
        console.log(`     ${cat}: ${count} articles`);
      });

      if (result.articles && result.articles.length > 0) {
        console.log('\n📰 Sample Generated Articles:');
        result.articles.slice(0, 8).forEach((article, index) => {
          const imageType = article.imageUrl?.startsWith('/images/generated/') ? '🤖 AI-Local' : '📷 Fallback';
          console.log(`  ${index + 1}. ${article.title?.substring(0, 55)}... [${imageType}]`);
        });
        
        if (result.articles.length > 8) {
          console.log(`  ... and ${result.articles.length - 8} more articles`);
        }
      }

      console.log('\n💰 Cost & Performance Benefits:');
      console.log('  • AI images generated once and saved locally');
      console.log('  • Zero generation costs on future website visits');
      console.log('  • Faster loading from local storage');
      console.log('  • No external API dependencies for images');
      console.log('  • Realistic images with enhanced prompts');
      
      console.log('\n🚀 Next Steps:');
      console.log('  1. Start your development server: npm run dev');
      console.log('  2. Visit http://localhost:3000 to see your fresh content');
      console.log('  3. All images load instantly from local storage!');
      
    } else {
      console.log('❌ REGENERATION FAILED!');
      console.log('═════════════════════════════════════════════════════════');
      console.log(`⏱️  Duration: ${duration} seconds`);
      console.log(`❌ Error: ${result.error || 'Unknown error'}`);
      
      // Show partial results if any
      if (finalStats.totalArticles > 0) {
        console.log(`\n📊 Partial Results: ${finalStats.totalArticles} articles created before failure`);
      }
    }

  } catch (error) {
    console.error('\n❌ SCRIPT ERROR:');
    console.error('═════════════════════════════════════════════════════════');
    console.error(error);
    process.exit(1);
  }
}

if (require.main === module) {
  clearAndRegenerate().catch(console.error);
} 