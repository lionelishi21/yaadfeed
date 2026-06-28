const { MongoClient } = require('mongodb');
const uri = "mongodb://lionelishmael_db_user:QlyPp6dgKy9WyKCl@ac-f8myqru-shard-00-00.peqgshw.mongodb.net:27017,ac-f8myqru-shard-00-01.peqgshw.mongodb.net:27017,ac-f8myqru-shard-00-02.peqgshw.mongodb.net:27017/yardvybes?ssl=true&replicaSet=atlas-frmhnf-shard-0&authSource=admin&retryWrites=true&w=majority&tlsInsecure=true";
async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully!");
    const dbs = await client.db().admin().listDatabases();
    console.log(dbs.databases.map(db => db.name));
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
run();
