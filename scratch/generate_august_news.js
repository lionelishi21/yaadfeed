const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
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

async function run() {
  try {
    await client.connect();
    const db = client.db('yardvybes');
    const collection = db.collection('news_items');

    // Article 1
    const img1Path = '/Users/lionelfrancis/.gemini/antigravity-ide/brain/b212b7c9-7dba-4cb2-b025-d71993844884/vybz_kartel_the_return_2026_1786684973412.png';
    const img1Key = `news/vybz_kartel_the_return_${Date.now()}.png`;
    let img1Url = '/images/jamaica-tourism.jpg';

    if (fs.existsSync(img1Path)) {
      const buffer1 = fs.readFileSync(img1Path);
      await s3.send(new PutObjectCommand({
        Bucket: 'yaadfeed-news-media-1785480321',
        Key: img1Key,
        Body: buffer1,
        ContentType: 'image/png'
      }));
      img1Url = `https://yaadfeed-news-media-1785480321.s3.us-east-1.amazonaws.com/${img1Key}`;
      console.log('Uploaded image 1 to S3:', img1Url);
    }

    const title1 = "Vybz Kartel Formally Announces 'The Return' Live Concert at Kingston National Arena for August 2026";
    const slug1 = "vybz-kartel-formally-announces-the-return-live-concert-kingston-2026";
    const content1 = `
      <p>The global dancehall community was sent into an unprecedented state of euphoria this week as Vybz Kartel officially confirmed his grand stage comeback performance, titled <strong>"The Return"</strong>, scheduled for August 29, 2026, at the iconic National Arena in Kingston, Jamaica. Following months of speculation and intense fan anticipation since his legal exoneration, the announcement marks what promises to be the single largest live music event in Caribbean history.</p>

      <h3>A Historic Milestone for Dancehall Culture</h3>
      <p>For over a decade, Vybz Kartel—born Adidja Palmer—reigned as the undisputed "Worl' Boss" of dancehall while serving time behind bars. His astounding ability to release chart-topping hit after chart-topping hit during his incarceration solidified his status as a legendary figure in modern popular music. However, the physical absence of Kartel from the live concert stage created a void that no other artist could fill.</p>
      <p>The choice of Kingston's National Arena as the venue holds deep symbolic weight. Kingston is the beating heart of reggae and dancehall culture, the birthplace of sound system culture, and the concrete jungle that shaped Kartel's distinct street lyricism. Event organizers expect fans from across North America, Europe, Africa, and the wider Caribbean to flood into Kingston, creating a historic economic boom for the island's hospitality, transport, and entertainment sectors.</p>

      <h3>The Production, Lineup, and Surprises in Store</h3>
      <p>Promoters associated with the event have hinted at a multi-million dollar production featuring state-of-the-art visual effects, pyrotechnics, and sound engineering tailored specifically for the National Arena. Sources close to the Gaza camp reveal that Kartel has been rigorously preparing alongside a full live band to deliver an extended, multi-hour performance spanning his vast discography—from early 2000s classics like "Picture This" and "Bus Mi Gun" to Gaza empire anthems like "Clarks," "Ramping Shop," and his latest 2026 hit releases.</p>
      <p>Speculation is also rife regarding guest appearances. The concert is rumored to feature surprise performances from top Gaza alumni including Popcaan, Shawn Storm, Tommy Lee Sparta, and Jah Vinci, alongside international collaborators who have drawn inspiration from Kartel's sonic legacy. The night is set to serve not just as a solo concert, but as a monumental celebration of the entire Gaza movement and its enduring impact on global pop culture.</p>

      <h3>Global Streaming and Worldwide Fan Engagement</h3>
      <p>Recognizing that millions of fans worldwide will be unable to attend in person, organizers have partnered with major international streaming platforms to broadcast "The Return" live in high-definition 4K. Pay-per-view access will allow Gaza fans from London to Lagos, Tokyo to Toronto, to experience the energy of Kingston in real-time. Interactive viewing parties are already being scheduled in major diaspora hubs including Brooklyn, Miami, Atlanta, and London.</p>

      <h3>Security, Logistics, and National Impact</h3>
      <p>Given the immense scale of the event, Jamaican security authorities and logistics teams are implementing comprehensive crowd control measures and traffic management plans around the National Stadium and Arena complex. Hotel bookings in the Kingston metropolitan area have reportedly surged to 100% capacity within 24 hours of the announcement, prompting tourism officials to praise the concert as a major catalyst for cultural tourism.</p>

      <h3>Conclusion: The Reclaiming of the Throne</h3>
      <p>As August 29 approaches, the excitement surrounding "The Return" continues to build to a fever pitch. Vybz Kartel's return to the stage represents far more than just a musical performance—it is the triumphant culmination of a decade-long saga, a testament to the power of artistic resilience, and a definitive moment when the Worl' Boss reclaims his physical throne in the home of dancehall.</p>
    `;

    const article1 = {
      title: title1,
      slug: slug1,
      url: `https://www.yardvybz.news/news/${slug1}`,
      summary: "Vybz Kartel officially confirms 'The Return' live concert at Kingston National Arena on August 29, 2026, marking a historic moment in Caribbean music history.",
      content: content1,
      category: 'entertainment',
      imageUrl: img1Url,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'YardVybz Exclusive',
      author: 'YardVybz Editorial',
      tags: ['Vybz Kartel', 'Dancehall', 'Kingston', 'Concert', 'Jamaica Music'],
      status: 'published'
    };

    // Article 2
    const img2Path = '/Users/lionelfrancis/.gemini/antigravity-ide/brain/b212b7c9-7dba-4cb2-b025-d71993844884/reggae_icon_awards_2026_1786684983691.png';
    const img2Key = `news/reggae_icon_awards_${Date.now()}.png`;
    let img2Url = '/images/jamaica-tourism.jpg';

    if (fs.existsSync(img2Path)) {
      const buffer2 = fs.readFileSync(img2Path);
      await s3.send(new PutObjectCommand({
        Bucket: 'yaadfeed-news-media-1785480321',
        Key: img2Key,
        Body: buffer2,
        ContentType: 'image/png'
      }));
      img2Url = `https://yaadfeed-news-media-1785480321.s3.us-east-1.amazonaws.com/${img2Key}`;
      console.log('Uploaded image 2 to S3:', img2Url);
    }

    const title2 = "Capleton, Wayne Wonder, and Busy Signal Honored at Jamaica 64th Independence Grand Gala in Kingston";
    const slug2 = "capleton-wayne-wonder-busy-signal-honored-jamaica-64th-independence-grand-gala-2026";
    const content2 = `
      <p>In a thrilling tribute to the architects of reggae and dancehall music, Jamaica's 64th Independence celebrations reached a spectacular high point at the National Stadium in Kingston as legendary performers <strong>Capleton</strong>, <strong>Wayne Wonder</strong>, and <strong>Busy Signal</strong> were officially presented with the prestigious Reggae Icon Award at the 2026 Grand Gala.</p>

      <h3>Celebrating Decades of Global Musical Influence</h3>
      <p>The annual Grand Gala, organized by the Jamaica Cultural Development Commission (JCDC), brings together tens of thousands of Jamaicans to honor the nation's rich history, culture, and achievements. This year’s ceremony placed a special emphasis on the global ambassadors who have propelled Jamaican music onto the world's most prestigious stages.</p>
      <p>Capleton, affectionately known as "The Prophet," was recognized for over three decades of explosive energy, spiritual consciousness, and unyielding dedication to roots reggae and dancehall. His classic anthems such as "Tour," "That Day Will Come," and "Slew Dem" remain timeless pillars of conscious Caribbean music. Receiving the award to a standing ovation, Capleton dedicated the honor to the youth of Jamaica, urging them to use music as a tool for positive empowerment and unity.</p>

      <h3>Smooth Melodies and International Crossover Success</h3>
      <p>Wayne Wonder's recognition celebrated his pivotal role in crossing dancehall over into global pop and R&B charts during the late 1990s and early 2000s. His Grammy-nominated megahit "No Letting Go" remains one of the most recognized Caribbean songs in history, helping pave the way for international airplay of dancehall music. On stage, Wayne Wonder expressed deep gratitude for the love from his homeland, performing a soulful snippet of his classic hit that had the entire stadium singing in unison.</p>
      <p>Busy Signal was awarded for his remarkable versatility, lyrical brilliance, and cross-genre mastery. From hardcore dancehall bangers like "Step Out" and "Nah Go A Jail No More" to country and reggae fusions such as "One More Night" and "Sweet Love," Busy Signal has continually pushed the creative boundaries of Jamaican music. His international collaborations with Major Lazer and European artists have further expanded reggae's global footprint.</p>

      <h3>The 2026 JCDC Festival Song Winner Announced</h3>
      <p>In addition to the Icon Awards, the Grand Gala crowned the winner of the 2026 JCDC Festival Song competition. Emerging artist <strong>dBurnz</strong> captured the coveted national title with his uplifting, high-energy anthem "I Love Jamaica." The track, which combines traditional ska horns with modern dancehall basslines, was hailed by judges and fans as a triumphant celebration of Jamaican patriotism.</p>

      <h3>Cultural Preservation and The Future of Reggae</h3>
      <p>Speaking at the event, government officials and cultural leaders reaffirmed Jamaica's commitment to supporting local creatives and preserving the authenticity of reggae music, which was designated an Intangible Cultural Heritage of Humanity by UNESCO. As the island looks ahead, the honoring of Capleton, Wayne Wonder, and Busy Signal stands as an inspiring reminder of the profound impact Jamaican culture continues to have across the globe.</p>
    `;

    const article2 = {
      title: title2,
      slug: slug2,
      url: `https://www.yardvybz.news/news/${slug2}`,
      summary: "Reggae and dancehall legends Capleton, Wayne Wonder, and Busy Signal receive the Reggae Icon Award at Jamaica's 64th Independence Grand Gala in Kingston.",
      content: content2,
      category: 'culture',
      imageUrl: img2Url,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'YardVybz Exclusive',
      author: 'YardVybz Culture Desk',
      tags: ['Capleton', 'Wayne Wonder', 'Busy Signal', 'Reggae Icon Award', 'Jamaica 64'],
      status: 'published'
    };

    console.log('Inserting 2 new articles into MongoDB...');
    await collection.updateOne({ slug: article1.slug }, { $set: article1 }, { upsert: true });
    await collection.updateOne({ slug: article2.slug }, { $set: article2 }, { upsert: true });

    console.log('Successfully inserted both articles into MongoDB!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

run();
