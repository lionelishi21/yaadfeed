#!/usr/bin/env node

/**
 * Database Inspection Script
 * Checks what's stored in the YaadFeed MongoDB database
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'yaadfeed';

async function checkDatabase() {
  let client;
  
  try {
    console.log('🔍 Checking YaadFeed Database...');
    console.log('================================');
    
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(MONGODB_DB);
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📚 Collections found:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Check each collection for content
    for (const collection of collections) {
      console.log(`\n🔍 Checking collection: ${collection.name}`);
      console.log('─'.repeat(50));
      
      const col = db.collection(collection.name);
      const count = await col.countDocuments();
      console.log(`Total documents: ${count}`);
      
      if (count > 0) {
        // Get a sample document to see structure
        const sample = await col.findOne();
        console.log('Sample document structure:');
        console.log(JSON.stringify(sample, null, 2));
        
        // If it's news_items, check for images
        if (collection.name === 'news_items') {
          const withImages = await col.countDocuments({ 
            imageUrl: { $exists: true, $ne: "", $type: "string" }
          });
          const withoutImages = count - withImages;
          console.log(`\n📸 Images in news: ${withImages} with images, ${withoutImages} without images`);
          
          // Show some articles with images
          const articlesWithImages = await col.find({ 
            imageUrl: { $exists: true, $ne: "", $type: "string" }
          }).limit(3).toArray();
          
          if (articlesWithImages.length > 0) {
            console.log('\n📰 Sample articles with images:');
            articlesWithImages.forEach((article, i) => {
              console.log(`  ${i + 1}. ${article.title}`);
              console.log(`     Image: ${article.imageUrl}`);
            });
          }
        }
        
        // If it's users, check for admin users
        if (collection.name === 'users') {
          const adminUsers = await col.find({ role: 'admin' }).toArray();
          console.log(`\n👤 Admin users: ${adminUsers.length}`);
          adminUsers.forEach(user => {
            console.log(`  - ${user.email} (${user.name})`);
          });
        }
      }
    }
    
    // Check for any menu-related collections
    const menuCollections = collections.filter(col => 
      col.name.toLowerCase().includes('menu') || 
      col.name.toLowerCase().includes('navigation') ||
      col.name.toLowerCase().includes('category')
    );
    
    if (menuCollections.length > 0) {
      console.log('\n🍽️ Menu-related collections found:');
      for (const menuCol of menuCollections) {
        const col = db.collection(menuCol.name);
        const menuItems = await col.find({}).toArray();
        console.log(`\n📋 ${menuCol.name}:`);
        menuItems.forEach(item => {
          console.log(`  - ${item.name || item.title}${item.imageUrl ? ` (has image: ${item.imageUrl})` : ''}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the check
checkDatabase(); 