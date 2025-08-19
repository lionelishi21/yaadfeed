#!/usr/bin/env node

require('dotenv').config();

async function checkMissingImages() {
  console.log('🖼️ YaadFeed Missing Images Checker');
  console.log('═══════════════════════════════════════════════════');

  // Check required environment variables
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is required in environment variables');
    process.exit(1);
  }

  try {
    const { NewsService, connectToDatabase } = require('../src/lib/mongodb');
    const { ImageService } = require('../src/lib/imageService');

    // Connect to database
    const { db } = await connectToDatabase();
    const newsCollection = db.collection('news_items');

    console.log('\n📊 Scanning articles for missing images...');

    // Find articles without proper images
    const articlesWithoutImages = await newsCollection.find({
      $or: [
        { imageUrl: { $exists: false } },
        { imageUrl: null },
        { imageUrl: "" },
        { imageUrl: { $regex: /^https:\/\/via\.placeholder\.com/ } }, // Look for placeholder images instead of Unsplash
      ]
    }).toArray();

    console.log(`📸 Found ${articlesWithoutImages.length} articles needing images`);

    if (articlesWithoutImages.length === 0) {
      console.log('✅ All articles have images! No action needed.');
      return;
    }

    // Mark articles for admin image generation
    const markedCount = await newsCollection.updateMany(
      {
        $or: [
          { imageUrl: { $exists: false } },
          { imageUrl: null },
          { imageUrl: "" },
          { imageUrl: { $regex: /^https:\/\/via\.placeholder\.com/ } }, // Look for placeholder images instead of Unsplash
        ]
      },
      {
        $set: {
          needsImageGeneration: true,
          imageGenerationRequested: new Date(),
          imageStatus: 'pending_admin_generation'
        }
      }
    );

    console.log(`✅ Marked ${markedCount.modifiedCount} articles for admin image generation`);

    // Create summary report
    const categoryBreakdown = {};
    articlesWithoutImages.forEach(article => {
      const category = article.category || 'unknown';
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
    });

    console.log('\n📊 Articles needing images by category:');
    Object.entries(categoryBreakdown).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} articles`);
    });

    // Get current image stats
    const imageStats = await ImageService.getImageStats();
    console.log(`\n🖼️ Current local images: ${imageStats.totalImages}`);
    console.log(`📁 Image directory: ${imageStats.directory}`);

    console.log('\n🚀 Next Steps for Admin:');
    console.log('  1. Visit the admin panel at /admin/images');
    console.log('  2. Click "Generate Missing Images" to create AI images');
    console.log('  3. Or generate images individually for each article');
    console.log(`  4. Total cost estimate: ~$${(articlesWithoutImages.length * 0.04).toFixed(2)} for all images`);

    // Sample articles needing images
    if (articlesWithoutImages.length > 0) {
      console.log('\n📰 Sample articles needing images:');
      articlesWithoutImages.slice(0, 5).forEach((article, index) => {
        console.log(`  ${index + 1}. ${article.title?.substring(0, 60)}... [${article.category}]`);
      });
      
      if (articlesWithoutImages.length > 5) {
        console.log(`  ... and ${articlesWithoutImages.length - 5} more articles`);
      }
    }

  } catch (error) {
    console.error('\n❌ SCRIPT ERROR:');
    console.error('═══════════════════════════════════════════════════');
    console.error(error);
    process.exit(1);
  }
}

if (require.main === module) {
  checkMissingImages().catch(console.error);
} 