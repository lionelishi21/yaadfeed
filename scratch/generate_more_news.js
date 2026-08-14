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

    // Article 1: FIFA Women's World Cup 2031
    const img1Path = '/Users/lionelfrancis/.gemini/antigravity-ide/brain/b212b7c9-7dba-4cb2-b025-d71993844884/jamaica_fifa_world_cup_2031_1786688777499.png';
    const img1Key = `news/jamaica_fifa_world_cup_${Date.now()}.png`;
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

    const title1 = "Jamaica Signs Historic Agreements to Co-Host the 2031 FIFA Women's World Cup Alongside USA, Mexico, and Costa Rica";
    const slug1 = "jamaica-signs-historic-agreements-co-host-2031-fifa-womens-world-cup";
    const content1 = `
      <p>In a historic moment for Caribbean athletics and national development, the Government of Jamaica and the Jamaica Football Federation (JFF) have officially signed all binding guarantee agreements to co-host the <strong>2031 FIFA Women’s World Cup</strong>. Jamaica will serve as a host nation alongside the United States, Mexico, and Costa Rica, marking the first time in history that a FIFA World Cup tournament will feature matches played on Caribbean soil.</p>

      <h3>A Global Triumph for the Reggae Girlz Legacy</h3>
      <p>The announcement follows years of extraordinary international success by Jamaica’s senior women’s football team, the Reggae Girlz, who captivated the world with back-to-back FIFA World Cup appearances in 2019 and 2023. Their historic run into the knockout stages of the 2023 tournament in Australia demonstrated that Jamaican football has earned its place among the elite global powers.</p>
      <p>Speaking at the official signing ceremony at the Ministry of Culture, Gender, Entertainment and Sport in Kingston, government officials emphasized that securing hosting rights represents far more than a sporting achievement—it is a transformative catalyst for infrastructure, youth development, and international trade.</p>

      <h3>Stadium Upgrades and Infrastructure Investments</h3>
      <p>As part of the government guarantees, major capital investments are slated for the National Stadium in Independence Park, Kingston, as well as secondary training venues across the island, including Montego Bay and Trelawny. The National Stadium is set to undergo a multi-million dollar transformation, including state-of-the-art pitch installation, expanded seating capacity, upgraded media facilities, and modernized VIP hospitality suites to meet FIFA’s stringent international hosting standards.</p>
      <p>Urban planning and transport authorities are also aligning key infrastructure projects—such as highway expansions and airport modernization at Norman Manley International Airport in Kingston and Sangster International Airport in Montego Bay—to ensure seamless transit for tens of thousands of visiting international fans, teams, and dignitaries.</p>

      <h3>Economic Impact and Tourism Acceleration</h3>
      <p>Economic analysts project that co-hosting the 2031 FIFA Women's World Cup will generate hundreds of millions of US dollars in tourism revenue, hotel bookings, and local business development. The global television broadcast will put Jamaica in front of an estimated global audience exceeding 2 billion viewers, accelerating the country's position as a world-class destination for sports tourism.</p>
      <p>Local businesses in hospitality, transportation, food service, and cultural entertainment are preparing to capitalize on the influx of global visitors. The Ministry of Tourism has already initiated discussions with regional airline partners to establish direct inter-island and international charter flights during the month-long tournament.</p>

      <h3>Inspiring the Next Generation of Caribbean Athletes</h3>
      <p>Beyond the economic benefits, sports administrators emphasize the profound social legacy the tournament will leave for young Caribbean women. Grassroots football academies across all 14 parishes will benefit from FIFA developmental grants, upgraded equipment, and coaching clinics, ensuring that the legacy of 2031 inspires future generations of Reggae Girlz for decades to come.</p>
    `;

    const article1 = {
      title: title1,
      slug: slug1,
      url: `https://www.yardvybz.news/news/${slug1}`,
      summary: "Jamaica signs official guarantees to co-host the 2031 FIFA Women's World Cup alongside the US, Mexico, and Costa Rica, bringing World Cup matches to Caribbean soil for the first time.",
      content: content1,
      category: 'sports',
      imageUrl: img1Url,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'YardVybz Exclusive',
      author: 'YardVybz Sports Desk',
      tags: ['FIFA World Cup 2031', 'Reggae Girlz', 'Jamaica Football', 'Sports News', 'Kingston'],
      status: 'published'
    };

    // Article 2: JAPEX 2026 Launch in Ocho Rios
    const img2Path = '/Users/lionelfrancis/.gemini/antigravity-ide/brain/b212b7c9-7dba-4cb2-b025-d71993844884/japex_ocho_rios_2026_1786688789941.png';
    const img2Key = `news/japex_ocho_rios_${Date.now()}.png`;
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

    const title2 = "JAPEX 2026 Officially Launched in Ocho Rios: Tourism Sector Prepares for Record-Breaking Global Showcase";
    const slug2 = "japex-2026-officially-launched-ocho-rios-tourism-record-break-showcase";
    const content2 = `
      <p>The Jamaica Hotel and Tourist Association (JHTA) and the Jamaica Tourist Board (JTB) have officially launched the 32nd annual <strong>Jamaica Product Exchange (JAPEX 2026)</strong>, scheduled to take place from September 14 to 18 in the resort capital of Ocho Rios, St. Ann. The event is set to convene over 500 international travel buyers, tour operators, hoteliers, and airline executives from more than 25 countries.</p>

      <h3>Ocho Rios Takes Center Stage for Tourism Trade</h3>
      <p>Selecting Ocho Rios as the host destination highlights the region’s massive multi-million dollar revitalization. Renowned for its iconic natural attractions such as Dunn’s River Falls, Mystic Mountain, and Blue Hole, Ocho Rios has experienced significant new resort development, port upgrades, and luxury eco-tourism expansions over the past year.</p>
      <p>The trade show will feature four days of high-stakes business-to-business (B2B) negotiations, product presentations, and networking events designed to secure bulk travel bookings for the upcoming 2026/2027 winter tourist season.</p>

      <h3>Record Visitor Numbers and Market Expansion</h3>
      <p>Tourism officials revealed that Jamaica is on track to record its highest stopover arrival figures in history for 2026, driven by expanded airlift from key North American gateways, emerging Latin American markets, and renewed European demand. JAPEX 2026 will place a primary focus on opening new travel corridors from South America and Western Europe, supported by direct flights from airlines including Copa Airlines, Virgin Atlantic, and Condor.</p>
      <p>Minister of Tourism Edmund Bartlett highlighted that the island's strategic focus on safety, luxury resort expansion, and authentic cultural experiences continues to position Jamaica as the premier destination in the Caribbean.</p>

      <h3>Focus on Sustainability, Eco-Tourism, and Local Linkages</h3>
      <p>A major theme of JAPEX 2026 is environmental sustainability and community tourism linkages. Exhibitors will showcase initiatives aimed at marine conservation, solar energy adoption in hotels, and farm-to-table programs that directly connect local Jamaican agricultural producers with luxury resort kitchens.</p>
      <p>Special workshops during the trade show will address digital marketing innovation, AI-driven guest personalization, and strategies to increase local community participation in the tourism economy, ensuring that the economic gains of the industry directly benefit working-class Jamaicans.</p>

      <h3>A Vibrant Cultural Showcase for International Buyers</h3>
      <p>In true Jamaican fashion, JAPEX 2026 will combine intense business negotiations with world-class cultural entertainment. Delegates will be treated to evening galas featuring live reggae performances, authentic Jamaican gastronomy, and immersive cultural tours across St. Ann and St. Mary.</p>
      <p>As preparations intensify for the September event, hoteliers and tour operators across Ocho Rios report overwhelming optimism, predicting that JAPEX 2026 will cement Jamaica's position as an unbeatable powerhouse in global travel and hospitality.</p>
    `;

    const article2 = {
      title: title2,
      slug: slug2,
      url: `https://www.yardvybz.news/news/${slug2}`,
      summary: "JAPEX 2026 launches in Ocho Rios from September 14-18, bringing over 500 global travel buyers to Jamaica for a record-breaking tourism showcase.",
      content: content2,
      category: 'news',
      imageUrl: img2Url,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'YardVybz Exclusive',
      author: 'YardVybz Business Desk',
      tags: ['JAPEX 2026', 'Tourism', 'Ocho Rios', 'Jamaica Travel', 'Business News'],
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
