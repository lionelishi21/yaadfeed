require('dotenv').config({ path: '.env' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'yardvybes';

async function checkSpotlights() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(MONGODB_DB);
    const spotlights = await db.collection('artistSpotlights').find().sort({ createdAt: -1 }).limit(5).toArray();
    console.log("Recent Spotlights:");
    spotlights.forEach(s => console.log(`- ${s.artistName}: ${s.imageUrl}`));
  } finally {
    await client.close();
  }
}

checkSpotlights();
