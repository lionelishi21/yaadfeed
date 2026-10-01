// Publish a batch of articles: copy each cover image into public/images/generated
// (served by the site itself), then upsert the article into MongoDB by slug
// (safe to re-run, never creates duplicates).
//
//   node upload_articles.js content/2026-10-01 --dry-run   # validate + copy covers
//   git add public/images/generated && git commit && git push   # deploy the covers
//   node upload_articles.js content/2026-10-01             # publish
//
// A batch directory holds articles.js (exports an array) and covers/<file>.
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const SITE_URL = 'https://yardvybz.news';
const DB_NAME = 'yardvybes';
const IMAGE_HOST = 'https://www.yardvybz.news';
const IMAGE_DIR = path.join(__dirname, 'public', 'images', 'generated');
const MIN_WORDS = 500;
const CONTENT_TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };

const batchDir = process.argv[2];
const dryRun = process.argv.includes('--dry-run');
if (!batchDir || batchDir.startsWith('--')) {
  console.error('Usage: node upload_articles.js <batch-dir> [--dry-run]');
  process.exit(1);
}

const wordCount = (html) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

// Catch thin, incomplete or placeholder content before anything goes live.
function validate(article, coverPath) {
  const problems = [];
  for (const field of ['title', 'slug', 'summary', 'content', 'category', 'cover']) {
    if (!article[field]) problems.push(`missing ${field}`);
  }
  if (article.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(article.slug)) problems.push('slug must be lowercase-with-hyphens');
  if (!Array.isArray(article.tags) || article.tags.length === 0) problems.push('no tags');
  if (article.summary && article.summary.length < 60) problems.push('summary too short');
  if (article.content) {
    const words = wordCount(article.content);
    if (words < MIN_WORDS) problems.push(`only ${words} words (minimum ${MIN_WORDS})`);
    if (/placehold\.co|lorem ipsum/i.test(article.content)) problems.push('placeholder text in content');
  }
  if (article.cover) {
    if (!CONTENT_TYPES[path.extname(article.cover).toLowerCase()]) problems.push(`unsupported cover type: ${article.cover}`);
    else if (!fs.existsSync(coverPath)) problems.push(`cover not found: ${coverPath}`);
  }
  return problems;
}

const imagePathFor = (article) => `/images/generated/${article.slug}${path.extname(article.cover).toLowerCase()}`;

function copyCover(article, coverPath) {
  fs.copyFileSync(coverPath, path.join(IMAGE_DIR, path.basename(imagePathFor(article))));
}

// An article with a broken image is worse than no article, so the cover must
// already be deployed before the article goes into the database.
async function liveImageUrl(article) {
  const url = IMAGE_HOST + imagePathFor(article);
  const res = await fetch(url, { method: 'HEAD' });
  const type = res.headers.get('content-type') || '';
  if (!res.ok || !type.startsWith('image/')) {
    throw new Error(`cover is not live yet (${res.status}): ${url}\n  Commit and push public/images/generated, wait for the deploy, then re-run.`);
  }
  return url;
}

async function run() {
  const articles = require(path.resolve(batchDir, 'articles.js'));
  const coverPathFor = (a) => path.resolve(batchDir, 'covers', a.cover || '');

  let failed = false;
  for (const article of articles) {
    const problems = validate(article, coverPathFor(article));
    const label = `${article.slug} (${article.content ? wordCount(article.content) : 0} words)`;
    if (problems.length) {
      failed = true;
      console.error(`✗ ${label}\n    ${problems.join('\n    ')}`);
    } else {
      console.log(`✓ ${label}`);
    }
  }
  const slugs = articles.map((a) => a.slug);
  if (new Set(slugs).size !== slugs.length) {
    failed = true;
    console.error('✗ duplicate slugs in batch');
  }
  if (failed) process.exit(1);
  for (const article of articles) copyCover(article, coverPathFor(article));
  if (dryRun) {
    console.log(`Dry run: ${articles.length} articles valid, covers copied to public/images/generated, nothing published.`);
    return;
  }

  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing from .env.local');
  // Check every cover before writing anything, so a batch publishes all-or-nothing.
  const imageUrls = new Map();
  for (const article of articles) imageUrls.set(article.slug, await liveImageUrl(article));
  const mongoClient = new MongoClient(process.env.MONGODB_URI);

  try {
    await mongoClient.connect();
    const collection = mongoClient.db(DB_NAME).collection('news_items');

    for (const article of articles) {
      const imageUrl = imageUrls.get(article.slug);
      const now = new Date();
      const result = await collection.updateOne(
        { slug: article.slug },
        {
          $set: {
            title: article.title,
            slug: article.slug,
            url: `${SITE_URL}/news/${article.slug}`,
            summary: article.summary,
            content: article.content,
            category: article.category,
            imageUrl,
            tags: article.tags,
            keywords: article.keywords || [],
            source: article.source || 'YardVybz Exclusive',
            author: article.author || 'YardVybz Staff',
            updatedAt: now,
          },
          $setOnInsert: { publishedAt: now, createdAt: now, viewCount: 0 },
        },
        { upsert: true }
      );
      console.log(`${result.upsertedCount ? 'Published' : 'Updated'}: ${SITE_URL}/news/${article.slug}`);
    }
  } finally {
    await mongoClient.close();
  }
}

run().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
