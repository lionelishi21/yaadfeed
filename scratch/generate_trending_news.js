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
    title: "Jamaica 64: Inside the Independence Village Celebrations in Kingston",
    slug: 'jamaica-64-independence-village-celebrations-kingston',
    summary: 'Jamaica is marking its 64th Independence with massive cultural celebrations at the National Stadium Complex. Experience the sights, sounds, and vibrant energy of Emancipendence.',
    imagePath: '/Users/lionelfrancis/.gemini/antigravity-ide/brain/864e0d86-d915-4684-9018-2b4fdd06f127/jamaica_independence_64_1785697828315.png',
    imageKey: 'news/jamaica_independence_64_' + Date.now() + '.png',
    category: 'culture',
    content: `
      <p>The spirit of "Emancipendence" is in full swing across Jamaica as the nation celebrates 64 years of political independence. The epicenter of these vibrant national celebrations is the Independence Village, situated at the National Stadium Complex in Kingston.</p>
      
      <h3>A Hub of Culture and Heritage</h3>
      <p>Running through the first week of August, the Independence Village has transformed the National Stadium into a sprawling showcase of Jamaican heritage. Locals and tourists alike are flocking to the venue to experience the island's rich cultural tapestry.</p>
      
      <p>The village features nightly live entertainment showcasing the evolution of Jamaican music, from ska and rocksteady to modern dancehall and reggae. Traditional dance troupes, clad in vibrant national colors, are mesmerizing audiences with folk performances that trace the island's history from emancipation to the modern era.</p>
      
      <ul>
        <li><strong>Culinary Delights:</strong> Food stalls are offering authentic Jamaican cuisine, from spicy jerk chicken and pork to traditional festival and bammy.</li>
        <li><strong>Artisan Markets:</strong> Local craftsmen are displaying their work, offering visitors a chance to purchase unique, hand-crafted souvenirs.</li>
        <li><strong>Grand Gala Preview:</strong> The festivities are building up to the highly anticipated Grand Gala, promising a spectacular display of national pride.</li>
      </ul>
      
      <blockquote>"Our 64th anniversary is a testament to the resilience and unbreakable spirit of the Jamaican people," stated a government official at the opening ceremony. "The Independence Village is where we come together to celebrate who we are."</blockquote>
      
      <p>As the "Emancipendence" season continues, YaadFeed will be on the ground bringing you exclusive coverage of all the major events.</p>
    `,
    tags: ['Jamaica 64', 'Independence', 'Culture', 'Kingston', 'Emancipendence', 'Festival']
  },
  {
    title: "The Caribbean Sargassum Crisis: Mitigating the Environmental Impact",
    slug: 'caribbean-sargassum-crisis-environmental-impact-2026',
    summary: 'A massive influx of sargassum seaweed is washing up on Caribbean shores, threatening tourism and local marine ecosystems. Here is what is being done to combat the environmental crisis.',
    imagePath: '/Users/lionelfrancis/.gemini/antigravity-ide/brain/864e0d86-d915-4684-9018-2b4fdd06f127/sargassum_crisis_caribbean_1785697846810.png',
    imageKey: 'news/sargassum_crisis_caribbean_' + Date.now() + '.png',
    category: 'local',
    content: `
      <p>The pristine, white-sand beaches of the Caribbean are facing a severe environmental challenge. A record-breaking influx of brown sargassum seaweed has blanketed coastlines across the region, triggering concerns for both the tourism industry and delicate marine ecosystems.</p>
      
      <h3>The Scale of the Problem</h3>
      <p>While sargassum blooms are a natural occurrence, the scale of this year's influx is unprecedented. Satellite imagery shows massive "belts" of the seaweed drifting across the Atlantic, eventually washing ashore from Barbados to Jamaica and up to the coast of Mexico.</p>
      
      <p>When the sargassum washes ashore and begins to decompose, it releases hydrogen sulfide gas, creating a foul odor that deters tourists and residents alike. More critically, the thick mats block sunlight from reaching coral reefs and deplete oxygen levels in the water, suffocating marine life.</p>
      
      <h3>Regional Response Efforts</h3>
      <p>Governments and environmental agencies across the Caribbean are scrambling to manage the crisis. In Jamaica, local authorities and private hoteliers have deployed heavy machinery and manual labor to clear the beaches daily.</p>
      
      <ul>
        <li><strong>Innovative Solutions:</strong> Researchers are exploring ways to repurpose the seaweed, turning the nuisance into a resource. Pilot projects are testing sargassum as a base for organic fertilizers, building materials, and even biofuel.</li>
        <li><strong>Early Warning Systems:</strong> Regional bodies are investing in improved satellite tracking to provide early warnings to coastal communities, allowing them to prepare for incoming blooms.</li>
      </ul>
      
      <blockquote>"This is no longer just an aesthetic issue for tourists; it is a profound environmental and economic threat that requires a unified regional response," warned a leading marine biologist at the University of the West Indies.</blockquote>
      
      <p>As the Caribbean grapples with the immediate impacts of the sargassum crisis, the focus remains on finding sustainable, long-term solutions to protect the region's most valuable natural assets.</p>
    `,
    tags: ['Environment', 'Caribbean', 'Sargassum', 'Tourism', 'Ecology', 'Local News']
  },
  {
    title: "Historic Gold: Samantha Hall Triumphs at the Commonwealth Games",
    slug: 'historic-gold-samantha-hall-triumphs-commonwealth-games-2026',
    summary: 'Jamaican athlete Samantha Hall has made history by securing the gold medal in the women\'s discus throw at the 2026 Commonwealth Games, showcasing the island\'s dominance in field events.',
    imagePath: '/Users/lionelfrancis/.gemini/antigravity-ide/brain/864e0d86-d915-4684-9018-2b4fdd06f127/samantha_hall_discus_gold_1785697866515.png',
    imageKey: 'news/samantha_hall_discus_gold_' + Date.now() + '.png',
    category: 'sports',
    content: `
      <p>Jamaica's legacy of athletic excellence continues to expand beyond the track. In a thrilling display of power and technique, Samantha Hall has captured the gold medal in the women's discus throw at the 2026 Commonwealth Games.</p>
      
      <h3>A Historic Victory</h3>
      <p>Hall's victory is a landmark achievement for Jamaican field athletics. While the nation is globally renowned for its sprinters, Hall's success highlights the growing depth and diversity of the country's track and field program.</p>
      
      <p>Entering the competition with quiet confidence, Hall delivered a masterful performance. Her winning throw not only secured the gold but also set a new personal best and a national record, sending the Jamaican delegation and supporters back home into a frenzy of celebration.</p>
      
      <h3>Overcoming the Odds</h3>
      <p>The journey to the top of the podium was not without its challenges. Hall has battled through injuries and intense competition leading up to the Games. Her resilience and dedication to her craft were evident in her focused demeanor inside the throwing circle.</p>
      
      <ul>
        <li><strong>Technical Brilliance:</strong> Analysts praised Hall's flawless spin technique and explosive release, which allowed her to outdistance seasoned competitors from across the Commonwealth.</li>
        <li><strong>Inspiration for the Next Generation:</strong> Her victory is expected to inspire a new wave of young Jamaican athletes to pursue field events.</li>
      </ul>
      
      <blockquote>"This gold medal is for everyone who believed in me, and for Jamaica," an emotional Hall shared in her post-event interview. "We are more than just sprinters; we are complete athletes."</blockquote>
      
      <p>As the Commonwealth Games progress, Samantha Hall's historic gold will undoubtedly be remembered as one of the standout moments of the competition for Jamaica.</p>
    `,
    tags: ['Sports', 'Commonwealth Games', 'Samantha Hall', 'Athletics', 'Jamaica', 'Gold Medal']
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
        source: 'SEO Autopilot (Trending)',
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
    
    console.log("Trending SEO Autopilot articles processed successfully.");
  } catch (err) {
    console.error("Error generating news:", err);
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

main();
