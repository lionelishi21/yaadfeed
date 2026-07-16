#!/usr/bin/env node

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { MongoClient } = require('mongodb');

async function getLatestArticle() {
  const client = new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || 'yardvybes');
    const collection = db.collection('news_items');

    const article = await collection
      .find({})
      .sort({ publishedAt: -1 })
      .limit(1)
      .toArray();

    return article[0] || null;
  } finally {
    await client.close();
  }
}

async function postToFacebook(article) {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yardvybz.news';

  if (!pageId || !accessToken) {
    console.error('Missing Facebook credentials in .env.local');
    return false;
  }

  const message = `${article.title}\n\nRead more at YardVybz!`;
  const link = `${siteUrl}/news/${article.slug}`;

  console.log(`Posting to Facebook...`);
  console.log(`  Page ID: ${pageId}`);
  console.log(`  Title: ${article.title}`);
  console.log(`  Link: ${link}`);

  const url = `https://graph.facebook.com/v19.0/${pageId}/feed`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      link,
      access_token: accessToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Facebook API error:', JSON.stringify(data.error, null, 2));
    return false;
  }

  console.log(` Successfully posted to Facebook! Post ID: ${data.id}`);
  return true;
}

async function main() {
  console.log(' Fetching latest article from MongoDB...\n');

  const article = await getLatestArticle();

  if (!article) {
    console.error('No articles found in database.');
    process.exit(1);
  }

  console.log(`  ID: ${article._id}`);
  console.log(`  Title: ${article.title}`);
  console.log(`  Slug: ${article.slug}`);
  console.log(`  Published: ${article.publishedAt}\n`);

  const success = await postToFacebook(article);

  if (success) {
    console.log('\n Done!');
    process.exit(0);
  } else {
    console.error('\n Failed to post to Facebook.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Script error:', err);
  process.exit(1);
});
