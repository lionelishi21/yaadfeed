---
name: original-news-generator
description: Generates high-quality, original news articles for YaadFeed. Use this skill when the user asks to "generate today's news", "write new articles", or "run the original news generator".
---

# Original News Generator Workflow

When the user asks you to generate new articles or run the news generator, follow these exact steps to ensure high-quality, AdSense-compliant content is created and published.

## Step 1: Brainstorm Topics
1. Propose 3-5 trending topics related to Jamaican culture, dancehall, sports, business, or politics. You can search the web for recent events or invent highly plausible, engaging stories.
2. Ensure the topics are diverse and interesting to the Jamaican diaspora.

## Step 2: Draft Articles
1. For each topic, write a very long, comprehensive, and highly-detailed original article (at least 600-800 words minimum). **Do not write short or "thin" articles.**
2. To achieve this length, include: deep background context, multiple subheadings, detailed analysis, and fictional but highly plausible quotes from relevant figures.
3. Format the content using HTML tags (`<p>`, `<h3>`, `<blockquote>`, `<ul>`) so it renders beautifully and looks like a massive editorial piece.
4. Ensure the tone is professional, engaging, and culturally relevant. 
5. The `source` should always be set to `'YardVybz Exclusive'`.

## Step 3: Generate Images
1. Use the `generate_image` tool to create a stunning, highly detailed AI image for **each** article.
2. The image prompt should specify "high quality photography", relevant subjects, and a Jamaican context.

## Step 4: Insert into Database & Upload Images
1. Write a Node.js script in the `scratch/` directory (or workspace root) that does the following:
   a. Uses the `@aws-sdk/client-s3` SDK to upload each generated image to the S3 bucket `yaadfeed-news-media-1785480321` (region: `us-east-1`). Use the env vars `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` loaded via `dotenv` from `.env.local`.
   b. Uses the `mongodb` SDK to insert these articles into the `news_items` collection.
2. The article object should look like this:
   ```javascript
   {
     title: 'Article Title',
     slug: 'article-title-slug',
     url: 'https://yardvybz.news/news/article-title-slug',
     summary: 'A short 1-2 sentence summary.',
     content: '<p>Full HTML content here...</p>',
     category: 'entertainment', // Or sports, business, culture, politics
     imageUrl: 'https://yaadfeed-news-media-1785480321.s3.us-east-1.amazonaws.com/news/...', // The S3 public URL
     publishedAt: new Date(),
     createdAt: new Date(),
     updatedAt: new Date(),
     source: 'YardVybz Exclusive',
     author: 'YardVybz Staff',
     tags: ['Tag1', 'Tag2']
   }
   ```
3. Run the script using the `run_command` tool to execute the uploads and database insertion simultaneously.

## Step 5: Inform the User
Inform the user that the images have been uploaded to Cloudinary and the articles are live in the database. Since the pages are dynamically rendered and the images are hosted remotely, the new articles will be visible immediately on the site without waiting for a Vercel rebuild.
