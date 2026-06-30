require('dotenv').config({ path: '.env' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'yardvybes';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in .env');
  process.exit(1);
}

async function seedMissingArtists() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = client.db(MONGODB_DB);
    const artistsCollection = db.collection('artists');
    
    const missingArtists = [
      {
        id: 'vybz-kartel',
        name: 'Vybz Kartel',
        bio: 'Adidja Azim Palmer, better known as Vybz Kartel, is a Jamaican dancehall deejay.',
        genres: ['dancehall'],
        imageUrl: '/images/vybz-kartel-artist.png',
        followers: 1500000,
        popularity: 95,
        isJamaican: true,
        isVerified: true
      },
      {
        id: 'popcaan',
        name: 'Popcaan',
        bio: 'Andrae Hugh Sutherland, known professionally as Popcaan, is a Jamaican deejay.',
        genres: ['dancehall'],
        imageUrl: '/images/popcaan.jpg',
        followers: 2100000,
        popularity: 92,
        isJamaican: true,
        isVerified: true
      },
      {
        id: 'skillibeng',
        name: 'Skillibeng',
        bio: 'Emwah Warmington, known professionally as Skillibeng, is a Jamaican dancehall DJ.',
        genres: ['dancehall', 'trap-dancehall'],
        imageUrl: '/images/skillibeng.png',
        followers: 850000,
        popularity: 88,
        isJamaican: true,
        isVerified: true
      }
    ];

    for (const artist of missingArtists) {
      const existing = await artistsCollection.findOne({ id: artist.id });
      if (existing) {
        console.log(`ℹ️ Artist ${artist.name} already exists, updating...`);
        await artistsCollection.updateOne({ id: artist.id }, { $set: artist });
      } else {
        console.log(`ℹ️ Inserting ${artist.name}...`);
        await artistsCollection.insertOne(artist);
      }
    }
    
    console.log('✅ Missing artists seeded');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

seedMissingArtists();
