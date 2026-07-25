require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("No MONGODB_URI found");
    process.exit(1);
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('yardvybes');
    const news = db.collection('news_items');
    
    const missing = await news.find({ $or: [{ imageUrl: null }, { imageUrl: "" }, { imageUrl: { $exists: false } }] }).toArray();
    
    console.log(`Found ${missing.length} articles missing images. Updating with placeholders...`);
    
    let updatedCount = 0;
    for (const article of missing) {
      const category = article.category || 'general';
      const placeholder = `/images/placeholder-${category}.jpg`;
      
      const result = await news.updateOne(
        { _id: article._id },
        { $set: { imageUrl: placeholder, updatedAt: new Date() } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`Updated "${article.title}" with placeholder: ${placeholder}`);
        updatedCount++;
      }
    }
    
    console.log(`Successfully updated ${updatedCount} articles in the database.`);
  } finally {
    await client.close();
  }
}
run();
