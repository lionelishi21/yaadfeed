# Auto Image Generation for Daily Scraping

## Overview
The YaadFeed application now automatically generates AI images for all new articles during the daily scraping process at 12 AM.

## How It Works

### 1. Daily Scraping Process
- **Time**: 12 AM daily (via Vercel cron job)
- **Process**: Scrapes news from Jamaican sources (Gleaner, Observer, Star)
- **Image Generation**: Automatically generates AI images for each new article

### 2. Image Generation Flow
```typescript
// For each new article during scraping:
1. Extract article title, category, and keywords
2. Generate AI image using DALL-E
3. Save image to /public/images/generated/
4. Update article with image URL
5. Mark as 'ai-generated' status
```

### 3. Key Features
- ✅ **Automatic**: No manual intervention required
- ✅ **Cost-effective**: ~$0.04 per image
- ✅ **Fallback**: Uses placeholder if AI generation fails
- ✅ **Categorized**: Images match article categories
- ✅ **Optimized**: Images are optimized for web display

## Files Modified

### 1. `src/lib/scraper.ts`
- Added `ImageService` import
- Modified `saveArticle()` method to generate AI images
- Added error handling for image generation
- Added image status tracking

### 2. `src/app/api/cron/scrape/route.ts`
- Enhanced logging for image generation
- Added image generation status to response

### 3. `scripts/test-scraping-with-images.js`
- Test script to verify image generation
- Run with: `npm run test-scraping`

## Daily Cron Job

### Vercel Cron Configuration
```json
{
  "crons": [
    {
      "path": "/api/cron/scrape",
      "schedule": "0 12 * * *"
    }
  ]
}
```

### Environment Variables Required
```env
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
CRON_SECRET=your_cron_secret
```

## Testing

### Manual Test
```bash
npm run test-scraping
```

### Expected Output
```
🧪 Testing Scraping with AI Image Generation
═══════════════════════════════════════════════════
✅ Connected to database
🔍 Starting test scrape with AI image generation...
📝 This will scrape a few articles and generate AI images for each

📊 Test Results:
   ✅ Articles added: 3
   ⏭️ Articles skipped: 5
   ❌ Errors: 0

🎨 AI Image Generation Status:
   ✅ Each new article should have an AI-generated image
   📁 Images saved to: /public/images/generated/
   💰 Estimated cost: ~$0.12
```

## Cost Estimation

### Daily Costs
- **Average articles per day**: 5-10
- **Cost per image**: $0.04
- **Daily cost**: $0.20 - $0.40
- **Monthly cost**: $6 - $12

### Cost Optimization
- Images are cached and reused
- Only new articles generate images
- Fallback images used on errors

## Monitoring

### Logs to Watch
```
🎨 Generating AI image for: [Article Title]...
✅ AI image generated: /images/generated/...
❌ Failed to generate AI image for: [Article Title]
```

### Database Status
- `imageStatus`: 'ai-generated' | 'fallback' | 'pending'
- `needsImageGeneration`: false (for generated images)

## Troubleshooting

### Common Issues
1. **OpenAI API errors**: Check API key and quota
2. **Image save errors**: Check file permissions
3. **Database errors**: Check MongoDB connection

### Debug Commands
```bash
# Check image generation status
npm run check-missing-images

# Test scraping with images
npm run test-scraping

# View generated images
ls -la public/images/generated/
```

## Benefits

1. **Automatic**: No manual image generation needed
2. **Consistent**: All articles have relevant images
3. **SEO-friendly**: Images improve article visibility
4. **Cost-effective**: Minimal cost for high-quality images
5. **Scalable**: Handles any number of daily articles 