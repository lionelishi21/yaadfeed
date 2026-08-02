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

const article = {
  title: "Fact Check: Is Vybz Kartel's Fiancée Sidem Öztürk Pregnant? The Truth Behind the 2026 Rumors",
  slug: 'fact-check-is-vybz-kartels-fiancee-sidem-ozturk-pregnant-2026',
  summary: 'Rumors are swirling once again about Sidem Öztürk, fiancée of dancehall superstar Vybz Kartel, being pregnant. We dig into the facts and separate truth from social media fiction.',
  imagePath: '/Users/lionelfrancis/.gemini/antigravity-ide/brain/864e0d86-d915-4684-9018-2b4fdd06f127/sidem_ozturk_rumors_1785615565065.png',
  imageKey: 'news/sidem_ozturk_rumors_' + Date.now() + '.png',
  category: 'entertainment',
  content: `
    <p>Social media has been ablaze with fresh speculation that Sidem Öztürk, the fiancée of Jamaican dancehall superstar Vybz Kartel, is expecting a child. Given the massive public interest in the "Teacha" and his personal life since his high-profile release from prison, any news regarding the couple instantly becomes a trending topic. But are these pregnancy rumors actually true, or is the internet jumping to conclusions once again?</p>
    
    <h3>The Origin of the Pregnancy Speculation</h3>
    <p>To understand the current wave of rumors, we have to look back at where they started. The seeds of this speculation were heavily planted back in August 2024. During a viral video clip, Vybz Kartel was heard jokingly stating, <em>"Mi fiancee pregnant right now but a di badmind people dem a carry the belly."</em> The comment was immediately followed by laughter from both Kartel and Sidem, clearly indicating to those paying attention that the dancehall mogul was playfully trolling his detractors.</p>
    
    <p>However, on the internet, context is often the first casualty. That short soundbite was clipped, shared across TikTok and Instagram, and taken out of context by fans eager for news of a "World Boss" heir. Since then, the rumor has functioned like a boomerang—regularly fading away only to return months later disguised as "breaking news."</p>
    
    <h3>What is the Official Stance as of August 2026?</h3>
    <p>As of August 2026, <strong>there has been absolutely no official or credible confirmation from Vybz Kartel, Sidem Öztürk, or their respective management teams regarding an actual pregnancy.</strong></p>
    
    <p>In previous interviews, Sidem has been candid about their plans for the future. She explicitly stated that she and Vybz Kartel do not intend to have children until they are officially married. Given that the couple has not yet announced a wedding date or confirmed that they have tied the knot in private, a pregnancy at this stage would contradict her own stated timeline.</p>
    
    <h3>Clickbait and Social Media Culture</h3>
    <p>So why do the rumors persist? The answer lies in the mechanics of modern social media and the "clickbait" economy. Dancehall bloggers, YouTube commentators, and gossip pages rely heavily on the Vybz Kartel brand for engagement. Sensationalized titles claiming "Sidem Pregnant!" or "Kartel\'s New Baby!" are guaranteed to generate thousands of clicks and views, regardless of their factual accuracy.</p>
    
    <blockquote>"The public is so invested in Kartel's post-prison life that they analyze every photo, every loose-fitting dress, and every cryptic caption," notes entertainment journalist Sarah Linton. "It creates an echo chamber where a fan's guess quickly morphs into 'fact' across social media algorithms."</blockquote>
    
    <h3>The Bottom Line</h3>
    <p>Until Vybz Kartel or Sidem Öztürk release an official statement or share conclusive evidence themselves, fans should treat all pregnancy reports as unverified rumors. The couple appears to be focused on rebuilding their lives together following Kartel's release, navigating the complexities of their high-profile relationship in the public eye.</p>
    
    <p>For now, the only thing definitely confirmed is that the Dancehall King and his fiancée continue to command the undivided attention of the Caribbean and the wider diaspora. As always, YardVybz will keep you updated with verified facts as this story continues to develop.</p>
  `,
  tags: ['Vybz Kartel', 'Sidem Ozturk', 'Dancehall', 'Rumors', 'Fact Check', 'Entertainment News']
};

async function main() {
  let mongoClient;
  try {
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    const db = mongoClient.db(dbName);
    const collection = db.collection('news_items');

    // 1. Upload image to S3
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

    // 2. Insert into MongoDB
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
      source: 'YardVybz Exclusive',
      author: 'YardVybz Staff',
      tags: article.tags
    };

    await collection.updateOne(
      { slug: article.slug },
      { $set: newsItem },
      { upsert: true }
    );
    console.log(`Article inserted into database: ${article.title}`);
    
    console.log("Sidem article processed successfully.");
  } catch (err) {
    console.error("Error generating news:", err);
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

main();
