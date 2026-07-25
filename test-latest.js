require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function run() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('yardvybes');
    const news = db.collection('news_items');
    
    const latest = await news.find().sort({ createdAt: -1 }).limit(10).toArray();
    console.log(`Latest 10 articles:`);
    for (const m of latest) {
      console.log(`- ${m.title} (Image: ${m.imageUrl ? 'YES' : 'NO'})`);
    }
  } finally {
    await client.close();
  }
}
run();
