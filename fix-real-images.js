const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://lionelishmael_db_user:QlyPp6dgKy9WyKCl@cluster0.peqgshw.mongodb.net/yardvybes?appName=Cluster0";

const fallbackImages = [
  '/images/burna-boy.png',
  '/images/chronixx.jpg',
  '/images/koffee.jpg',
  '/images/popcaan.jpg',
  '/images/sean-paul.jpg',
  '/images/shaggy.jpg',
  '/images/shenseea.png',
  '/images/skillibeng.jpg',
  '/images/wizkid.png',
  '/images/bob-marley.jpg',
  '/images/calvin-harris.png',
  '/images/david-guetta.png'
];

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('yardvybes');
  
  const articlesWithoutImages = await db.collection('news_items').find({ 
    $or: [{ imageUrl: { $exists: false } }, { imageUrl: null }, { imageUrl: '' }] 
  }).toArray();
  
  let count = 0;
  for (const article of articlesWithoutImages) {
    const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    await db.collection('news_items').updateOne(
      { _id: article._id },
      { $set: { imageUrl: randomImage } }
    );
    count++;
  }
  
  console.log('Updated articles with real fallback images:', count);
  await client.close();
}
run().catch(console.dir);
