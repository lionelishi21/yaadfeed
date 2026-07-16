const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://lionelishmael_db_user:QlyPp6dgKy9WyKCl@cluster0.peqgshw.mongodb.net/yardvybes?appName=Cluster0";
async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('yardvybes');
  const result = await db.collection('news_items').updateMany(
    { $or: [{ imageUrl: { $exists: false } }, { imageUrl: null }, { imageUrl: '' }] },
    { $set: { imageUrl: '/images/placeholder-general.jpg' } }
  );
  console.log('Updated articles:', result.modifiedCount);
  await client.close();
}
run().catch(console.dir);
