const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://lionelishmael_db_user:QlyPp6dgKy9WyKCl@cluster0.peqgshw.mongodb.net/yardvybes?appName=Cluster0";
async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('yardvybes');
  const news = await db.collection('news_items').find({}).sort({publishedAt:-1}).limit(5).toArray();
  console.log(news.map(n => ({ title: n.title, imageUrl: n.imageUrl })));
  await client.close();
}
run().catch(console.dir);
