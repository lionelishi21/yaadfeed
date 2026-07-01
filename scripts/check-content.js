require('dotenv').config();

async function main() {
  const { connectToDatabase } = require('../src/lib/mongodb');
  const { db } = await connectToDatabase();
  const articles = await db.collection('news_items').find({}).toArray();
  articles.forEach(a => console.log(`Title: ${a.title} | Slug: ${a.slug}`));
  process.exit(0);
}
main();
