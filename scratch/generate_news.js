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
    title: "Dancehall's New Wave: How Afrobeats Collaboration is Reshaping Jamaican Music",
    slug: 'dancehall-new-wave-afrobeats-collaboration',
    summary: 'A deep dive into the recent surge of collaborations between Jamaican Dancehall artists and West African Afrobeats stars.',
    imagePath: '/Users/lionelfrancis/.gemini/antigravity-ide/brain/864e0d86-d915-4684-9018-2b4fdd06f127/dancehall_afrobeats_collab_1785531094437.png',
    imageKey: 'news/dancehall_afrobeats_collab_' + Date.now() + '.png',
    category: 'entertainment',
    content: `
      <p>The streets of Kingston are echoing with a new rhythm. It’s a sound that bridges the Atlantic, merging the hardcore, bass-heavy thumps of traditional Jamaican Dancehall with the syncopated, polyrhythmic allure of West African Afrobeats. This fusion isn't just a fleeting trend; it represents a monumental shift in global black music, creating a unified sonic landscape that is dominating charts from London to Lagos, and New York to Nairobi.</p>
      
      <h3>The Roots of the Cross-Cultural Exchange</h3>
      <p>Historically, Jamaican music has always had a profound influence on the African continent, with Reggae legends like Bob Marley and Peter Tosh revered as musical deities. However, the current exchange is increasingly bi-directional. As Afrobeats exploded onto the global scene over the last decade, Jamaican artists recognized a kindred spirit in the genre's infectious grooves.</p>
      <p>"It's a natural progression," explains acclaimed producer 'Riddim Boss' Thompson. "Dancehall and Afrobeats share the same DNA. They both come from the drum, from the heartbeat of the people. When you put a Dancehall artist on an Afrobeats track, or vice versa, the energy is undeniable. It's like finding a long-lost cousin."</p>

      <h3>High-Profile Collaborations Leading the Charge</h3>
      <p>The past year has seen an unprecedented number of high-profile collaborations. Megastars from both regions are actively seeking each other out. We've seen massive hits resulting from pairings that fans could only dream of a few years ago. These tracks are not just club bangers; they are cultural events that celebrate shared heritage while pushing musical boundaries.</p>
      <blockquote>"Working with our brothers and sisters in Africa is bringing a fresh perspective to the studio. We are learning from their production styles, and they are taking notes on our vocal delivery and flow. It's a beautiful exchange," said a prominent Kingston-based recording artist.</blockquote>

      <h3>Impact on the Local Industry</h3>
      <p>This cross-pollination is significantly impacting the local Jamaican music industry. Studios in Kingston are adapting, incorporating new instruments and production techniques. The traditional 'riddim' culture—where multiple artists voice over the same instrumental—is evolving to accommodate these new, complex African beats.</p>
      <ul>
        <li><strong>New Production Styles:</strong> Producers are blending Dancehall kicks with Afrobeats snares.</li>
        <li><strong>Expanded Audiences:</strong> Jamaican artists are touring extensively in Africa, opening up massive new markets.</li>
        <li><strong>Cultural Reconnection:</strong> The music is fostering a deeper cultural connection and mutual understanding between the Caribbean and Africa.</li>
      </ul>

      <h3>The Future of the Fusion</h3>
      <p>As we look to the future, the Dancehall-Afrobeats fusion shows no signs of slowing down. Industry insiders predict more joint EPs, cross-continental tours, and perhaps even entirely new sub-genres born from this collaboration. What is certain is that this musical alliance has breathed new life into both genres, creating a global powerhouse that is redefining the sound of modern pop music.</p>
      <p>For the fans in Kingston and across the diaspora, it’s a golden era of music. The vibrant recording studios are buzzing with energy, creativity, and the undeniable magic that happens when two powerful musical traditions unite as one.</p>
    `,
    tags: ['Dancehall', 'Afrobeats', 'Music', 'Culture']
  },
  {
    title: "The Rise of Tech Hubs in Kingston: A New Era for Caribbean Startups",
    slug: 'rise-of-tech-hubs-kingston-caribbean-startups',
    summary: 'Kingston is rapidly transforming into a thriving hub for technology startups, attracting talent and investment from across the region.',
    imagePath: '/Users/lionelfrancis/.gemini/antigravity-ide/brain/864e0d86-d915-4684-9018-2b4fdd06f127/kingston_tech_hub_1785531102225.png',
    imageKey: 'news/kingston_tech_hub_' + Date.now() + '.png',
    category: 'business',
    content: `
      <p>A quiet revolution is taking place amidst the bustling streets of Jamaica's capital. Kingston, long celebrated for its cultural exports of music and sports, is rapidly emerging as a formidable force in the Caribbean's digital economy. A new wave of tech hubs, incubators, and coworking spaces is transforming the city's landscape, providing a fertile ground for a burgeoning community of innovators and entrepreneurs.</p>

      <h3>The Birth of a Tech Ecosystem</h3>
      <p>The transition hasn't happened overnight. It is the result of years of grassroots efforts, strategic government initiatives, and a growing diaspora eager to invest back home. Today, walking into one of Kingston's modern tech offices feels akin to stepping into a Silicon Valley startup—complete with sleek aesthetics, tropical plants, and teams of young, driven professionals collaborating intently over laptops.</p>
      <p>"We realized that the talent is here. Our universities are producing brilliant engineers, developers, and creatives. What was missing was the infrastructure to support them—the spaces to collaborate, the access to funding, and the mentorship to scale," notes Sarah Jenkins, co-founder of 'Innovate Ja,' one of the city's leading tech incubators.</p>

      <h3>Key Drivers of Growth</h3>
      <p>Several critical factors are propelling Kingston's tech boom:</p>
      <ul>
        <li><strong>Government Support:</strong> Initiatives aimed at digital literacy and grants for early-stage startups have provided much-needed foundational support.</li>
        <li><strong>Diaspora Engagement:</strong> Jamaican professionals working in global tech giants are returning or investing remotely, bringing invaluable experience and capital.</li>
        <li><strong>Local Problem Solving:</strong> Startups are increasingly focused on solving hyper-local and regional problems—from fintech solutions for the unbanked to agritech platforms improving farm yields—creating highly relevant and resilient business models.</li>
      </ul>

      <h3>Success Stories on the Horizon</h3>
      <p>The ecosystem is already producing notable success stories. Local startups are securing significant seed rounds and expanding their operations across the Caribbean and into Latin America. These early wins are crucial; they validate the market and inspire the next generation of founders.</p>
      <blockquote>"When a young developer in Kingston sees a local company raise millions and expand internationally, it changes the paradigm. It proves that you don't have to leave the island to build something globally significant," said a local angel investor.</blockquote>

      <h3>Challenges and the Road Ahead</h3>
      <p>Despite the optimism, challenges remain. Access to later-stage venture capital is still limited, and navigating the regulatory environment can be daunting for new businesses. Moreover, there is a continuous need to bridge the digital divide to ensure that the benefits of this tech boom are felt across all strata of Jamaican society.</p>
      <p>However, the momentum is undeniable. Kingston's tech hubs are more than just office spaces; they are vibrant communities fostering resilience, creativity, and ambition. As these young professionals continue to build, innovate, and collaborate, they are not just creating companies—they are architecting a new, digitized future for the Caribbean.</p>
    `,
    tags: ['Technology', 'Startups', 'Business', 'Kingston']
  },
  {
    title: "Blue Mountain Coffee: Sustainable Farming Securing Jamaica's Liquid Gold",
    slug: 'blue-mountain-coffee-sustainable-farming-jamaica',
    summary: 'How modern sustainable practices are preserving the heritage and quality of Jamaica\'s world-renowned Blue Mountain coffee.',
    imagePath: '/Users/lionelfrancis/.gemini/antigravity-ide/brain/864e0d86-d915-4684-9018-2b4fdd06f127/blue_mountain_coffee_1785531109929.png',
    imageKey: 'news/blue_mountain_coffee_' + Date.now() + '.png',
    category: 'culture',
    content: `
      <p>High in the mist-shrouded peaks of eastern Jamaica lies a treasure that has captivated palates worldwide for centuries. Jamaica Blue Mountain coffee is renowned for its mild flavor, lack of bitterness, and sweet herbal and floral notes. However, this "liquid gold" is facing unprecedented challenges from climate change and economic pressures. In response, a new generation of farmers is turning to sustainable and regenerative agricultural practices to secure the future of this iconic crop.</p>

      <h3>The Threat to the Mountains</h3>
      <p>The unique microclimate of the Blue Mountains—characterized by cool temperatures, high rainfall, and rich volcanic soil—is essential for cultivating this specific coffee bean. Yet, changing weather patterns, including unpredictable rainfall and increased instances of hurricanes, threaten the delicate balance required for optimal growth. Additionally, soil degradation from decades of intensive farming has prompted an urgent need for change.</p>
      <p>"We noticed the yields were dropping, and the soil was losing its vitality," explains Marcus Daley, a third-generation coffee farmer. "If we wanted our children to inherit this farm, we knew we had to fundamentally change how we interact with the land."</p>

      <h3>Embracing Sustainability</h3>
      <p>Farmers across the region are now implementing practices that prioritize the health of the ecosystem over short-term yields. These initiatives are transforming the lush green slopes of the Blue Mountains:</p>
      <ul>
        <li><strong>Shade Farming:</strong> Reintroducing native trees to provide a canopy. This not only protects the coffee plants from extreme weather but also provides a habitat for local wildlife, particularly birds that act as natural pest controllers.</li>
        <li><strong>Organic Composting:</strong> Moving away from synthetic fertilizers, farmers are utilizing coffee pulp and other organic waste to enrich the soil naturally, improving water retention and soil structure.</li>
        <li><strong>Water Conservation:</strong> Implementing efficient irrigation systems and rainwater harvesting to manage water usage sustainably during dry spells.</li>
      </ul>

      <h3>The Impact on Quality and Community</h3>
      <p>The shift towards sustainability is yielding profound results. While the transition can initially reduce yields, farmers are finding that the quality of the coffee is actually improving. The beans develop more slowly under the shade canopy, resulting in a denser bean and a more complex flavor profile—attributes that command premium prices on the international market.</p>
      <blockquote>"By taking care of the soil and the forest, the coffee takes care of itself. We are seeing a return to the truly exceptional flavor notes that made Blue Mountain coffee famous in the first place," noted a local agricultural extension officer.</blockquote>
      <p>Furthermore, these practices are fostering a stronger sense of community. Farmers are forming cooperatives to share knowledge, resources, and organic certification costs, ensuring that the benefits of sustainable farming are distributed more equitably among smallholders.</p>

      <h3>A Sustainable Future</h3>
      <p>The morning mist still rolls over the lush green farms, and farmers still carefully inspect their coffee cherries by hand, much as they have done for generations. But beneath this timeless scene is a profound shift in philosophy. By embracing sustainability, the guardians of the Blue Mountains are ensuring that Jamaica's liquid gold will continue to flow, protecting both their heritage and their environment for generations to come.</p>
    `,
    tags: ['Coffee', 'Agriculture', 'Sustainability', 'Blue Mountains']
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
    }
    
    console.log("All articles processed successfully.");
  } catch (err) {
    console.error("Error generating news:", err);
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

main();
