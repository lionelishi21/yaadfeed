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
  title: "Emancipation Day: Honoring Our History, Breaking the Chains of Tradition, and Embracing Free Thought",
  slug: 'emancipation-day-history-breaking-traditions-free-thought',
  summary: 'As Jamaica celebrates Emancipation Day, we reflect on the historical struggles that forged our freedom, while challenging ourselves to break away from stagnant traditions and embark on a new journey of free thinking.',
  imagePath: '/Users/lionelfrancis/.gemini/antigravity-ide/brain/864e0d86-d915-4684-9018-2b4fdd06f127/emancipation_day_sunrise_1785594720172.png',
  imageKey: 'news/emancipation_day_sunrise_' + Date.now() + '.png',
  category: 'culture',
  content: `
    <p>Every August 1st, the air in Jamaica changes. It becomes heavy with the weight of our ancestry, yet profoundly lightened by the enduring spirit of resilience. Emancipation Day is not merely a date marked red on the calendar; it is a profound testament to the indomitable will of a people who refused to be defined by the chains that sought to bind them. Today, as we commemorate this monumental holiday, we must look backward to understand the depth of our journey, and look forward with the radical realization that the truest form of emancipation is the liberation of the mind.</p>
    
    <h3>The Historical Crucible: Remembering Why We Celebrate</h3>
    <p>To truly grasp the significance of Emancipation Day, we must travel back to the brutal realities of the 18th and 19th centuries. Jamaica was the jewel in the crown of the British Empire's sugar-producing colonies, an economy built entirely on the unimaginable suffering of enslaved Africans. But the human spirit cannot be permanently subjugated. The history of Jamaica is inextricably linked with a legacy of fierce resistance.</p>
    
    <p>We remember the Christmas Rebellion of 1831, led by the Baptist deacon and National Hero, Samuel Sharpe. The "Baptist War," as it was also known, mobilized an estimated 60,000 enslaved individuals. Though it was brutally suppressed, the sheer scale and intensity of the uprising sent shockwaves across the Atlantic. It forced the British Parliament to confront the untenable nature of the institution of slavery. The blood spilled by Sharpe and countless others was the catalyst that accelerated the passing of the Slavery Abolition Act in 1833.</p>
    
    <p>When full emancipation finally came on August 1, 1838—following a flawed and exploitative period of "Apprenticeship"—it was a dawn like no other. Our ancestors gathered in town squares and churches, burying the physical symbols of their bondage: the chains, the whips, the shackles. They wept, they prayed, and they sang songs of absolute deliverance. We celebrate today to honor that unimaginable transition from property to personhood.</p>
    
    <h3>The Philosophical Aspect: Tradition vs. Transformation</h3>
    <p>However, as we observe the rituals of Emancipation Day—the reading of the Proclamation, the vibrant cultural displays, the drumming that echoes our African roots—we must ask ourselves a critical philosophical question. Are we merely performing a tradition, or are we actively living out the promise of emancipation?</p>
    
    <p>Traditions are vital. They anchor us to our past and provide a shared identity. But tradition and trends exist so that they can be questioned, molded, and sometimes, broken away from. If we celebrate the breaking of physical chains while allowing our minds to remain shackled by outdated modes of thinking, generational trauma, or societal limitations, then we are not fully free.</p>
    
    <blockquote>"Emancipation from mental slavery is the only true liberation. We cannot march into the future if we are continuously looking over our shoulders, paralyzed by the ghosts of our past."</blockquote>
    
    <p>This holiday should serve as a stark reminder that today is the day for <strong>free thinking</strong>. The cycle of our past—whether it be political tribalism, economic disenfranchisement, or limiting self-beliefs—does not have to dictate the trajectory of our future. We have the inherent power to break these cycles. We must embark on a new, better journey, one defined not by what we have survived, but by what we have the capacity to build.</p>
    
    <h3>Every Jamaican is Capable</h3>
    <p>The legacy of Samuel Sharpe, Nanny of the Maroons, and Paul Bogle is not just that they fought against an empire; it is that they dared to imagine a reality that did not yet exist. They were free thinkers in an era that sought to criminalize thought itself.</p>
    
    <p>Along that same line of thinking, every single Jamaican today is capable of profound greatness. Whether you are a student in Kingston, a farmer in St. Elizabeth, or a tech entrepreneur in Montego Bay, the blood of revolutionaries runs in your veins. You are capable of creating new paradigms, building sustainable wealth, and fostering a society rooted in genuine equality and innovation.</p>
    
    <ul>
      <li><strong>Challenge the Status Quo:</strong> Do not accept that "this is just how things are." Ask why, and demand better.</li>
      <li><strong>Educate the Mind:</strong> True freedom is found in knowledge. Read widely, think critically, and reject dogma.</li>
      <li><strong>Embrace Innovation:</strong> Use the tools of the modern age to solve the age-old problems of our society.</li>
    </ul>
    
    <h3>A New Dawn</h3>
    <p>As the sun rises over the Blue Mountains this Emancipation Day, let it symbolize the dawn of a new consciousness. Let us honor the sacrifices of our forebears not just with celebrations, but with a radical commitment to progress. Break away from the trends that hold you back. Think freely, act boldly, and remember that the journey of a thousand miles begins with a single, emancipated thought.</p>
    <p>Happy Emancipation Day, Jamaica. Let us walk into our new, better journey, together and free.</p>
  `,
  tags: ['Emancipation Day', 'Jamaica', 'History', 'Philosophy', 'Culture', 'Free Thinking']
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
    
    console.log("Emancipation article processed successfully.");
  } catch (err) {
    console.error("Error generating news:", err);
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

main();
