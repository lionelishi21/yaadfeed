const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Load .env fallback if .env.local doesn't exist
if (!process.env.MONGODB_URI) {
  require('dotenv').config({ path: '.env' });
}

// Configuration
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'yardvybes';

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy'
  }
});

const articles = [
  {
    title: 'The Global Rise of Afro-Dancehall Fusion',
    slug: 'global-rise-afro-dancehall-fusion',
    category: 'music',
    imagePath: '/Users/lionelfrancis/.gemini/antigravity-ide/brain/aa0c097f-bc1d-4e44-bb78-bc9a2f890722/afro_dancehall_fusion_1786232869314.png',
    summary: 'How Jamaican artists are collaborating with Afrobeats stars to dominate international charts, blending two of the most influential genres in the world.',
    content: `
      <p>The musical landscape is shifting rapidly, and at the epicenter of this global tremor is a new sound: Afro-Dancehall fusion. Over the past few years, the line between traditional Jamaican Dancehall and the explosive rhythms of West African Afrobeats has blurred, resulting in some of the biggest chart-topping hits of the decade.</p>
      
      <h3>The Roots of the Connection</h3>
      <p>While the collaboration might seem sudden to mainstream pop audiences, the roots of this connection run deep. Afrobeats artists have long cited Jamaican reggae and dancehall legends as foundational influences. Now, artists from Kingston to Lagos are realizing that their shared sonic ancestry creates magic in the studio.</p>
      
      <blockquote>
        "When we link up in the studio, it's not two different cultures trying to figure each other out. It's family reuniting. The drum patterns talk to each other." — Anonymous Dancehall Producer
      </blockquote>

      <h3>Chart Domination</h3>
      <p>From massive global remixes to original collaborations, this fusion has proven to be a commercial juggernaut. Streaming numbers in both the Caribbean and the African continent have skyrocketed as fans embrace the unified sound. The tempo, the energy, and the lyrical delivery blend perfectly, creating a genre that dominates clubs from London to New York to Tokyo.</p>
      
      <p>As we look to the future, the Afro-Dancehall movement shows no signs of slowing down. Major record labels are actively seeking out these cross-continental collaborations, ensuring that the rhythm of the diaspora will continue to rule the airwaves.</p>
    `
  },
  {
    title: 'Reggae Boyz Prepare for Historic World Cup Qualifiers',
    slug: 'reggae-boyz-world-cup-qualifiers',
    category: 'sports',
    imagePath: '/Users/lionelfrancis/.gemini/antigravity-ide/brain/aa0c097f-bc1d-4e44-bb78-bc9a2f890722/reggae_boyz_world_cup_1786232881027.png',
    summary: 'A deep dive into the Jamaican national football team\'s new tactical approach and recent player acquisitions as they aim for the World Cup.',
    content: `
      <p>The anticipation is palpable across the island as the Jamaica National Football Team, affectionately known as the Reggae Boyz, gears up for what many consider their most important World Cup qualifying campaign since their historic 1998 run.</p>
      
      <h3>A New Tactical Era</h3>
      <p>Under new management, the Reggae Boyz have completely overhauled their tactical approach. Moving away from the traditional physical, counter-attacking style, the team is now embracing a possession-based, high-pressing game. This shift has required intense training camps and a newfound discipline on the pitch.</p>
      
      <h3>Strengthening the Squad</h3>
      <p>A crucial element of this campaign has been the strategic recruitment of diaspora players. By tapping into talent pools in the English Premier League and the MLS, the Jamaican Football Federation has assembled a squad that boasts both local grit and top-tier European experience.</p>
      
      <ul>
        <li><strong>Enhanced Midfield:</strong> The addition of seasoned playmakers has stabilized the center of the pitch.</li>
        <li><strong>Lethal Attack:</strong> A mix of young, pacey wingers and clinical strikers promises more goals.</li>
        <li><strong>Defensive Solidity:</strong> A reorganized backline has proven hard to break down in recent friendlies.</li>
      </ul>

      <p>The journey ahead is arduous, with tough matches against regional giants. However, if recent form is any indicator, the Reggae Boyz are ready to make history once again and bring the Caribbean flair back to the world's biggest stage.</p>
    `
  },
  {
    title: 'Kingston\'s Tech Renaissance: The Caribbean\'s Silicon Valley',
    slug: 'kingston-tech-renaissance',
    category: 'business',
    imagePath: '/Users/lionelfrancis/.gemini/antigravity-ide/brain/aa0c097f-bc1d-4e44-bb78-bc9a2f890722/kingston_tech_hub_1786232892517.png',
    summary: 'The explosion of tech startups in Kingston is transforming the city into a vibrant hub of digital innovation and entrepreneurship.',
    content: `
      <p>Often celebrated for its cultural exports, Kingston is rapidly gaining a new reputation: the tech capital of the Caribbean. A surge of digital entrepreneurship, fueled by young innovators and supportive policies, is transforming the city's economic landscape.</p>
      
      <h3>The Co-Working Boom</h3>
      <p>Walk into any of Kingston's new co-working spaces, and you'll find a scene reminiscent of Silicon Valley, albeit with better weather and a reggae soundtrack. Developers, designers, and founders are collaborating on solutions that range from fintech apps designed for the unbanked to agri-tech platforms optimizing local farming yields.</p>
      
      <blockquote>
        "We have the talent, we have the drive, and now we have the ecosystem to support it. Kingston is proving that world-class tech doesn't only come out of California." — Local Tech Founder
      </blockquote>

      <h3>Government and Private Investment</h3>
      <p>This renaissance isn't happening in a vacuum. Both the Jamaican government and private angel investors have recognized the potential of the tech sector. Incubator programs, tax incentives for digital startups, and improved internet infrastructure have laid the groundwork for this rapid growth.</p>
      
      <p>As these startups scale and begin to attract international venture capital, Kingston is poised to become a blueprint for how emerging economies can leverage technology to leapfrog traditional development barriers. The future of the Jamaican economy is increasingly digital.</p>
    `
  },
  {
    title: 'The Evolution of Sound Clashes: From Kingston Streets to Global Arenas',
    slug: 'evolution-of-sound-clashes',
    category: 'culture',
    imagePath: '/Users/lionelfrancis/.gemini/antigravity-ide/brain/aa0c097f-bc1d-4e44-bb78-bc9a2f890722/sound_clash_evolution_1786232904046.png',
    summary: 'A cultural retrospective on the art of the Sound Clash, exploring how dubplate culture has evolved in the digital age.',
    content: `
      <p>The Sound Clash is the beating heart of Jamaican music culture. What began as neighborhood sound systems battling for supremacy on the streets of Kingston has evolved into a global phenomenon, filling massive arenas around the world with deafening bass and electrifying tension.</p>
      
      <h3>The Art of the Dubplate</h3>
      <p>At the core of the clash is the 'dubplate'—exclusive, custom recordings where artists shout out the sound system playing the track. In the past, securing a dubplate meant physically tracking down artists in Kingston recording studios. Today, the dubplate economy is digital, global, and highly lucrative.</p>
      
      <p>The rules of engagement remain largely the same: selectors (DJs) and MCs go round for round, playing their rarest and most impactful dubplates. The winner is decided by crowd response, making it one of the most democratic and visceral forms of musical competition in the world.</p>
      
      <h3>A Global Spectacle</h3>
      <p>Modern sound clashes are highly produced spectacles. Giant LED screens, dramatic lighting, and massive speaker arrays have replaced the humble street corner setups. Promoters now organize international clash leagues, pitting sounds from Japan, Europe, and the US against Jamaican veterans.</p>
      
      <ul>
        <li><strong>Technological Advancements:</strong> Digital controllers and high-end audio processing have changed how selectors mix.</li>
        <li><strong>Global Reach:</strong> Livestreams bring the clash experience to millions of fans worldwide.</li>
        <li><strong>Cultural Preservation:</strong> Despite the modern gloss, the clash remains a vital preserver of reggae and dancehall history.</li>
      </ul>

      <p>The evolution of the sound clash proves that true cultural artifacts don't disappear; they adapt and conquer new stages, ensuring the foundation of Jamaican music continues to shake the world.</p>
    `
  }
];

