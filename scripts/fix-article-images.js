#!/usr/bin/env node

/**
 * Fix Article Images Script
 * 
 * This script ensures all articles in the database have proper image URLs.
 * It will:
 * 1. Find articles without images
 * 2. Assign appropriate placeholder images based on category
 * 3. Update the database with proper image URLs
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yaadfeed';
const DB_NAME = process.env.MONGODB_DB || 'yaadfeed';

// Category to placeholder image mapping
const CATEGORY_IMAGES = {
  'sports': '/images/placeholder-sports.jpg',
  'entertainment': '/images/placeholder-entertainment.jpg',
  'politics': '/images/placeholder-politics.jpg',
  'business': '/images/placeholder-business.jpg',
  'culture': '/images/placeholder-culture.jpg',
  'health': '/images/placeholder-health.jpg',
  'education': '/images/placeholder-education.jpg',
  'technology': '/images/placeholder-technology.jpg',
  'music': '/images/placeholder-music.jpg',
  'dancehall': '/images/placeholder-dancehall.jpg',
  'local': '/images/placeholder-general.jpg',
  'international': '/images/placeholder-general.jpg'
};

async function fixArticleImages() {
  let client;
  
  try {
    console.log('🔧 Starting article image fix...');
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const collection = db.collection('news_items');
    
    // Find articles with missing or invalid image URLs
    const articlesToFix = await collection.find({
      $or: [
        { imageUrl: { $exists: false } },
        { imageUrl: null },
        { imageUrl: '' },
        { imageUrl: { $regex: /^undefined$/ } },
        { imageUrl: { $regex: /^null$/ } }
      ]
    }).toArray();
    
    console.log(`📊 Found ${articlesToFix.length} articles with missing images`);
    
    if (articlesToFix.length === 0) {
      console.log('✅ All articles already have proper images!');
      return;
    }
    
    let updated = 0;
    let errors = 0;
    
    for (const article of articlesToFix) {
      try {
        // Determine the appropriate image URL
        let imageUrl = CATEGORY_IMAGES[article.category] || CATEGORY_IMAGES['local'];
        
        // Update the article with the proper image URL
        const result = await collection.updateOne(
          { _id: article._id },
          { 
            $set: { 
              imageUrl: imageUrl,
              imageStatus: 'placeholder-assigned',
              updatedAt: new Date()
            }
          }
        );
        
        if (result.modifiedCount > 0) {
          updated++;
          console.log(`✅ Fixed image for: ${article.title.substring(0, 50)}...`);
        }
        
      } catch (error) {
        errors++;
        console.error(`❌ Error fixing image for article ${article._id}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Image fix completed!`);
    console.log(`✅ Updated: ${updated} articles`);
    console.log(`❌ Errors: ${errors} articles`);
    
    // Show summary of image status
    const totalArticles = await collection.countDocuments();
    const articlesWithImages = await collection.countDocuments({ 
      imageUrl: { $exists: true, $ne: null, $ne: '' } 
    });
    
    console.log(`\n📊 Database Summary:`);
    console.log(`📰 Total articles: ${totalArticles}`);
    console.log(`🖼️ Articles with images: ${articlesWithImages}`);
    console.log(`📈 Image coverage: ${((articlesWithImages / totalArticles) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('❌ Error fixing article images:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
}

// Run the script
if (require.main === module) {
  fixArticleImages()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { fixArticleImages };
