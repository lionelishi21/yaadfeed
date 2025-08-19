const { MongoClient } = require('mongodb');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yaadfeed';

async function generateMissingImages() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const newsCollection = db.collection('news_items');
    
    // Find all articles with placeholder images
    const articlesWithPlaceholders = await newsCollection.find({
      imageUrl: { $regex: /^\/images\/placeholder-/ }
    }).toArray();
    
    console.log(`📸 Found ${articlesWithPlaceholders.length} articles with placeholder images`);
    
    if (articlesWithPlaceholders.length === 0) {
      console.log('🎉 No placeholder images found! All articles have AI-generated images.');
      return;
    }
    
    // Generate AI images for each article
    for (let i = 0; i < articlesWithPlaceholders.length; i++) {
      const article = articlesWithPlaceholders[i];
      
      try {
        console.log(`\n🔄 Processing article ${i + 1}/${articlesWithPlaceholders.length}: ${article.title?.substring(0, 60)}...`);
        console.log(`   Category: ${article.category}`);
        console.log(`   Current imageUrl: ${article.imageUrl}`);
        
        // Call the image generation API
        const response = await fetch('http://localhost:4000/api/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: `Create a vibrant, engaging image representing ${article.category} in Jamaica. The image should be colorful, modern, and capture the essence of Jamaican ${article.category} culture and lifestyle.`,
            category: article.category,
            articleId: article._id.toString(),
            title: article.title
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          console.log(`✅ Generated AI image for: ${article.title?.substring(0, 50)}`);
          console.log(`   New imageUrl: ${result.imageUrl}`);
        } else {
          console.log(`❌ Failed to generate image for: ${article.title?.substring(0, 50)}`);
          console.log(`   Error: ${result.error}`);
        }
        
        // Add a small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ Error processing article: ${article.title}`, error);
      }
    }
    
    console.log('\n🎉 Completed generating AI images for all placeholder articles!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

// Run the script
if (require.main === module) {
  generateMissingImages()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { generateMissingImages }; 