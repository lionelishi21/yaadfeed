const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yaadfeed';

async function seedVybzKartelStory() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const newsCollection = db.collection('news');
    
    // Check if the story already exists
    const existingStory = await newsCollection.findOne({ slug: 'vybz-kartel-mansion-2026' });
    
    if (existingStory) {
      console.log('ℹ️ Story already exists, updating...');
      await newsCollection.updateOne(
        { slug: 'vybz-kartel-mansion-2026' },
        {
          $set: {
            title: "Vybz Kartel: Inside The World Boss's New Mega Mansion",
            summary: "Exclusive look into the new luxurious mega mansion of Dancehall superstar Vybz Kartel.",
            content: "<h2>A New Era of Luxury</h2><p>Dancehall superstar Vybz Kartel has recently unveiled his new mega mansion in Jamaica, and it is nothing short of spectacular. The property features modern architecture, an expansive pool, and cinematic sunset views that truly embody the 'World Boss' lifestyle.</p><p>The mansion is expected to serve as a hub for his music production and a symbol of his enduring legacy in the Caribbean music scene.</p>",
            imageUrl: "/images/vybz-mansion.png",
            updatedAt: new Date(),
          }
        }
      );
      console.log('✅ Updated Vybz Kartel story');
    } else {
      console.log('ℹ️ Inserting new Vybz Kartel story...');
      await newsCollection.insertOne({
        title: "Vybz Kartel: Inside The World Boss's New Mega Mansion",
        slug: "vybz-kartel-mansion-2026",
        summary: "Exclusive look into the new luxurious mega mansion of Dancehall superstar Vybz Kartel.",
        content: "<h2>A New Era of Luxury</h2><p>Dancehall superstar Vybz Kartel has recently unveiled his new mega mansion in Jamaica, and it is nothing short of spectacular. The property features modern architecture, an expansive pool, and cinematic sunset views that truly embody the 'World Boss' lifestyle.</p><p>The mansion is expected to serve as a hub for his music production and a symbol of his enduring legacy in the Caribbean music scene.</p>",
        imageUrl: "/images/vybz-mansion.png",
        category: "entertainment",
        source: "YaadFeed Exclusive",
        url: "",
        publishedAt: new Date(),
        author: "YaadFeed Editorial",
        tags: ["Vybz Kartel", "Dancehall", "Lifestyle"],
        keywords: ["Vybz Kartel", "Mansion", "Jamaica", "Dancehall"],
        isPopular: true,
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Inserted Vybz Kartel story');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  seedVybzKartelStory()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Failed:', error);
      process.exit(1);
    });
}

module.exports = { seedVybzKartelStory };
