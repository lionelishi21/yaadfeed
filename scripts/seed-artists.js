const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yaadfeed';

async function seedArtists() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const artistsCollection = db.collection('artists');
    
    // Read sample artists data
    const sampleDataPath = path.join(__dirname, '../public/data/sample-artists.json');
    const sampleData = JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));
    
    console.log(`📚 Found ${sampleData.artists.length} sample artists`);
    
    // Clear existing artists
    await artistsCollection.deleteMany({});
    console.log('🗑️  Cleared existing artists');
    
    // Insert sample artists
    const result = await artistsCollection.insertMany(sampleData.artists);
    console.log(`✅ Inserted ${result.insertedCount} artists`);
    
    // Verify the insertion
    const totalArtists = await artistsCollection.countDocuments();
    console.log(`📊 Total artists in database: ${totalArtists}`);
    
    // Show a few sample artists
    const sampleArtists = await artistsCollection.find().limit(5).toArray();
    console.log('\n📋 Sample artists:');
    sampleArtists.forEach((artist, index) => {
      console.log(`${index + 1}. ${artist.name} - Popularity: ${artist.popularity}, Verified: ${artist.isVerified}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

// Run the script
if (require.main === module) {
  seedArtists()
    .then(() => {
      console.log('\n✅ Artist seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Artist seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedArtists };
