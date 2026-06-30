require('dotenv').config({ path: '.env' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'yardvybes';

async function checkPopcaan() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(MONGODB_DB);
    const artists = await db.collection('artists').find({ name: 'Popcaan' }).toArray();
    console.log("Popcaan docs:");
    console.log(JSON.stringify(artists, null, 2));
  } finally {
    await client.close();
  }
}

checkPopcaan();
