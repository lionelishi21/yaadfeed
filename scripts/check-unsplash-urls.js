const { MongoClient } = require('mongodb');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yaadfeed';

async function checkUnsplashUrls() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const newsCollection = db.collection('news_items');
    
    // Find all articles with source.unsplash.com URLs
    const articlesWithSourceUnsplash = await newsCollection.find({
      imageUrl: { $regex: /source\.unsplash\.com/ }
    }).toArray();
    
    console.log(`📸 Found ${articlesWithSourceUnsplash.length} articles with source.unsplash.com URLs`);
    
    if (articlesWithSourceUnsplash.length > 0) {
      console.log('\n📰 Articles with source.unsplash.com URLs:');
      articlesWithSourceUnsplash.forEach((article, index) => {
        console.log(`${index + 1}. ${article.title?.substring(0, 60)}...`);
        console.log(`   URL: ${article.imageUrl}`);
      });
    }
    
    // Find all articles with any unsplash.com URLs
    const articlesWithAnyUnsplash = await newsCollection.find({
      imageUrl: { $regex: /unsplash\.com/ }
    }).toArray();
    
    console.log(`\n📸 Found ${articlesWithAnyUnsplash.length} articles with any unsplash.com URLs`);
    
    if (articlesWithAnyUnsplash.length > 0) {
      console.log('\n📰 Articles with any unsplash.com URLs:');
      articlesWithAnyUnsplash.forEach((article, index) => {
        console.log(`${index + 1}. ${article.title?.substring(0, 60)}...`);
        console.log(`   URL: ${article.imageUrl}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

// Run the script
if (require.main === module) {
  checkUnsplashUrls()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { checkUnsplashUrls }; 