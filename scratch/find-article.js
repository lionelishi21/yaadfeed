const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yaadfeed';

async function findArticle() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    const newsCollection = db.collection('news');
    
    const articles = await newsCollection.find({ tags: "Real Talk" }).limit(5).toArray();
    console.log("Found by tag Real Talk:", articles.map(a => ({ title: a.title, category: a.category, tags: a.tags, slug: a.slug })));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
findArticle();
