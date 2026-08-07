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
    title: "The Systemic Roots of the Streets: What Vybz Kartel's Journey Reveals About Jamaica",
    slug: 'systemic-roots-vybz-kartel-journey-jamaica-society',
    summary: 'Beyond the music and the controversy, Vybz Kartel’s trajectory forces us to look at the uncomfortable truths about Jamaican society, systemic corruption, and predatory financial systems that trap the youth.',
    imagePath: '/Users/lionelfrancis/.gemini/antigravity-ide/brain/864e0d86-d915-4684-9018-2b4fdd06f127/vybz_kartel_systemic_roots_1785699350917.png',
    imageKey: 'news/vybz_kartel_systemic_roots_' + Date.now() + '.png',
    category: 'culture',
    content: `
      <p>When the media talks about Adidja Palmer, better known as Vybz Kartel, the narrative is often one-dimensional. They focus on the decade he spent behind bars, the murder allegations, and the undeniable violence that was deeply intertwined with his rise to power. However, to simply label Kartel as a "criminal" is to ignore the complex, systemic rot that breeds such figures. Society prepares the crime, and the criminal merely commits it.</p>
      
      <h3>Survival in a Pressurized Society</h3>
      <p>Kartel's story is the story of countless Jamaican youth. Growing up in an environment where opportunities are suffocated by systemic corruption, survival often means adapting to a brutal reality. The Jamaican societal structure, for many in the inner cities, feels designed to keep them in debt and dependent. Predatory contracts from corporations and financial institutions create a ceiling that is nearly impossible to break through using traditional means.</p>
      
      <p>In this pressurized ecosystem, the "badman" persona isn't just a choice; for many, it is a necessary armor. You have to be aggressive to survive the crushing lack of opportunity. Kartel understood this intimately. He navigated a deeply flawed system by adopting the very ruthlessness that the system itself employs against the marginalized.</p>
      
      <h3>The Media's Blind Spot</h3>
      <p>Mainstream media frequently paints a sanitized picture of Jamaica—sun, sea, and resorts. But underneath that veneer is a fierce struggle. The media is quick to condemn the violence in dancehall but painfully slow to investigate the political corruption, the lack of funding for community programs, and the predatory banking practices that lay the foundation for that violence.</p>
      
      <blockquote>"The system is designed to keep you in debt. If you don't fight back with everything you have, you become just another statistic," a local community leader noted when discussing the economic realities of the garrison communities.</blockquote>
      
      <h3>Evolution and Giving Back</h3>
      <p>What is often omitted from Kartel's narrative is his evolution. Despite his turbulent past, his time in prison and his eventual release have showcased a man attempting to leverage his immense talent not just for personal gain, but to give back. He has begun to use his platform to speak out against the very systems that try to keep the youth oppressed, advocating for education and financial literacy within his community.</p>
      
      <p>It is time for a real intervention in our culture. We need to stop looking at the symptoms—the crime and the violence—and start aggressively dismantling the root causes: the predatory financial institutions, the corrupt political structures, and the systemic lack of opportunity that forces our brightest talents into the darkest corners just to survive.</p>
    `,
    tags: ['Vybz Kartel', 'Systemic Issues', 'Jamaica', 'Culture', 'Unfiltered', 'Society']
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
        source: 'Real Talk / Uncensored',
        author: 'YardVybz Editorial',
        tags: article.tags
      };

      await collection.updateOne(
        { slug: article.slug },
        { $set: newsItem },
        { upsert: true }
      );
      console.log(`Article inserted into database: ${article.title}`);
    }
    
    console.log("Uncensored article processed successfully.");
  } catch (err) {
    console.error("Error generating news:", err);
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

main();
