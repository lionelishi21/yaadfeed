require('dotenv').config({ path: '.env' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'yardvybes';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in .env');
  process.exit(1);
}

async function updateArtistImages() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = client.db(MONGODB_DB);
    const artistsCollection = db.collection('artists');
    
    const updates = [
      { id: "burna-boy", imageUrl: "/images/burna-boy.png" },
      { id: "wizkid", imageUrl: "/images/wizkid.png" },
      { id: "david-guetta", imageUrl: "/images/david-guetta.png" },
      { id: "calvin-harris", imageUrl: "/images/calvin-harris.png" },
      { id: "shenseea", imageUrl: "/images/shenseea.png" }
    ];

    for (const update of updates) {
      const result = await artistsCollection.updateOne({ id: update.id }, { $set: { imageUrl: update.imageUrl } });
      console.log(`✅ Updated image for ${update.id} (Matched: ${result.matchedCount}, Modified: ${result.modifiedCount})`);
    }
    
    console.log('✅ Image updates completed successfully on Atlas');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  updateArtistImages()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Failed:', error);
      process.exit(1);
    });
}
