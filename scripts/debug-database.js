const { MongoClient } = require('mongodb');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yaadfeed';

async function debugDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📚 Collections in database:');
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    // Check news_items collection
    const newsCollection = db.collection('news_items');
    const totalArticles = await newsCollection.countDocuments();
    console.log(`\n📰 Total articles in news_items: ${totalArticles}`);
    
    // Find articles with via.placeholder.com
    const articlesWithPlaceholder = await newsCollection.find({
      imageUrl: { $regex: /via\.placeholder\.com/ }
    }).toArray();
    
    console.log(`\n🔍 Found ${articlesWithPlaceholder.length} articles with via.placeholder.com URLs:`);
    
    articlesWithPlaceholder.forEach((article, index) => {
      console.log(`\n${index + 1}. Title: ${article.title?.substring(0, 60)}...`);
      console.log(`   ImageUrl: ${article.imageUrl}`);
      console.log(`   Category: ${article.category}`);
      console.log(`   ID: ${article._id}`);
    });
    
    // Find articles with unsplash.com
    const articlesWithUnsplash = await newsCollection.find({
      imageUrl: { $regex: /unsplash\.com/ }
    }).toArray();
    
    console.log(`\n🔍 Found ${articlesWithUnsplash.length} articles with unsplash.com URLs:`);
    
    articlesWithUnsplash.forEach((article, index) => {
      console.log(`\n${index + 1}. Title: ${article.title?.substring(0, 60)}...`);
      console.log(`   ImageUrl: ${article.imageUrl}`);
      console.log(`   Category: ${article.category}`);
      console.log(`   ID: ${article._id}`);
    });
    
    // Show a few sample articles
    console.log('\n📋 Sample articles (first 5):');
    const sampleArticles = await newsCollection.find().limit(5).toArray();
    sampleArticles.forEach((article, index) => {
      console.log(`\n${index + 1}. Title: ${article.title?.substring(0, 60)}...`);
      console.log(`   ImageUrl: ${article.imageUrl}`);
      console.log(`   Category: ${article.category}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

// Run the script
if (require.main === module) {
  debugDatabase()
    .then(() => {
      console.log('\n✅ Debug completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Debug failed:', error);
      process.exit(1);
    });
}

module.exports = { debugDatabase }; 