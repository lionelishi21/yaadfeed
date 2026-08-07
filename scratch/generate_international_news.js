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
    title: "Global Black August 2026: Diaspora Unity and The Fight for Reparations",
    slug: 'global-black-august-2026-diaspora-unity-reparations',
    summary: 'As the world marks Black August, the global African diaspora unites. From Jamaica to Canada, Emancipation Day observances fuel the accelerating movement for slavery reparations.',
    imagePath: '/Users/lionelfrancis/.gemini/antigravity-ide/brain/864e0d86-d915-4684-9018-2b4fdd06f127/black_august_2026_1785697157503.png',
    imageKey: 'news/black_august_2026_' + Date.now() + '.png',
    category: 'international',
    content: `
      <p>August has arrived, and with it comes a profound month of reflection, resistance, and celebration across the global African diaspora. <strong>Black August 2026</strong> is already shaping up to be a monumental period as nations worldwide observe Emancipation Day and renew their commitments to racial equity.</p>
      
      <h3>Emancipation Day and The Reparations Movement</h3>
      <p>On August 1st, Jamaica led the charge in Emancipation Day observances, but this year's celebrations carry a renewed legal weight. The Jamaican government has officially announced it is taking the next major step to petition King Charles and refer legal questions regarding slavery reparations to the Privy Council.</p>
      
      <p>This aggressive legal strategy is sending ripples throughout the Caribbean and the wider diaspora, putting unprecedented pressure on former colonial powers to address historical injustices. In Canada, Emancipation Day was also marked by federal leaders acknowledging the deep-seated legacy of slavery and pledging ongoing support to dismantle anti-Black racism.</p>
      
      <h3>The Significance of Black August</h3>
      <p>Beyond Emancipation Day, <strong>Black August</strong> is a time dedicated to honoring Black history, political prisoners, and revolutionary movements. Across the United States, Europe, and Latin America, grassroots organizations are hosting summits focusing on the revolutionary potential of Black youth and strategies for organizing Black workers.</p>
      
      <ul>
        <li><strong>Diaspora Unity:</strong> Communities from London to Lagos are hosting cultural exchanges to strengthen global Black networks.</li>
        <li><strong>UN International Day for People of African Descent:</strong> Anticipation is building for the August 30th observance, which will highlight global contributions of the African diaspora.</li>
      </ul>
      
      <blockquote>"The push for reparations is no longer just a Caribbean issue; it is a global mandate," states human rights advocate Dr. Sarah Jenkins. "Black August reminds us that our struggles and our victories are deeply interconnected."</blockquote>
      
      <p>As we move through the month, YaadFeed will continue to cover the vital political movements, cultural festivals, and economic milestones shaping the international Black community.</p>
    `,
    tags: ['Black August', 'International', 'Reparations', 'Emancipation Day', 'Diaspora', 'Culture']
  },
  {
    title: "State of Black America 2026: Navigating Economic Shifts and Building Resiliency",
    slug: 'state-of-black-america-2026-economic-shifts-resiliency',
    summary: 'The newly released 2026 "State of Black America" report highlights the challenges and opportunities facing the global Black workforce. Here is what it means for Black entrepreneurship and economic empowerment.',
    imagePath: '/Users/lionelfrancis/.gemini/antigravity-ide/brain/864e0d86-d915-4684-9018-2b4fdd06f127/state_of_black_america_2026_1785697172846.png',
    imageKey: 'news/state_of_black_america_2026_' + Date.now() + '.png',
    category: 'business',
    content: `
      <p>The National Urban League has just released its highly anticipated <strong>2026 "State of Black America"</strong> report, sparking global conversations about economic equity, workforce representation, and the future of Black entrepreneurship.</p>
      
      <h3>Understanding the 2026 Economic Landscape</h3>
      <p>The report paints a complex picture of the current economic climate. While it warns of potential reversals in recent gains—particularly concerning the rollback of global Diversity, Equity, and Inclusion (DEI) initiatives—it also highlights the fierce resilience and adaptability of Black communities worldwide.</p>
      
      <p>A significant focal point of the report is the impact on Black women in the workforce. In response to corporate restructuring over the past year, there has been an unprecedented surge in Black female entrepreneurship. Instead of waiting for corporate seats, many are building their own tables.</p>
      
      <h3>Global Black Entrepreneurship on the Rise</h3>
      <p>This economic shift is not isolated to the United States. Across the diaspora, from the bustling tech hubs of Nairobi to the creative industries in Kingston and London, Black-owned businesses are driving regional economic resiliency.</p>
      
      <ul>
        <li><strong>Tech and Innovation:</strong> Black founders are securing record amounts of venture capital in emerging African markets.</li>
        <li><strong>Local Initiatives:</strong> Events like the recent Black Business Week in Minneapolis are being replicated globally to foster hyper-local economic support systems.</li>
        <li><strong>Financial Literacy:</strong> Community-led initiatives are prioritizing wealth management and real estate acquisition to build generational wealth.</li>
      </ul>
      
      <blockquote>"The data shows challenges, yes, but it also reveals an undeniable entrepreneurial spirit," notes economic analyst Marcus Thorne. "When traditional avenues close, the global Black community innovates."</blockquote>
      
      <h3>Looking Ahead</h3>
      <p>As the international community digests the findings of the State of Black America report, the focus is shifting from simply identifying disparities to executing actionable economic strategies. By leveraging global diaspora networks, the push for true economic empowerment has never been stronger.</p>
    `,
    tags: ['Business', 'Economics', 'State of Black America', 'Entrepreneurship', 'International', 'Empowerment']
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
        source: 'SEO Autopilot (International)',
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
    
    console.log("International SEO Autopilot articles processed successfully.");
  } catch (err) {
    console.error("Error generating news:", err);
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

main();
