const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
// Override/supplement with .env.local where AWS keys are
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local'), override: true });

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is missing");
  process.exit(1);
}

const client = new MongoClient(uri);

const articlesToUpdate = [
  {
    slug: "vybz-kartel-impact-modern-dancehall-return",
    imagePath: "/Users/lionelfrancis/.gemini/antigravity-ide/brain/b212b7c9-7dba-4cb2-b025-d71993844884/vybz_kartel_stage_return_1786454196535.png",
    keyPrefix: "vybz_kartel_return"
  },
  {
    slug: "jamaica-records-20-percent-decline-murders-2026",
    imagePath: "/Users/lionelfrancis/.gemini/antigravity-ide/brain/b212b7c9-7dba-4cb2-b025-d71993844884/jamaica_safe_streets_2026_1786456395469.png",
    keyPrefix: "jamaica_safe_streets"
  },
  {
    slug: "japex-2026-jamaica-prepares-showcase-tourism-dominance",
    imagePath: "/Users/lionelfrancis/.gemini/antigravity-ide/brain/b212b7c9-7dba-4cb2-b025-d71993844884/japex_tourism_2026_1786456406654.png",
    keyPrefix: "japex_tourism"
  },
  {
    slug: "great-sonic-migration-afrobeats-dancehall-fusing-2026",
    imagePath: "/Users/lionelfrancis/.gemini/antigravity-ide/brain/b212b7c9-7dba-4cb2-b025-d71993844884/afrobeats_dancehall_fusion_1786457288109.png",
    keyPrefix: "afrobeats_dancehall_fusion"
  },
  {
    slug: "summer-unity-diaspora-festivals-transforming-us-culture-2026",
    imagePath: "/Users/lionelfrancis/.gemini/antigravity-ide/brain/b212b7c9-7dba-4cb2-b025-d71993844884/diaspora_cultural_festival_1786457299436.png",
    keyPrefix: "diaspora_cultural_festival"
  }
];

async function run() {
  try {
    await client.connect();
    const db = client.db('yardvybes');
    const collection = db.collection('news_items');

    for (const item of articlesToUpdate) {
      if (!fs.existsSync(item.imagePath)) {
        console.warn(`Image missing for ${item.slug}: ${item.imagePath}`);
        continue;
      }

      const imageKey = `news/${item.keyPrefix}_${Date.now()}.png`;
      const buffer = fs.readFileSync(item.imagePath);

      console.log(`Uploading ${imageKey} to S3...`);
      await s3.send(new PutObjectCommand({
        Bucket: 'yaadfeed-news-media-1785480321',
        Key: imageKey,
        Body: buffer,
        ContentType: 'image/png'
      }));

      const imageUrl = `https://yaadfeed-news-media-1785480321.s3.us-east-1.amazonaws.com/${imageKey}`;
      console.log(`Uploaded ${item.slug} image to: ${imageUrl}`);

      const result = await collection.updateOne(
        { slug: item.slug },
        { $set: { imageUrl: imageUrl } }
      );

      console.log(`Updated DB for ${item.slug}: ${result.modifiedCount} modified`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

run();
