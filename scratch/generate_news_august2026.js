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
    title: "Historic Upset! Sunshine Girls Dethrone Australia to Reach Commonwealth Games Final",
    slug: 'sunshine-girls-defeat-australia-commonwealth-games-2026',
    summary: 'In a heart-stopping semi-final clash at the 2026 Commonwealth Games, Jamaica\'s Sunshine Girls pulled off a monumental 46-45 victory over world number one Australia.',
    imagePath: '/Users/lionelfrancis/.gemini/antigravity-ide/brain/864e0d86-d915-4684-9018-2b4fdd06f127/sunshine_girls_victory_1785628604390.png',
    imageKey: 'news/sunshine_girls_victory_' + Date.now() + '.png',
    category: 'sports',
    content: `
      <p>Glasgow, Scotland — The atmosphere inside the arena was absolutely electric as Jamaica's national netball team, the beloved Sunshine Girls, executed what is arguably one of the greatest upsets in recent netball history. In a nail-biting semi-final match at the 2026 Commonwealth Games, Jamaica edged out the world number one-ranked Australian Diamonds with a final score of 46-45.</p>
      
      <h3>A Battle to the Final Whistle</h3>
      <p>From the opening center pass, it was clear that the Sunshine Girls were not intimidated by Australia's formidable reputation. The Jamaican defensive unit, anchored by veterans and energized by young talent, applied relentless pressure, forcing crucial turnovers that kept the score agonizingly tight throughout all four quarters.</p>
      <p>The Australian team, known for their clinical precision, struggled to find their usual rhythm against the sheer physicality and aerial dominance of the Jamaican squad. As the clock ticked down in the final quarter, the score was tied. It was a clutch interception in the defensive third, followed by a lightning-fast transition down the court, that allowed Jamaica to secure the winning goal with just seconds remaining.</p>
      
      <h3>A Nation Celebrates</h3>
      <p>Back home in Jamaica, the streets erupted in celebration as the final whistle blew. Social media timelines were flooded with the gold, green, and black, as fans praised the resilience and tactical brilliance of the team.</p>
      <blockquote>"This is more than just a victory in a netball match," said a jubilant fan in Half-Way-Tree. "This is proof that when we put our minds to it and fight with that true Jamaican spirit, no giant is too big to fall."</blockquote>
      
      <h3>Looking Ahead to the Gold</h3>
      <p>This historic victory guarantees Jamaica at least a silver medal, but the Sunshine Girls have their eyes set firmly on the ultimate prize. They will now advance to the highly anticipated gold-medal match where they will face off against New Zealand.</p>
      
      <p>This triumph adds to what is already shaping up to be a spectacular Commonwealth Games for Jamaica, following the women's 4x100m relay team storming to gold on the track. As the nation rides this wave of sporting euphoria, all eyes will be glued to the screens for the final showdown. Go Sunshine Girls!</p>
    `,
    tags: ['Netball', 'Sunshine Girls', 'Commonwealth Games', 'Sports', 'Jamaica']
  },
  {
    title: "Jamaica Kicks Off 64th Independence Celebrations at the National Stadium",
    slug: 'jamaica-64th-independence-celebrations-national-stadium-2026',
    summary: 'The Independence Village at the National Stadium Complex officially opens today, marking the start of Jamaica\'s vibrant 64th Independence celebrations.',
    imagePath: '/Users/lionelfrancis/.gemini/antigravity-ide/brain/864e0d86-d915-4684-9018-2b4fdd06f127/jamaica_independence_village_1785628611220.png',
    imageKey: 'news/jamaica_independence_village_' + Date.now() + '.png',
    category: 'culture',
    content: `
      <p>Kingston, Jamaica — The vibrant colors of black, green, and gold have officially taken over the capital city as Jamaica kicks off its 64th Independence anniversary celebrations. Today, August 1st, marks the grand opening of the "Independence Village" at the National Stadium Complex, transforming the venue into the epicenter of national pride and cultural showcase.</p>
      
      <h3>A Week of "Emancipendence"</h3>
      <p>The period between Emancipation Day (August 1) and Independence Day (August 6), affectionately known as "Emancipendence," is a time of deep reflection and exuberant celebration for Jamaicans at home and in the diaspora. This year's theme focuses on unity and resilience, a poignant message as the nation continues to rebuild and thrive following the challenges of the past year.</p>
      
      <p>The Independence Village is designed to be a family-friendly hub of activity. Visitors can expect to be immersed in the rich tapestry of Jamaican culture, with daily events featuring authentic local cuisine, arts and crafts exhibitions, and live entertainment highlighting the evolution of Jamaican music from ska and rocksteady to reggae and dancehall.</p>
      
      <h3>The Festival Queen Coronation</h3>
      <p>One of the most highly anticipated events of the opening night is the Miss Jamaica Festival Queen Coronation. Contestants representing parishes across the island will compete for the coveted title, showcasing not only their beauty and poise but also their deep knowledge of Jamaican history, cultural awareness, and community involvement.</p>
      <blockquote>"The Festival Queen competition is a cornerstone of our Independence celebrations. It highlights the intelligence, cultural pride, and leadership potential of our young Jamaican women," noted a spokesperson from the Jamaica Cultural Development Commission (JCDC).</blockquote>
      
      <h3>The Grand Gala Awaits</h3>
      <p>The week-long festivities will culminate in the spectacular Independence Grand Gala on August 6th. The National Stadium will be packed to capacity for an evening of dazzling performances, synchronized dancing, and a breathtaking fireworks display that will light up the Kingston sky.</p>
      
      <p>As the nation reflects on 64 years of political independence, the energy at the Independence Village serves as a powerful reminder of Jamaica's outsized impact on global culture. Whether you are attending the events in person or tuning in via broadcast, the spirit of "Out of Many, One People" is truly alive and well this Emancipendence season.</p>
    `,
    tags: ['Independence Day', 'Emancipendence', 'Jamaica 64', 'Culture', 'Kingston']
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
    }
    
    console.log("August news articles processed successfully.");
  } catch (err) {
    console.error("Error generating news:", err);
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

main();
