require('dotenv').config();
const { MongoClient } = require('mongodb');

async function run() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const count = await db.collection('news_items').countDocuments({});
    console.log("Total articles:", count);
  } finally {
    await client.close();
  }
}
run();
