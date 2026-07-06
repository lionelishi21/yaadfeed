require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set in .env");
    return;
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const collections = await db.listCollections().toArray();
    
    const backupDir = path.join(__dirname, '..', 'database_backup_' + Date.now());
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    
    for (const collInfo of collections) {
      const collName = collInfo.name;
      const data = await db.collection(collName).find({}).toArray();
      const filePath = path.join(backupDir, collName + '.json');
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Backed up collection: ${collName} (${data.length} documents) to ${filePath}`);
    }
    console.log(`\nBackup successfully created at: ${backupDir}`);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
run();
