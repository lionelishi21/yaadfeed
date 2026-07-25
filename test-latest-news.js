require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function test() {
  console.log("URI:", process.env.MONGODB_URI);
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('yardvybes');
  const news = await db.collection('news_items').find({}).sort({ publishedAt: -1 }).limit(3).toArray();
  console.log(news.map(n => ({ title: n.title, publishedAt: n.publishedAt })));
  await client.close();
}
test().catch(console.error);
