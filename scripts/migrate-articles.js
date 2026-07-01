#!/usr/bin/env node

require('dotenv').config();

const HELP_TEXT = `
🇯🇲 YaadFeed Article Migration Tool

This script migrates existing plain-text articles to the new rich HTML format and ensures they all have images.
`;

async function main() {
  if (!process.env.OPENAI_API_KEY || !process.env.MONGODB_URI) {
    console.error('❌ OPENAI_API_KEY and MONGODB_URI are required');
    process.exit(1);
  }

  try {
    const { connectToDatabase } = require('../src/lib/mongodb');
    const { ArticleGenerator } = require('../src/lib/articleGenerator');
    const { ImageService } = require('../src/lib/imageService');
    const { ObjectId } = require('mongodb');

    const { db } = await connectToDatabase();
    const articlesCollection = db.collection('news_items');
    const articles = await articlesCollection.find({}).sort({ publishedAt: -1 }).toArray();

    console.log(`Found ${articles.length} total articles.`);

    // To prevent massive cost/time, limit to latest 50 articles.
    const limit = 50;
    let processedCount = 0;
    let migratedTextCount = 0;
    let migratedImageCount = 0;

    for (const article of articles) {
      if (processedCount >= limit) {
        console.log(`Reached limit of ${limit} articles.`);
        break;
      }

      const content = article.content || article.summary || '';
      const hasHtml = /<(p|br|h[1-6]|ul|ol|li|blockquote)[^>]*>/i.test(content);
      const hasImage = !!article.imageUrl && article.imageUrl !== '';

      if (hasHtml && hasImage) {
        // Skip, already migrated
        continue;
      }

      console.log(`\nMigrating article: "${article.title}"...`);
      const updateData = {};

      if (!hasHtml) {
        console.log(`- Converting text to rich HTML format...`);
        // We use the article title as the topic to regenerate it in rich HTML
        const newContent = await ArticleGenerator.generateArticleContent(article.title, article.category || 'general');
        if (newContent && newContent.content) {
          updateData.content = newContent.content;
          updateData.summary = newContent.summary || article.summary;
          migratedTextCount++;
        }
      }

      if (!hasImage) {
        console.log(`- Generating missing image...`);
        const imageUrl = await ImageService.getImageForArticle(
          article.title, 
          article.category || 'general', 
          article.keywords || [], 
          article.summary || '', 
          0, 
          true
        );
        if (imageUrl && !imageUrl.includes('placeholder')) {
          updateData.imageUrl = imageUrl;
          migratedImageCount++;
        }
      }

      if (Object.keys(updateData).length > 0) {
        await articlesCollection.updateOne(
          { _id: article._id },
          { $set: updateData }
        );
        console.log(`✅ Saved updates to database.`);
      }

      processedCount++;
      // Sleep slightly to respect rate limits
      await new Promise(r => setTimeout(r, 1000));
    }

    console.log('\n✅ MIGRATION COMPLETE!');
    console.log(`- Articles checked: ${processedCount}`);
    console.log(`- Articles converted to HTML: ${migratedTextCount}`);
    console.log(`- Images generated: ${migratedImageCount}`);
    process.exit(0);

  } catch (error) {
    console.error('\n❌ SCRIPT ERROR:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
