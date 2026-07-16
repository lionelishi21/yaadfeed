const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://lionelishmael_db_user:QlyPp6dgKy9WyKCl@cluster0.peqgshw.mongodb.net/yardvybes?appName=Cluster0";
async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('yardvybes');
  const countWithImages = await db.collection('news_items').countDocuments({ imageUrl: { $exists: true, $ne: null, $ne: '' } });
  const countWithoutImages = await db.collection('news_items').countDocuments({ $or: [{ imageUrl: { $exists: false } }, { imageUrl: null }, { imageUrl: '' }] });
  console.log({ countWithImages, countWithoutImages });
  
  const sampleWithImages = await db.collection('news_items').find({ imageUrl: { $exists: true, $ne: null, $ne: '' } }).sort({publishedAt:-1}).limit(2).toArray();
  console.log("Sample with images:", sampleWithImages.map(n => n.imageUrl));
  await client.close();
}
run().catch(console.dir);
