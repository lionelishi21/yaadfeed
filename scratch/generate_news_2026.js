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

    // Article 1
    const img1Path = '/Users/lionelfrancis/.gemini/antigravity-ide/brain/b212b7c9-7dba-4cb2-b025-d71993844884/jamaica_safe_streets_2026_1786456395469.png';
    const img1Key = `news/jamaica_safe_streets_${Date.now()}.png`;
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

    const title1 = "Jamaica Records Significant 20% Decline in Murders in 2026: A Closer Look at the Changing Tide";
    const slug1 = "jamaica-records-20-percent-decline-murders-2026";
    const content1 = `
      <p>In a profound and welcome shift for the nation, Jamaica has recorded a significant 20% decline in murders for the year 2026, marking one of the most substantial year-over-year decreases in recent history. According to the latest statistics released by the Jamaica Constabulary Force (JCF), the period between January 1 and August 8 saw 333 murders, a stark contrast to the 415 recorded during the same period in 2025. This downward trend is not merely a statistical anomaly but a reflection of concerted efforts, strategic shifts in policing, and a broader cultural movement towards community building and conflict resolution.</p>

      <h3>The Numbers Behind the Decline</h3>
      <p>The reduction of 82 lives saved in just over seven months is a monumental achievement for a country that has long grappled with high crime rates. The JCF's data indicates that the decline is not isolated to a single parish or demographic but is spread across various traditional hotspots. St. Andrew South, St. James, and Clarendon, regions historically plagued by gang-related violence, have seen some of the most dramatic drops in homicides. This broad-based decline suggests that the underlying strategies being employed by security forces and community leaders are taking root.</p>
      <p>Furthermore, other categories of serious crime, including shootings, robberies, and rapes, have also seen corresponding decreases. This holistic reduction points to a general dampening of criminal enterprise and a disruption of the networks that facilitate violence. The statistics offer a glimmer of hope that the deeply entrenched cycles of violence can indeed be broken.</p>

      <h3>Strategic Policing and Technology</h3>
      <p>A significant driver of this positive change is the modernization and strategic realignment of the Jamaica Constabulary Force. Under current leadership, the JCF has pivoted aggressively towards intelligence-led policing. The use of advanced data analytics, expanded CCTV networks (JamaicaEye), and improved forensic capabilities have dramatically increased the clear-up rate for major crimes. Criminals are finding it increasingly difficult to operate with impunity when their movements are tracked and analyzed in real-time.</p>
      <p>Moreover, the targeted deployment of specialized units, such as the Counter-Terrorism and Organised Crime Investigation Branch (C-TOC) and the Anti-Gang Task Force, has been crucial in dismantling major criminal syndicates. These units have focused not just on the foot soldiers, but on the intellectual authors and financial backers of gang violence. By striking at the head of these organizations, the JCF has significantly diminished their operational capacity.</p>

      <h3>Community Engagement and Social Intervention</h3>
      <p>While robust law enforcement is critical, it is widely acknowledged that policing alone cannot solve Jamaica's crime problem. The 20% decline is equally attributable to intensified social intervention programs and community policing initiatives. Programs aimed at engaging at-risk youth, providing vocational training, and offering conflict resolution mediation have gained significant traction.</p>
      <p>Organizations like the Peace Management Initiative (PMI) and various non-governmental organizations have been working tirelessly on the ground in volatile communities. Their efforts to broker peace agreements between rival factions and provide alternative pathways for young men have been instrumental in cooling tensions. Furthermore, the JCF's own Community Safety and Security Branch (CSSB) has worked to rebuild trust between citizens and the police, leading to increased cooperation and crucial intelligence sharing.</p>

      <h3>The Role of Legislation and the Justice System</h3>
      <p>Legislative changes have also played a supporting role in this crime reduction. Stricter penalties for illegal firearm possession and gang-related activities have served as a stronger deterrent. The new Firearms (Prohibition, Restriction and Regulation) Act, which imposes mandatory minimum sentences for certain offenses, has sent a clear message that the state is taking a zero-tolerance approach to gun violence.</p>
      <p>Concurrently, efforts to streamline the justice system and reduce the backlog of cases are beginning to bear fruit. A more efficient judicial process ensures that offenders are brought to trial swiftly, reinforcing the concept of consequences for criminal actions and providing closure for victims' families.</p>

      <h3>Economic Factors and National Development</h3>
      <p>It is impossible to decouple crime from socio-economic realities. Jamaica's recent economic stability, characterized by low unemployment rates and consistent, albeit modest, economic growth, has undoubtedly contributed to the decline in violence. When more citizens have access to legitimate income-generating opportunities, the allure of criminal enterprise naturally diminishes.</p>
      <p>The government's continued investment in infrastructure, education, and social safety nets provides a foundation for long-term stability. While economic disparities still exist, the macro-economic improvements are creating a more resilient society less prone to the desperation that often fuels street-level crime.</p>

      <h3>Challenges Remaining and the Road Ahead</h3>
      <p>Despite the encouraging statistics, it is crucial to recognize that Jamaica is not yet out of the woods. A total of 333 murders in seven months is still an unacceptably high number for a population of just under 3 million. The threat of gang violence, transnational organized crime, and the influx of illegal weapons remains a clear and present danger.</p>
      <p>Sustaining this downward trend will require unwavering commitment and continuous adaptation. Criminal organizations are constantly evolving, finding new ways to exploit vulnerabilities. The state must therefore remain vigilant, continually upgrading its technological capabilities and refining its strategies. Furthermore, the focus on social intervention must not wane. Long-term peace can only be achieved by addressing the root causes of crime: poverty, inequality, and lack of opportunity.</p>

      <h3>A Cautious Optimism</h3>
      <p>The 20% decline in murders in 2026 offers a moment for cautious optimism. It serves as tangible proof that the scourge of violence in Jamaica is not an insurmountable problem. It validates the hard work and sacrifices of the men and women in law enforcement, the dedication of community workers, and the resilience of the Jamaican people.</p>
      <p>As the nation moves forward, the challenge is to transform this statistical dip into a permanent cultural shift. It requires a whole-of-society approach, where every citizen recognizes their role in building a safer Jamaica. The progress made in 2026 is a foundation upon which a more peaceful, prosperous future can be built. It is a reminder that while the journey is long and fraught with challenges, a safer Jamaica is indeed possible.</p>
    `;

    const article1 = {
      title: title1,
      slug: slug1,
      url: `https://www.yardvybz.news/news/${slug1}`,
      summary: "A comprehensive analysis of the recent JCF statistics showing a near 20% decline in murders in Jamaica for 2026, exploring the factors driving this positive change.",
      content: content1,
      category: 'news',
      imageUrl: img1Url,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'YardVybz Exclusive',
      author: 'YardVybz Staff',
      tags: ['Crime', 'Jamaica Constabulary Force', 'News', 'Jamaica'],
      status: 'published'
    };

    // Article 2
    const img2Path = '/Users/lionelfrancis/.gemini/antigravity-ide/brain/b212b7c9-7dba-4cb2-b025-d71993844884/japex_tourism_2026_1786456406654.png';
    const img2Key = `news/japex_tourism_${Date.now()}.png`;
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

    const title2 = "JAPEX 2026: Jamaica Prepares to Showcase Unprecedented Tourism Dominance on the Global Stage";
    const slug2 = "japex-2026-jamaica-prepares-showcase-tourism-dominance";
    const content2 = `
      <p>As the Caribbean's premier travel trade show approaches, anticipation is reaching a fever pitch. The Jamaica Product Exchange (JAPEX) 2026 is poised to be the most significant iteration in the event's history, reflecting Jamaica's undisputed dominance in the regional tourism market. Scheduled to take place next month, JAPEX 2026 is not merely a networking event; it is a grand showcase of resilience, innovation, and the enduring appeal of the Jamaican brand. With buyers from over 22 countries already registered, the event promises to secure lucrative contracts and shape the trajectory of the island's tourism sector for years to come.</p>

      <h3>The Significance of JAPEX</h3>
      <p>For over three decades, JAPEX has been the crucial nexus where the Jamaican tourism product meets the global market. Organized by the Jamaica Hotel and Tourist Association (JHTA) in conjunction with the Jamaica Tourist Board (JTB), the event facilitates face-to-face negotiations between Jamaican suppliers—ranging from large all-inclusive resorts to boutique hotels, tour operators, and attractions—and international buyers, including travel agents, tour wholesalers, and airline representatives.</p>
      <p>In 2026, the significance of JAPEX is amplified by the industry's record-breaking performance. Following the complete recovery from the pandemic-era slump, Jamaica has experienced unprecedented growth in visitor arrivals and tourism revenues. JAPEX serves as the platform to sustain this momentum, allowing stakeholders to lock in advanced bookings for the upcoming winter tourist season and beyond.</p>

      <h3>What to Expect in 2026</h3>
      <p>This year's exhibition promises to be larger and more diverse than ever before. The Montego Bay Convention Centre, the traditional home of JAPEX, is undergoing final preparations to host thousands of delegates. One of the key focuses of JAPEX 2026 is the diversification of the Jamaican tourism product. While sun, sea, and sand remain the core attractions, there is a deliberate push to highlight experiential travel.</p>
      <p>Buyers can expect to see a strong emphasis on eco-tourism, community-based tourism, and culinary experiences. Exhibitors will showcase off-the-beaten-path adventures in the Blue Mountains, farm-to-table dining experiences in St. Elizabeth, and immersive cultural tours in Kingston. This shift aligns with the evolving preferences of global travelers who increasingly seek authentic and sustainable travel experiences.</p>

      <h3>International Interest and Expanding Markets</h3>
      <p>The fact that buyers from over 22 countries have already registered is a testament to Jamaica's global appeal. While traditional markets like the United States, Canada, and the United Kingdom continue to dominate, there is growing interest from non-traditional source markets. JAPEX 2026 will see significant representation from Latin America, particularly Colombia and Brazil, as well as emerging markets in Eastern Europe and Asia.</p>
      <p>The Ministry of Tourism and the JTB have been working aggressively to secure airlift from these new regions. JAPEX provides the critical opportunity to connect the airlines, the tour operators in these new markets, and the local hoteliers, ensuring that the infrastructure is in place to support the influx of new visitors.</p>

      <h3>Technological Integration and the Future of Travel</h3>
      <p>JAPEX 2026 will also highlight the increasing role of technology in the Jamaican tourism sector. From AI-driven customer service solutions to virtual reality tours of upcoming resort developments, technology is transforming how Jamaica markets and delivers its product. The event will feature dedicated sessions on digital marketing, revenue management systems, and sustainable technologies for the hospitality sector.</p>
      <p>This focus on innovation is crucial for maintaining a competitive edge in a crowded global marketplace. By embracing new technologies, Jamaican stakeholders can improve operational efficiency, enhance the guest experience, and reach a wider audience of potential travelers.</p>

      <h3>The Economic Engine of Jamaica</h3>
      <p>The importance of a successful JAPEX cannot be overstated when considering the broader Jamaican economy. Tourism remains the island's largest earner of foreign exchange and the most significant driver of employment, both directly and indirectly. The contracts negotiated on the floor of the Montego Bay Convention Centre translate into jobs for hotel workers, farmers, craft vendors, and transportation operators across the island.</p>
      <p>Furthermore, the success of the tourism sector stimulates growth in other areas of the economy, including construction, manufacturing, and agriculture. The linkages between tourism and these other sectors are a major focus for the government, and JAPEX provides a platform to strengthen these connections. For instance, local manufacturers and farmers are increasingly featured at the event, showcasing their ability to supply the hospitality sector with high-quality, locally produced goods.</p>

      <h3>Sustainability and Responsible Tourism</h3>
      <p>As the industry grows, so too does the imperative for sustainable practices. JAPEX 2026 will place a heavy emphasis on environmental stewardship and responsible tourism. Exhibitors will be encouraged to showcase their eco-friendly initiatives, from solar power installations and water conservation programs to single-use plastic reduction and coral reef restoration projects.</p>
      <p>The global traveler is becoming increasingly eco-conscious, and Jamaica is positioning itself as a destination that not only offers incredible beauty but also protects it. The dialogue at JAPEX will reflect this commitment, ensuring that the growth of the industry does not come at the expense of the island's fragile natural resources.</p>

      <h3>A Celebration of Culture</h3>
      <p>Beyond the business meetings and contract negotiations, JAPEX is ultimately a celebration of Jamaican culture. The event will feature vibrant displays of music, dance, and gastronomy. It is an opportunity for international buyers to experience firsthand the warmth, energy, and creativity that define the "Heartbeat of the World."</p>
      <p>From reggae performances to jerk pan chicken tastings, the cultural elements of JAPEX are not merely entertainment; they are an integral part of the product being sold. They remind the buyers that when they sell a trip to Jamaica, they are selling an experience unlike any other.</p>

      <h3>Looking Ahead</h3>
      <p>As the final preparations are made, the mood among Jamaican tourism stakeholders is one of extreme optimism. JAPEX 2026 is set to break records and solidify Jamaica's position as a titan of global tourism. The event will not only secure business for the immediate future but will also lay the groundwork for long-term, sustainable growth. It is a moment for Jamaica to shine, to showcase its resilience, its innovation, and its unparalleled beauty to the world.</p>
    `;

    const article2 = {
      title: title2,
      slug: slug2,
      url: `https://www.yardvybz.news/news/${slug2}`,
      summary: "Anticipation builds as Jamaica prepares to host JAPEX 2026, the premier travel trade show that will solidify the island's dominance in the global tourism market.",
      content: content2,
      category: 'news',
      imageUrl: img2Url,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'YardVybz Exclusive',
      author: 'YardVybz Staff',
      tags: ['Tourism', 'JAPEX', 'Travel', 'Jamaica', 'Economy'],
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
