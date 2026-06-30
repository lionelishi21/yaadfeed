const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yaadfeed';

async function seedNewArtists() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const artistsCollection = db.collection('artists');
    
    const newArtists = [
      {
        id: "burna-boy",
        name: "Burna Boy",
        genres: ["afrobeats", "dancehall", "reggae"],
        popularity: 98,
        followers: 12000000,
        imageUrl: "/images/placeholder-music.jpg",
        bio: "Grammy award-winning Afrobeats superstar hailing from Nigeria.",
        isVerified: true
      },
      {
        id: "wizkid",
        name: "Wizkid",
        genres: ["afrobeats"],
        popularity: 95,
        followers: 10000000,
        imageUrl: "/images/placeholder-entertainment.jpg",
        bio: "One of Nigeria's biggest exports, bringing Afrobeats to the global stage.",
        isVerified: true
      },
      {
        id: "david-guetta",
        name: "David Guetta",
        genres: ["european-dance", "edm", "pop"],
        popularity: 92,
        followers: 25000000,
        imageUrl: "/images/placeholder-music.jpg",
        bio: "Legendary European dance and EDM DJ/producer.",
        isVerified: true
      },
      {
        id: "calvin-harris",
        name: "Calvin Harris",
        genres: ["european-dance", "edm"],
        popularity: 90,
        followers: 18000000,
        imageUrl: "/images/placeholder-entertainment.jpg",
        bio: "Scottish DJ, record producer, singer, and songwriter known for electronic dance music.",
        isVerified: true
      },
      {
        id: "sean-paul",
        name: "Sean Paul",
        genres: ["caribbean", "dancehall", "reggae"],
        popularity: 96,
        followers: 15000000,
        imageUrl: "/images/sean-paul.jpg",
        bio: "Jamaican dancehall rapper, singer and record producer, one of the genre's most prolific artists.",
        isVerified: true
      },
      {
        id: "shenseea",
        name: "Shenseea",
        genres: ["caribbean", "dancehall", "pop"],
        popularity: 88,
        followers: 6500000,
        imageUrl: "/images/placeholder-entertainment.jpg",
        bio: "Rising Jamaican dancehall artist making waves internationally.",
        isVerified: true
      },
      {
        id: "shaggy",
        name: "Shaggy",
        genres: ["caribbean", "reggae", "dancehall"],
        popularity: 94,
        followers: 8000000,
        imageUrl: "/images/shaggy.jpg",
        bio: "Iconic Jamaican-American reggae musician, singer, DJ, and actor.",
        isVerified: true
      }
    ];

    for (const artist of newArtists) {
      const existing = await artistsCollection.findOne({ id: artist.id });
      if (existing) {
        console.log(`ℹ️ Artist ${artist.name} already exists, updating...`);
        await artistsCollection.updateOne({ id: artist.id }, { $set: artist });
      } else {
        console.log(`ℹ️ Inserting ${artist.name}...`);
        await artistsCollection.insertOne(artist);
      }
    }
    
    console.log('✅ Seeding of new artists completed');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  seedNewArtists()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Failed:', error);
      process.exit(1);
    });
}

module.exports = { seedNewArtists };