async function run() {
  let client;
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(MONGODB_DB);
    const collection = db.collection('news_items');

    for (const article of articles) {
      console.log(`Processing article: ${article.title}`);
      
      // Upload image to S3
      const fileContent = fs.readFileSync(article.imagePath);
      const fileExtension = path.extname(article.imagePath);
      const s3Key = `news/img-${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
      
      console.log(`Uploading image to S3 as ${s3Key}...`);
      await s3Client.send(new PutObjectCommand({
        Bucket: 'yaadfeed-news-media-1785480321',
        Key: s3Key,
        Body: fileContent,
        ContentType: 'image/png'
      }));
      
      const imageUrl = `https://yaadfeed-news-media-1785480321.s3.us-east-1.amazonaws.com/${s3Key}`;
      
      // Insert to DB
      const newsItem = {
        title: article.title,
        slug: article.slug,
        url: `https://yardvybz.news/news/${article.slug}`,
        summary: article.summary,
        content: article.content,
        category: article.category,
        imageUrl: imageUrl,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'YardVybz Exclusive',
        author: 'YardVybz Staff',
        tags: [article.category, 'exclusive']
      };
      
      await collection.insertOne(newsItem);
      console.log(`Successfully inserted article: ${article.title}`);
    }
    
    console.log('All articles processed successfully!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

run();
