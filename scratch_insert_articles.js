require('dotenv').config({ path: '.env.local' });
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { MongoClient } = require('mongodb');
const fs = require('fs');

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadImage = async (filePath, key) => {
  if (!fs.existsSync(filePath)) {
    console.log(`Image not found at ${filePath}, skipping upload.`);
    return 'https://placehold.co/800x600/0B0B0B/FFF?text=Jamaica+Public+Sector';
  }
  const fileContent = fs.readFileSync(filePath);
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `news/${key}`,
    Body: fileContent,
    ContentType: 'image/jpeg',
  });
  await s3.send(command);
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/news/${key}`;
};

const articles = [
  {
    title: 'Unpacking Jamaica’s Public Sector Salary Structure: How We Compare',
    slug: 'jamaica-public-sector-salary-structure-analysis',
    url: 'https://yardvybz.news/news/jamaica-public-sector-salary-structure-analysis',
    summary: 'A recent regional study reveals that Jamaica\'s public sector salary structure is significantly more stretched than its Caribbean counterparts, despite a massive 2022 restructuring that streamlined 325 pay scales down to just 16 core bands.',
    content: '<p>A groundbreaking regional study by Dawgen Global has cast a spotlight on the intricacies of Jamaica\'s public service compensation, revealing a system that is fundamentally different in structure from its Caribbean neighbours.</p><h3>The 2022 Restructuring</h3><p>In 2022, Jamaica undertook a massive restructuring of its public service pay scales. A system that once carried 325 separate, fragmented salary scales was consolidated into just 16 core bands. Interestingly, these core bands share a mathematically precise geometry: each contains 13 points (or 12 steps), with each step representing a 2.5% increase. As a result, the maximum salary in any core band is exactly 1.3449 times its minimum.</p><p>Specialized sectors like health (nurses, allied health) and the disciplined services were placed on separate ladders using 8 and 9 points respectively, but impressively, they still utilize the exact same 2.5% increment formula.</p><h3>A Stretched Salary Scale</h3><p>Where Jamaica truly stands apart from its regional peers is in its "compression ratio"—the gap between the lowest and highest paid public servants. The report reveals that Jamaica\'s public service is more than three times as stretched as comparators like Barbados and the Cayman Islands.</p><p>At the floor of the civil service, Jamaica pays its lowest substantive grades roughly US$6,200 annually. In stark contrast, the lowest grade in Barbados earns about US$12,900, while in the Cayman Islands it jumps to US$43,200. However, at the senior levels, the narrative shifts. A Permanent Secretary in Jamaica sits on a band ranging from about US$108,000 to US$145,000, significantly higher than the roughly US$82,000 paid to their Barbadian counterparts.</p><h3>The Hidden Weight of Allowances</h3><p>The study also highlighted a critical caveat when analyzing Jamaican public sector pay: basic salary is only part of the story. Historically, Jamaica\'s pre-restructuring system carried around 185 separate allowances. Even today, allowances can dramatically alter compensation totals. For instance, a travelling allowance for a Pay Band 7 post can represent over 25% of the basic pay—and importantly, it is non-taxable.</p><p>Ultimately, while international salary aggregators often miss the mark due to a lack of data, this deep dive provides a rare, transparent look at how Jamaica rewards its public servants compared to the rest of the Caribbean.</p>',
    category: 'business',
    imagePath: 'placeholder',
    imageKey: 'jamaica_public_sector_' + Date.now() + '.jpg',
    source: 'Dawgen Global / YardVybz Edit',
    author: 'YardVybz Staff',
    tags: ['Public Sector', 'Salary', 'Jamaica Economy']
  }
];

const run = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || 'yardvybes');
    const collection = db.collection('news_items');

    for (const article of articles) {
      console.log(`Uploading image for ${article.title}...`);
      const imageUrl = await uploadImage(article.imagePath, article.imageKey);
      console.log(`Uploaded to ${imageUrl}`);

      const doc = {
        title: article.title,
        slug: article.slug,
        url: article.url,
        summary: article.summary,
        content: article.content,
        category: article.category,
        imageUrl: imageUrl,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        source: article.source,
        author: article.author,
        tags: article.tags
      };

      await collection.updateOne(
        { slug: doc.slug },
        { $set: doc },
        { upsert: true }
      );
      console.log(`Inserted article: ${article.title}`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
};

run();
