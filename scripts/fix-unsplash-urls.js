const { MongoClient } = require('mongodb');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yaadfeed';

async function fixUnsplashUrls() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const newsCollection = db.collection('news_items');
    
    // Find all articles with external images (Unsplash or via.placeholder.com)
    const articlesWithExternalImages = await newsCollection.find({
      $or: [
        { imageUrl: { $regex: /unsplash\.com/ } },
        { imageUrl: { $regex: /via\.placeholder\.com/ } }
      ]
    }).toArray();
    
    console.log(`📸 Found ${articlesWithExternalImages.length} articles with external images (Unsplash or via.placeholder.com)`);
    
    if (articlesWithExternalImages.length === 0) {
      console.log('🎉 No external images found! All images are already migrated.');
      return;
    }
    
    // Replace external URLs with placeholder images
    for (let i = 0; i < articlesWithExternalImages.length; i++) {
      const article = articlesWithExternalImages[i];
      
      try {
        console.log(`🔄 Processing article ${i + 1}/${articlesWithExternalImages.length}: ${article.title?.substring(0, 50)}...`);
        console.log(`   Current imageUrl: ${article.imageUrl}`);
        
        // Create a placeholder image URL based on the article category
        const placeholderUrl = `/images/placeholder-${article.category || 'general'}.jpg`;
        
        // Update the article with the placeholder image
        await newsCollection.updateOne(
          { _id: article._id },
          { 
            $set: { 
              imageUrl: placeholderUrl,
              updatedAt: new Date(),
              imageStatus: 'placeholder',
              needsImageGeneration: true
            }
          }
        );
        
        console.log(`✅ Updated image for: ${article.title?.substring(0, 50)}`);
        console.log(`   New imageUrl: ${placeholderUrl}`);
        
      } catch (error) {
        console.error(`❌ Error processing article: ${article.title}`, error);
      }
    }
    
    console.log('🎉 Completed replacing external URLs with placeholder images!');
    console.log('💡 Next: Run the admin image generation to create AI images for these articles.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

// Run the script
if (require.main === module) {
  fixUnsplashUrls()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { fixUnsplashUrls }; 