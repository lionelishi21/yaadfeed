const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '', // Make sure this is in your env if using real S3
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
});

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is missing in .env");
  process.exit(1);
}

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('yardvybes');
    const collection = db.collection('news_items');

    const imagePath = '/Users/lionelfrancis/.gemini/antigravity-ide/brain/b212b7c9-7dba-4cb2-b025-d71993844884/vybz_kartel_stage_return_1786454196535.png';
    const imageKey = `news/vybz_kartel_return_${Date.now()}.png`;

    // Try to upload to S3 if credentials exist
    let imageUrl = '';
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      console.log('Uploading image to S3...');
      const imageBuffer = fs.readFileSync(imagePath);
      await s3.send(new PutObjectCommand({
        Bucket: 'yaadfeed-news-media-1785480321',
        Key: imageKey,
        Body: imageBuffer,
        ContentType: 'image/png',
        ACL: 'public-read'
      }));
      imageUrl = `https://yaadfeed-news-media-1785480321.s3.us-east-1.amazonaws.com/${imageKey}`;
      console.log('Image uploaded:', imageUrl);
    } else {
      console.log('No AWS credentials found, using local/placeholder path.');
      imageUrl = '/images/jamaica-tourism.jpg'; // fallback
    }

    const title = "Vybz Kartel's Unprecedented Impact on Modern Dancehall and the Excitement Surrounding His Triumphant Return";
    const slug = "vybz-kartel-impact-modern-dancehall-return";
    
    // An article at least 1000 words long
    const content = `
      <p>In the vibrant, pulsating heart of Jamaica's music scene, one name continues to echo through the streets of Kingston and across the globe with undeniable authority: Vybz Kartel. Born Adidja Azim Palmer, the "Worl' Boss" has transcended the boundaries of traditional dancehall to become a cultural phenomenon, an architectural pillar of modern Caribbean music, and an enduring symbol of artistic resilience. Even during his prolonged absence from the physical stage, Kartel's influence has not waned; rather, it has expanded, morphing into a mythic presence that continues to dictate the cadence, slang, and stylistic evolution of the genre.</p>
      
      <h3>The Genesis of a Dancehall Titan</h3>
      <p>To understand Vybz Kartel's impact, one must look back at his meteoric rise in the early 2000s. Emerging as a protégé of Bounty Killer, Kartel quickly distinguished himself with a lyrical dexterity that was unparalleled. His ability to weave complex metaphors with raw, unvarnished street narratives revolutionized dancehall lyricism. He didn't just sing about the ghetto; he painted vivid, visceral portraits of it. Songs like "Picture This" and "Tek Buddy" showcased a controversial yet undeniably brilliant penmanship that captivated the masses.</p>
      <p>Kartel's early career was marked by his fierce rivalry with Mavado, an era that defined the "Gaza vs. Gully" feud. This wasn't merely a musical clash; it was a cultural division that swept across Jamaica and the diaspora. The rivalry pushed both artists to their creative limits, resulting in a prolific output of music that remains foundational to modern dancehall. It demonstrated Kartel's ability to command an army of loyal followers, the Gaza Nation, whose devotion is comparable to the fanaticism seen in global pop culture phenomena.</p>

      <h3>Redefining the Sound and Slang of Jamaica</h3>
      <p>Beyond his musical output, Vybz Kartel is a linguistic innovator. He has single-handedly injected dozens of phrases into the Jamaican vernacular, which have subsequently permeated global pop culture. Words and phrases like "Up to the time," "Gaza," "Teacha," and "Fierce" were popularized through his tracks and quickly adopted by youth worldwide. His influence on language highlights the profound connection he shares with the streets—a connection that remains authentic despite his immense fame.</p>
      <p>Musically, Kartel was instrumental in shifting the tempo and rhythmic structure of dancehall. He embraced electronic influences, auto-tune, and unconventional beats long before they became industry standards. His willingness to experiment paved the way for the current generation of dancehall artists, who seamlessly blend Caribbean sounds with hip-hop, Afrobeat, and EDM. Artists like Popcaan, who was directly mentored by Kartel, and others like Skillibeng and Masicka, openly acknowledge the "Teacha's" influence on their sound and career trajectories.</p>

      <h3>The Phenomenon of Incarceration and Unstoppable Output</h3>
      <p>Perhaps the most astonishing aspect of Vybz Kartel's career is his productivity following his incarceration in 2011. While a prison sentence would spell the end for most artists, for Kartel, it seemed to serve as a bizarre crucible for boundless creativity. Through means that have long been the subject of speculation and legend, Kartel continued to release a staggering volume of music from behind bars. Hits like "Fever," "Any Weather," and "Mhm Hm" dominated the airwaves, clubs, and sound systems globally.</p>
      <p>This relentless output ensured that his presence was felt in every corner of the dancehall world. He remained a staple on Billboard charts and international playlists, proving that his talent could not be confined by physical walls. This era of his career solidified his status as a legendary figure—an artist whose voice was so powerful it transcended his physical reality.</p>

      <h3>The Cultural Shift: Bleaching and Controversy</h3>
      <p>It is impossible to discuss Vybz Kartel without addressing the controversies that have shadowed his career. His decision to lighten his skin, commonly known as bleaching, sparked intense national and international debate regarding colorism, self-hate, and beauty standards in post-colonial Jamaica. Kartel addressed this directly in his music with songs like "Coloring Book," turning a deeply sociological issue into a cultural talking point.</p>
      <p>While many criticized him, others saw it as a provocative statement on identity and the complex realities of race in Jamaica. Kartel's ability to remain at the center of cultural discourse, whether through his music, his appearance, or his legal battles, is a testament to his magnetic, polarizing persona. He forces society to confront uncomfortable truths, mirroring the raw reality of the environment that shaped him.</p>

      <h3>The Anticipation of a Triumphant Return</h3>
      <p>Recent developments regarding his legal status have sent shockwaves of anticipation through the music world. The possibility of Vybz Kartel returning to the stage has ignited a frenzy among fans and industry insiders alike. The prospect of a "Worl' Boss" concert in Kingston is not merely viewed as a musical event; it is anticipated as a historic cultural milestone.</p>
      <p>Imagine the scene: the National Stadium in Kingston packed to capacity, the air thick with anticipation, the iconic Jamaican flag colors illuminating the stage. The roar of the crowd as Kartel steps out would be deafening, a collective release of over a decade of pent-up energy. Such an event would undoubtedly be the largest dancehall concert in history, drawing fans from every continent.</p>
      <p>A triumphant return would also have significant implications for the genre itself. It would serve as a massive injection of adrenaline into the Jamaican music industry, potentially shifting the global spotlight back to Kingston in a major way. It would provide an opportunity for Kartel to physically interact with the generation of artists he influenced from afar, potentially sparking collaborations that could define the next decade of Caribbean music.</p>

      <h3>The Global Footprint of the Worl' Boss</h3>
      <p>Kartel's influence extends far beyond the shores of Jamaica. International superstars like Drake, Rihanna, and Major Lazer have drawn heavily from his sound and style. Drake's "Controlla" and Rihanna's "Work" owe a significant debt to the rhythmic templates popularized by Kartel. He has collaborated with major international acts, proving that his brand of authentic, unfiltered dancehall has universal appeal.</p>
      <p>His music is a staple in clubs from London to Tokyo, New York to Nairobi. This global reach underscores the power of his artistry. He managed to capture the essence of Jamaican street culture and package it in a way that resonates with people across diverse cultural backgrounds. It is a rare feat that only a true musical genius can accomplish.</p>

      <h3>Conclusion: The Enduring Legacy</h3>
      <p>In conclusion, Vybz Kartel is more than just a dancehall artist; he is a living legend whose impact on music and culture is immeasurable. From his unparalleled lyrical skills and linguistic innovations to his astonishing ability to remain relevant while incarcerated, Kartel has rewritten the rules of the music industry. As the world waits with bated breath for his potential return to the physical stage, one thing remains absolutely certain: the "Worl' Boss" will forever reign supreme in the annals of dancehall history. His legacy is etched in the very fabric of Jamaican culture, and his music will continue to inspire, provoke, and entertain for generations to come. The return of Vybz Kartel is not just a highly anticipated concert; it is the resurrection of a cultural icon, ready to reclaim his physical throne in a kingdom he never truly left.</p>
    `;

    const article = {
      title,
      slug,
      url: `https://www.yardvybz.news/news/${slug}`,
      summary: "An in-depth look at Vybz Kartel's immense influence on dancehall, his enduring legacy, and the global anticipation surrounding his potential return to the stage.",
      content: content,
      category: 'entertainment',
      imageUrl,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'YardVybz Exclusive',
      author: 'YardVybz Staff',
      tags: ['Vybz Kartel', 'Dancehall', 'Jamaica', 'Music', 'Entertainment'],
      status: 'published'
    };

    console.log('Inserting article into database...');
    const result = await collection.updateOne(
      { slug: article.slug },
      { $set: article },
      { upsert: true }
    );
    console.log('Article inserted successfully.', result);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

run();
