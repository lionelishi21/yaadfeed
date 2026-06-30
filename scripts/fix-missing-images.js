require('dotenv').config({ path: '.env' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'yardvybes';

async function fixMissingImages() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    const db = client.db(MONGODB_DB);
    const collection = db.collection('artists');

    // Update artists where imageUrl is null, undefined, or empty
    const result = await collection.updateMany(
      { $or: [{ imageUrl: null }, { imageUrl: { $exists: false } }, { imageUrl: "" }] },
      { $set: { imageUrl: '/images/placeholder-entertainment.jpg' } }
    );
    
    console.log(`✅ Fixed missing images for ${result.modifiedCount} artists!`);
  } finally {
    await client.close();
  }
}

fixMissingImages();
