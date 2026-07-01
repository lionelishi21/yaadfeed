require('dotenv').config();
const { connectToDatabase } = require('../src/lib/mongodb');

async function main() {
  const { db } = await connectToDatabase();
  const res = await db.collection('news_items').deleteMany({});
  console.log(`Deleted ${res.deletedCount} articles.`);
  process.exit(0);
}
main();
