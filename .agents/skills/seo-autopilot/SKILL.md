---
name: seo-autopilot
description: Use this skill to act as an automated SEO content generator. It will research trending keywords, write highly optimized articles, generate images, and publish them to YaadFeed.
---
# SEO Autopilot Workflow

When the user asks you to run the SEO Autopilot, follow these steps exactly:

## Step 1: Keyword & Trend Research
1. Use the `search_web` tool to find the most trending topics in Jamaica right now (or whatever specific niche the user requests). Look for news, sports, culture, or entertainment.
2. Identify 1 to 3 high-volume keyword phrases from those trends.

## Step 2: Content Generation (The SEO Standard)
For each keyword phrase, generate a comprehensive, highly engaging article that includes:
1. **SEO Meta Data:** A compelling title tag (under 60 characters) and a meta description summary (under 160 characters).
2. **Structure:** Use proper HTML tags (`<h3>`, `<p>`, `<blockquote>`, `<ul>`, `<li>`) so the formatting looks professional when rendered on the site.
3. **Keyword Density:** Naturally weave the primary keyword phrase into the first paragraph, a few subheadings, and the conclusion. Do not sound robotic.
4. **Readability:** Keep paragraphs relatively short and use formatting (bolding, italics) to make the text skimmable.

## Step 3: Visual Generation
Use the `generate_image` tool to create a high-quality, relevant image for the article. Use prompts like "high quality photography, cinematic lighting, photorealistic" to ensure premium visuals.

## Step 4: Automated Publishing
Create a Node.js script in the `scratch/` directory (e.g., `scratch/generate_autopilot_news.js`) to publish the articles.

**The script must:**
1. Connect to AWS S3 using `@aws-sdk/client-s3` and the credentials from `.env.local`.
2. Read the generated image from your local filesystem and upload it to the S3 bucket (`yaadfeed-news-media-1785480321`). Ensure the `ContentType` is set to `image/png`.
3. Connect to MongoDB using the `MONGODB_URI` from `.env.local`.
4. Insert the fully formatted HTML article, meta summary, title, and S3 image URL directly into the `news_items` collection.
5. Use `upsert: true` matching on the `slug` to avoid duplicates.

## Step 5: Execution
1. Run the Node.js script using the `run_command` tool.
2. Verify the output to ensure the articles and images were successfully uploaded.
3. Inform the user of the newly published articles.
