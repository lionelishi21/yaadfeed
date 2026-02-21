const { MongoClient } = require('mongodb');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yaadfeed';

async function replaceUnsplashImages() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const newsCollection = db.collection('news_items');
    
    // Find all articles with Unsplash images
    const articlesWithUnsplash = await newsCollection.find({
      imageUrl: { $regex: /unsplash\.com/ }
    }).toArray();
    
    console.log(`📸 Found ${articlesWithUnsplash.length} articles with Unsplash images`);
    
    if (articlesWithUnsplash.length === 0) {
      console.log('🎉 No Unsplash images found! All images are already AI-generated or using placeholders.');
      return;
    }
    
    // Process each article
    for (let i = 0; i < articlesWithUnsplash.length; i++) {
      const article = articlesWithUnsplash[i];
      
      try {
        console.log(`🎨 Processing article ${i + 1}/${articlesWithUnsplash.length}: ${article.title?.substring(0, 50)}...`);
        
        // Call the image generation API
        const response = await fetch('http://localhost:3000/api/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: article.title || `Jamaica ${article.category || 'general'}`,
            category: article.category || 'general',
            keywords: article.keywords || getCategoryKeywords(article.category || 'general'),
            summary: article.summary || '',
            forceGenerate: true
          }),
        });
        
        if (response.ok) {
          const result = await response.json();
          
          if (result.success) {
            // Update the article with the new AI-generated image
            await newsCollection.updateOne(
              { _id: article._id },
              { 
                $set: { 
                  imageUrl: result.imageUrl,
                  updatedAt: new Date(),
                  imageStatus: 'ai_generated'
                }
              }
            );
            
            console.log(`✅ Updated image for: ${article.title?.substring(0, 50)}`);
          } else {
            console.log(`❌ Failed to generate image for: ${article.title?.substring(0, 50)}`);
          }
        } else {
          console.log(`❌ API call failed for: ${article.title?.substring(0, 50)}`);
        }
        
        // Delay to respect API limits
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ Error processing article: ${article.title}`, error);
      }
    }
    
    console.log('🎉 Completed replacing Unsplash images with AI-generated images!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

// Helper function to get category keywords
function getCategoryKeywords(category) {
  const categoryMap = {
    'sports': ['sports', 'jamaica', 'athletic', 'competition'],
    'politics': ['government', 'building', 'professional', 'jamaica'],
    'business': ['business', 'office', 'success', 'jamaica'],
    'entertainment': ['party', 'celebration', 'fun', 'jamaica'],
    'health': ['health', 'medical', 'wellness', 'jamaica'],
    'education': ['education', 'school', 'learning', 'jamaica'],
    'culture': ['culture', 'art', 'heritage', 'jamaica'],
    'music': ['music', 'reggae', 'jamaica', 'dancehall'],
    'dancehall': ['dancehall', 'music', 'jamaica', 'reggae'],
    'general': ['jamaica', 'tropical', 'caribbean', 'island']
  };

  return categoryMap[category?.toLowerCase()] || categoryMap['general'];
}

// Run the script
if (require.main === module) {
  replaceUnsplashImages()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { replaceUnsplashImages }; 