require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { MongoClient } = require('mongodb');

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'yardvybes';
const bucketName = 'yaadfeed-news-media-1785480321';

const articles = [
  {
    title: "Dream Weekend 2026: The Ultimate Guide to Jamaica's Biggest Summer Party",
    slug: 'dream-weekend-2026-jamaica-summer-party-guide',
    summary: 'Everything you need to know about Dream Weekend 2026 in Montego Bay. Discover the top events, hottest artists, and why this is the must-attend Jamaican party of the summer.',
    imagePath: '/Users/lionelfrancis/.gemini/antigravity-ide/brain/864e0d86-d915-4684-9018-2b4fdd06f127/dream_weekend_2026_1785634994484.png',
    imageKey: 'news/dream_weekend_2026_' + Date.now() + '.png',
    category: 'entertainment',
    content: `
      <p>As August rolls in, all roads in Jamaica lead to one destination for entertainment lovers: Montego Bay. The highly anticipated <strong>Dream Weekend 2026</strong> has officially kicked off, cementing its status as the Caribbean's premier party series. Whether you are a local reveler or flying in from the diaspora, this five-day festival is the undeniable highlight of the "Emancipendence" season.</p>
      
      <h3>What Makes Dream Weekend 2026 Unmissable?</h3>
      <p>Since its inception, Dream Weekend has set the gold standard for destination events. This year, organizers have promised a production level that surpasses previous years, blending world-class musical performances with luxury VIP experiences.</p>
      
      <p>The festival is famous for its diverse lineup of themed events. From the high-energy daytime beach parties to the sophisticated all-white night galas, there is a vibe curated for every type of partygoer. The core appeal of <strong>Dream Weekend 2026</strong> lies in its seamless fusion of dancehall, soca, hip-hop, and afrobeat, ensuring the dancefloor never cools down.</p>
      
      <h3>Top Artists and Entertainment</h3>
      <p>While the celebrity guest list is always a closely guarded secret until the last minute, attendees can expect performances from the absolute elite of Jamaican music. Top-tier dancehall artists, internationally renowned DJs, and surprise international acts are slated to touch the stage.</p>
      
      <ul>
        <li><strong>Daytime Beach Raves:</strong> High-energy sets with sand between your toes.</li>
        <li><strong>Food Inclusive Experiences:</strong> Taste authentic Jamaican jerk and premium culinary offerings.</li>
        <li><strong>VIP Cabanas:</strong> For those looking for an exclusive, bottle-service experience.</li>
      </ul>
      
      <blockquote>"Dream Weekend isn't just a party; it's a cultural phenomenon that brings the global Jamaican diaspora together in one place," says event coordinator Mark Harris.</blockquote>
      
      <h3>Planning Your Trip to Montego Bay</h3>
      <p>If you are heading down for <strong>Dream Weekend 2026</strong>, preparation is key. Hotels and Airbnbs in Montego Bay and surrounding parishes are completely booked out months in advance. Attendees are encouraged to utilize the official shuttle services provided by the organizers to navigate the heavy traffic between venues.</p>
      
      <p>As the beats drop and the rum flows this weekend, Montego Bay will undoubtedly be the entertainment capital of the Caribbean. Stay tuned to YaadFeed for exclusive photo galleries and reviews of the biggest events from the weekend!</p>
    `,
    tags: ['Dream Weekend 2026', 'Jamaica', 'Montego Bay', 'Entertainment', 'Party', 'Emancipendence']
  }
];

async function main() {
  let mongoClient;
  try {
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    const db = mongoClient.db(dbName);
    const collection = db.collection('news_items');

    for (const article of articles) {
      console.log(`Uploading image for ${article.title}...`);
      const fileContent = fs.readFileSync(article.imagePath);
      
      const uploadParams = {
        Bucket: bucketName,
        Key: article.imageKey,
        Body: fileContent,
        ContentType: 'image/png'
      };

      await s3Client.send(new PutObjectCommand(uploadParams));
      const s3Url = `https://${bucketName}.s3.us-east-1.amazonaws.com/${article.imageKey}`;
      console.log(`Image uploaded successfully: ${s3Url}`);

      const now = new Date();
      const newsItem = {
        title: article.title,
        slug: article.slug,
        url: `https://yardvybz.news/news/${article.slug}`,
        summary: article.summary,
        content: article.content,
        category: article.category,
        imageUrl: s3Url,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
        source: 'SEO Autopilot',
        author: 'YardVybz Staff',
        tags: article.tags
      };

      await collection.updateOne(
        { slug: article.slug },
        { $set: newsItem },
        { upsert: true }
      );
      console.log(`Article inserted into database: ${article.title}`);
    }
    
    console.log("SEO Autopilot articles processed successfully.");
  } catch (err) {
    console.error("Error generating news:", err);
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

main();
