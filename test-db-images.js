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
    console.log(`Found ${missing.length} articles missing images.`);
    for (const m of missing.slice(0, 5)) {
      console.log(`- ${m.title} (${m.slug})`);
    }
  } finally {
    await client.close();
  }
}
run();
