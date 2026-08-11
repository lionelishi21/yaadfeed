const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '', 
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

    const hasAwsCreds = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);

    // Article 1 (1000+ words)
    const img1Path = '/Users/lionelfrancis/.gemini/antigravity-ide/brain/b212b7c9-7dba-4cb2-b025-d71993844884/afrobeats_dancehall_fusion_1786457288109.png';
    const img1Key = `news/afrobeats_dancehall_fusion_${Date.now()}.png`;
    let img1Url = '/images/jamaica-tourism.jpg';

    if (hasAwsCreds) {
      const buffer1 = fs.readFileSync(img1Path);
      await s3.send(new PutObjectCommand({
        Bucket: 'yaadfeed-news-media-1785480321',
        Key: img1Key,
        Body: buffer1,
        ContentType: 'image/png',
        ACL: 'public-read'
      }));
      img1Url = `https://yaadfeed-news-media-1785480321.s3.us-east-1.amazonaws.com/${img1Key}`;
    }

    const title1 = "The Great Sonic Migration: How Afrobeats and Dancehall Are Fusing to Create the Sound of 2026";
    const slug1 = "great-sonic-migration-afrobeats-dancehall-fusing-2026";
    const content1 = `
      <p>The global musical landscape is undergoing a massive, unprecedented shift in 2026. What began as a subtle cross-pollination between West Africa and the Caribbean has exploded into a full-blown cultural phenomenon. The borders between Afrobeats and Dancehall are rapidly dissolving, giving rise to a unified, transnational sound that is currently dominating charts, clubs, and cultural conversations across the United States and the wider global diaspora. This is no longer about isolated collaborations; it is a structural fusion of two of the most influential genres on the planet.</p>

      <h3>The Roots of the Convergence</h3>
      <p>To understand the current explosion, one must look at the deep historical and cultural ties binding West Africa and Jamaica. The rhythms of the motherland were carried across the Atlantic, laying the foundational blueprint for Jamaican music. For decades, reggae and dancehall artists have paid homage to their African roots, while African musicians consistently cited icons like Bob Marley, Shabba Ranks, and Vybz Kartel as major inspirations. However, for a long time, the industries operated on parallel tracks. Afrobeats was solidifying its grip on the continent and the UK, while Dancehall maintained its fiery dominance in the Caribbean and the Americas.</p>
      <p>The shift began accelerating in the late 2010s and early 2020s as digital streaming flattened global access. African artists began experimenting with dancehall cadences, and Jamaican producers started infusing their riddims with the syncopated shakers and log drums characteristic of West African sounds. Today, in 2026, this experimentation has matured into a distinct, hyper-successful hybrid genre. The recording process itself has become decentralized. It is now standard practice for a track to feature vocals recorded in Lagos, a beat built in Kingston, mixing done in London, and the final master delivered from Atlanta.</p>

      <h3>Rema's Bold Pivot and the "Dark Dancehall" Movement</h3>
      <p>Perhaps the most prominent example of this current trend is the latest move by Afrobeats superstar Rema. Following a string of massive global pop-leaning hits, Rema recently shocked the industry by releasing his highly anticipated single, "TEA." Instead of continuing down the sunny, highly polished Afropop lane, "TEA" takes a sharp left turn into dark, moody, and aggressive dancehall territory. Produced by a cross-continental team including Mustard and London, the track is built on a grimy, bass-heavy riddim that wouldn't sound out of place in a late-90s Kingston street dance.</p>
      <p>Rema’s vocal delivery on the track completely abandons his usual melodic crooning for a rapid-fire, patois-inflected deejay style. The result is a staggering piece of music that has instantly ignited social media. Viral dance trends on TikTok and Instagram have propelled the track to the top of the charts, demonstrating that the global audience is hungry for this raw, unvarnished synthesis. Rema's pivot is significant because it signals to the rest of the industry that embracing the gritty edge of dancehall is not a commercial risk, but a massive opportunity.</p>

      <h3>Fireboy DML and Masicka: The Ultimate Crossover</h3>
      <p>While Rema explores the sound solo, other artists are forging powerful alliances. The recent collaboration between Nigerian vocal powerhouse Fireboy DML and Jamaican Dancehall heavyweight Masicka on the track "Claat!" perfectly encapsulates the synergy of 2026. On paper, Fireboy’s smooth, emotive R&B-infused Afrobeats style might seem at odds with Masicka’s hardcore, razor-sharp dancehall lyricism. In execution, however, it is a masterclass in contrast and balance.</p>
      <p>"Claat!" works because neither artist compromises their core identity. Fireboy delivers a sweeping, infectious hook over a beat that blends the driving snare of dancehall with the rolling shakers of Afrobeats. Masicka then anchors the track with a blistering verse that provides the necessary grit and street credibility. The song has become an inescapable anthem this summer, blaring from cars in Miami, clubs in New York, and sound systems across the diaspora. It proves that the most successful fusions happen when artists lean into their respective strengths rather than trying to mimic each other.</p>

      <h3>The Chart Dominance and the "Amapiano-Hall" Wave</h3>
      <p>The charts in August 2026 are a clear reflection of this unified sound. Playlists across major streaming platforms in the US are currently dominated by artists who seamlessly weave these influences together. Ayra Starr, for instance, continues her unstoppable run with tracks like "Where Do We Go" and "Tornado," both of which heavily feature Caribbean rhythmic structures beneath her signature Afrobeats melodies.</p>
      <p>Furthermore, we are seeing the rise of a micro-genre that some industry insiders are dubbing "Amapiano-Hall." This involves taking the deep, booming log drums and jazzy piano chords of South African Amapiano and layering them under the aggressive vocal delivery and fast-paced hi-hats of modern dancehall. Artists like Asake and CKay are at the forefront of this specific blend, creating tracks that are simultaneously hypnotic and high-energy. This constant innovation keeps the unified genre fresh and ensures its continued dominance on global dancefloors.</p>

      <h3>Beyond the Music: The Cultural Impact in the US</h3>
      <p>This sonic migration is not just happening in recording studios; it is fundamentally altering the cultural landscape in the United States. In cities with massive diaspora populations—such as New York, Miami, Atlanta, and Houston—the club scene has completely transformed. It is no longer a choice between an "Afrobeats night" or a "Reggae/Dancehall night." The most successful promoters are those who understand how to blend the two seamlessly.</p>
      <p>DJs are now required to be fluent in both genres, understanding how to transition from a Burna Boy anthem into a Skillibeng banger without losing the energy of the room. This has created a new, shared cultural space where young people of Caribbean and African descent are partying together, recognizing their shared musical DNA. It is a powerful form of cultural diplomacy occurring on the dancefloor.</p>

      <h3>The Future of the Fusion</h3>
      <p>As we look towards the end of 2026 and beyond, the fusion of Afrobeats and Dancehall shows no signs of slowing down. Major labels in the US are actively seeking out artists who can straddle both worlds, realizing that this is the new standard for global pop music. We can expect to see more joint EPs, co-headlining tours, and festival lineups that reflect this reality.</p>
      <p>Ultimately, this convergence is a beautiful realization of a long-standing cultural connection. It is the sound of the diaspora uniting, communicating, and celebrating through rhythm. Whether it’s the dark dancehall energy of Rema’s "TEA" or the perfect synergy of Fireboy and Masicka’s "Claat!", the message is clear: the future of global music is a shared vibration, rooted in Africa, refined in the Caribbean, and amplified across the world.</p>
    `;

    const article1 = {
      title: title1,
      slug: slug1,
      url: `https://www.yardvybz.news/news/${slug1}`,
      summary: "Explore the massive 2026 trend of Afrobeats and Dancehall fusion, highlighting Rema's pivot to dark dancehall and the explosive collaboration between Fireboy DML and Masicka.",
      content: content1,
      category: 'music',
      imageUrl: img1Url,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'YardVybz Exclusive',
      author: 'YardVybz Music Desk',
      tags: ['Afrobeats', 'Dancehall', 'Rema', 'Masicka', 'Music Trends 2026'],
      status: 'published'
    };

    // Article 2 (900+ words)
    const img2Path = '/Users/lionelfrancis/.gemini/antigravity-ide/brain/b212b7c9-7dba-4cb2-b025-d71993844884/diaspora_cultural_festival_1786457299436.png';
    const img2Key = `news/diaspora_cultural_festival_${Date.now()}.png`;
    let img2Url = '/images/jamaica-tourism.jpg';

    if (hasAwsCreds) {
      const buffer2 = fs.readFileSync(img2Path);
      await s3.send(new PutObjectCommand({
        Bucket: 'yaadfeed-news-media-1785480321',
        Key: img2Key,
        Body: buffer2,
        ContentType: 'image/png',
        ACL: 'public-read'
      }));
      img2Url = `https://yaadfeed-news-media-1785480321.s3.us-east-1.amazonaws.com/${img2Key}`;
    }

    const title2 = "Summer of Unity: How Massive Diaspora Festivals Are Transforming US Culture in 2026";
    const slug2 = "summer-unity-diaspora-festivals-transforming-us-culture-2026";
    const content2 = `
      <p>August 2026 will undoubtedly be remembered as a watershed moment for diaspora culture in the United States. Across major metropolitan hubs, a wave of massive cultural festivals is sweeping through the summer, bringing together the vibrant communities of the Caribbean and Africa. These events are far more than just parties; they are powerful demonstrations of cultural pride, economic influence, and the beautiful, organic unification of two deeply connected heritages. From the sun-drenched streets of South Florida to the bustling avenues of Brooklyn, the diaspora is celebrating with unprecedented energy and scale.</p>

      <h3>The "Unlimited Vibes" Phenomenon in South Florida</h3>
      <p>South Florida has long been a critical epicenter for Caribbean culture in the US, but the landscape is rapidly evolving. The integration of African diaspora communities has transformed the region into a melting pot of global Black culture. This shift is perfectly encapsulated by the highly anticipated "Unlimited Vibes" event, taking over the prestigious DAER Nightclub in Hollywood, Florida, this mid-August.</p>
      <p>Historically, events of this scale in South Florida were strictly segregated by genre—a dedicated reggae night, a separate soca fete, or an exclusive Afrobeats lounge. "Unlimited Vibes" shatters these boundaries. The lineup features a heavy-hitting roster of internationally renowned DJs who are specifically tasked with spinning an exclusive, seamless mix of dancehall, soca, amapiano, and Afrobeats. The event reflects a new reality: the young diaspora does not compartmentalize their musical tastes. They want to hear Burna Boy immediately followed by Buju Banton, and the nightlife industry is finally catching up to this demand. The economic impact of such events is staggering, driving significant revenue to local hospitality and entertainment sectors while firmly establishing South Florida as a premier destination for global urban culture.</p>

      <h3>Brooklyn's African Popup Festival: A Culinary and Sonic Feast</h3>
      <p>Meanwhile, in New York, the unification is taking on a distinctly sensory form. Brooklyn recently hosted the Summer Edition of the African Popup Festival, an event that drew massive, record-breaking crowds. While the name highlights its African roots, the festival has organically expanded to become a massive celebration of the entire global diaspora. It serves as a vibrant, undeniable testament to the shared cultural DNA of West Africa and the Caribbean.</p>
      <p>The festival grounds in Brooklyn were a kaleidoscope of colors, sounds, and smells. The culinary offerings were a major highlight, with vendors serving up a cross-continental feast. Attendees could seamlessly move from a stall offering fiery Jamaican jerk chicken and festival to another serving rich Nigerian jollof rice and suya. This culinary proximity sparked conversations and connections, highlighting the undeniable similarities in ingredients, spices, and cooking techniques that survived the Middle Passage.</p>
      <p>Sonically, the festival was just as diverse. Live performances blurred the lines between genres. Afrobeats artists brought out Dancehall special guests, and Soca bands incorporated traditional West African percussion into their sets. The energy was palpable—a joyous, chaotic, and deeply unifying celebration of resilience and creativity.</p>

      <h3>Emancipendence and the Power of Shared History</h3>
      <p>The cultural calendar of August is heavily anchored by significant historical milestones, particularly for the Jamaican community. Early August is colloquially known as "Emancipendence," a period encompassing Emancipation Day on August 1st and Independence Day on August 6th. In 2026, the celebration of Jamaica’s 64th anniversary of independence resonated profoundly across the US diaspora.</p>
      <p>However, what made the 2026 celebrations unique was the widespread participation and solidarity from the broader African diaspora. Events like the massive Jamaica Emancipendence Fair in Miramar, Florida, saw attendees draped not only in the black, green, and gold of Jamaica but also in the vibrant colors of Nigerian, Ghanaian, and South African flags. The historical significance of emancipation is a shared trauma and a shared triumph for all people of African descent. Celebrating it together in the United States represents a powerful reclamation of history and a forging of new alliances.</p>

      <h3>The Summer Carnival Circuit: A Transnational Celebration</h3>
      <p>Running concurrently with these events is the Caribbean summer carnival circuit, which has seen an explosion in popularity and participation from outside the traditional Caribbean community. Events like Grenada’s Spicemas, held in the first half of August, dominated social media feeds globally. The visual spectacle of Jab Jab and the infectious energy of Soca music have captivated a wider audience.</p>
      <p>In the US, the lead-up to the massive West Indian American Day Carnival (Labor Day Carnival) in New York is already characterized by heavily integrated fetes and band launches. The traditional masquerade bands are seeing an influx of participants from the African diaspora, drawn by the undeniable similarities between Caribbean carnival traditions and West African festivals. This cross-participation is enriching the carnival experience, bringing new energy and a deeper sense of global unity to the traditions.</p>

      <h3>The Cultural and Economic Imperative</h3>
      <p>The significance of these massive diaspora festivals extends far beyond mere entertainment. They represent a powerful economic force. The vendors, promoters, artists, and logistics teams behind these events are predominantly Black-owned businesses. The success of these festivals ensures that the cultural capital generated by the diaspora remains within the community, fostering economic empowerment and entrepreneurial growth.</p>
      <p>Furthermore, these events are crucial for cultural preservation and transmission. For first and second-generation immigrants in the United States, these festivals provide a vital connection to their heritage. They offer a space where cultural identity can be loudly and proudly expressed, free from assimilation pressures. By bringing the Caribbean and African communities together, these events are helping to forge a new, unified, and incredibly powerful cultural identity in the United States—one that honors its distinct roots while celebrating its shared future.</p>
      <p>As August 2026 draws to a close, the legacy of this "Summer of Unity" is clear. The diaspora is no longer fragmented; it is a massive, interconnected cultural engine driving music, food, fashion, and commerce across the United States.</p>
    `;

    const article2 = {
      title: title2,
      slug: slug2,
      url: `https://www.yardvybz.news/news/${slug2}`,
      summary: "Explore how massive cultural festivals in August 2026, from South Florida's 'Unlimited Vibes' to Brooklyn's African Popup Festival, are unifying the Caribbean and African diaspora in the US.",
      content: content2,
      category: 'culture',
      imageUrl: img2Url,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'YardVybz Exclusive',
      author: 'YardVybz Culture Desk',
      tags: ['Culture', 'Diaspora', 'Festivals', 'Jamaica', 'Afrobeats', 'USA'],
      status: 'published'
    };

    console.log('Inserting articles into database...');
    await collection.updateOne({ slug: article1.slug }, { $set: article1 }, { upsert: true });
    await collection.updateOne({ slug: article2.slug }, { $set: article2 }, { upsert: true });
    
    console.log('Articles inserted successfully.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

run();
