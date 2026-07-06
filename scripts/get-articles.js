require('dotenv').config();
const { MongoClient } = require('mongodb');

async function run() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const articles = await db.collection('news_items').find({}).toArray();
    console.log(JSON.stringify(articles.map(a => ({ id: a._id, title: a.title, slug: a.slug, content: a.content })), null, 2));
  } finally {
    await client.close();
  }
}
run();
