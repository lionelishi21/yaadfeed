require('dotenv').config();
const { MongoClient } = require('mongodb');

async function run() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const articles = await db.collection('news_items').find({}).toArray();
    
    // We just want slug, title, content
    const minimal = articles.map(a => ({
      slug: a.slug,
      title: a.title,
      content: a.content.substring(0, 300) + '...' // truncate to keep log small
    }));
    
    const fs = require('fs');
    fs.writeFileSync('articles-dump.json', JSON.stringify(minimal, null, 2));
    console.log("Dumped to articles-dump.json");
  } finally {
    await client.close();
  }
}
run();
