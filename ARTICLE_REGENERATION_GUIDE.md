# YaadFeed Article Regeneration & AI Image Generation Guide

This guide covers the complete article regeneration system that uses **ChatGPT** for content generation and **DALL-E** for AI image creation.

## 🎯 Overview

The article regeneration system provides:
- **ChatGPT-powered article generation** with authentic Jamaican content
- **DALL-E 3 image generation** for all articles
- **Intelligent prompting** for category-specific content and visuals
- **Batch processing** with API rate limiting
- **Database integration** with MongoDB
- **Fallback systems** for reliability

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install openai mongodb
```

### 2. Set Environment Variables
Add to your `.env.local`:
```bash
# OpenAI Configuration (Required)
OPENAI_API_KEY=sk-your-openai-api-key-here

# MongoDB Configuration (Required)
MONGODB_URI=mongodb://localhost:27017/yaadfeed

# Next.js Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3002
```

### 3. Start Your Development Server
```bash
npm run dev
```

### 4. Generate Articles
Choose one of these methods:

#### Method 1: Using npm scripts (Recommended)
```bash
# Generate 10 articles (default)
npm run regenerate

# Generate 15 articles
npm run regenerate:15

# Update existing articles with AI images
npm run regenerate:images

# Show help
npm run regenerate:help
```

#### Method 2: Using the script directly
```bash
# Generate 20 articles
node scripts/regenerate-articles.js --count=20

# Update existing articles with images
node scripts/regenerate-articles.js --mode=update-images
```

#### Method 3: Direct API calls
```bash
# Generate new articles
curl -X POST "http://localhost:3002/api/regenerate-articles?count=10&mode=generate"

# Update existing images
curl -X POST "http://localhost:3002/api/regenerate-articles?mode=update-images"
```

## 📋 Features

### 🤖 ChatGPT Article Generation
- **Authentic Jamaican voice** and perspective
- **Professional journalism standards**
- **Category-specific content** (Politics, Sports, Culture, Music, etc.)
- **Realistic quotes** and references
- **Proper article structure** with headlines, summaries, and keywords

### 🎨 DALL-E Image Generation
- **High-quality 1024x1024 images** using DALL-E 3
- **Intelligent prompting** based on article content and category
- **Music/Dancehall specialization** for entertainment content
- **Jamaican cultural context** in all visuals
- **Automatic fallbacks** to Unsplash if DALL-E fails

### 📊 Smart Content Categories
- **Politics**: Government buildings, professional settings
- **Sports**: Athletic competitions, stadiums
- **Music/Dancehall**: Studio scenes, festival atmospheres
- **Business**: Modern offices, economic growth
- **Culture**: Traditional arts, heritage celebrations
- **Health**: Medical facilities, wellness themes

## 🔧 Configuration Options

### Script Arguments
```bash
--count=N          # Number of articles to generate (default: 10)
--mode=MODE        # "generate" or "update-images" (default: generate)
--port=PORT        # Server port (default: 3002)
--help            # Show help message
```

### Environment Variables
```bash
# Required
OPENAI_API_KEY=sk-...           # Your OpenAI API key
MONGODB_URI=mongodb://...       # MongoDB connection string

# Optional
NEXT_PUBLIC_SITE_URL=http://... # Your site URL (default: localhost:3002)
```

## 📝 Generated Content Examples

### Sample Topics
The system generates articles about:
- **Music**: "New dancehall riddim taking over the airwaves"
- **Sports**: "Jamaican sprinter breaks world record at Diamond League"
- **Business**: "Jamaica Stock Exchange reaches all-time high"
- **Politics**: "Education reform bill passes in Parliament"
- **Culture**: "Bob Marley Museum unveils new exhibition"

### Article Structure
Each generated article includes:
```javascript
{
  title: "Engaging headline",
  summary: "2-3 sentence summary",
  content: "Full 400-600 word article",
  category: "politics|sports|music|etc",
  keywords: ["keyword1", "keyword2", ...],
  author: "Realistic Jamaican journalist name",
  slug: "url-friendly-slug",
  readTime: 3, // Calculated reading time
  imageUrl: "https://dalle-generated-image-url",
  publishedAt: "2024-01-15T10:00:00Z",
  isPopular: true/false
}
```

## 🎨 Image Generation Details

### DALL-E Prompting Strategy
The system uses intelligent prompts based on:
- **Article title and content**
- **Category-specific themes**
- **Jamaican cultural context**
- **Music genre detection** (reggae, dancehall, etc.)

### Example Prompts
- **Music**: "Vibrant dancehall music festival scene in Jamaica with colorful stage lights, excited crowd, tropical setting, reggae atmosphere, photorealistic, high quality"
- **Sports**: "Jamaican sports scene, athletic competition, vibrant stadium atmosphere, caribbean setting, photorealistic, high quality"
- **Politics**: "Modern jamaican government building, professional political setting, caribbean architecture, formal atmosphere, photorealistic"

### Fallback System
If DALL-E generation fails:
1. **Automatic fallback** to Unsplash images
2. **Category-specific keywords** for relevant stock photos
3. **Error logging** for debugging
4. **Graceful degradation** - articles still created

## 📊 API Endpoints

### POST /api/regenerate-articles
Generate new articles or update existing ones.

**Parameters:**
- `count` (number): Articles to generate (default: 10)
- `mode` (string): "generate" or "update-images" (default: "generate")

**Response:**
```javascript
{
  success: true,
  message: "Successfully generated 10 new articles",
  count: 10,
  articles: [...], // Array of generated articles
  mode: "generate"
}
```

### GET /api/regenerate-articles
Get API status and usage information.

## 🔍 Monitoring & Debugging

### Console Output
The system provides detailed logging:
```
🚀 Starting generation of 10 articles...
🤖 Generating article content for: Reggae Revival movement gaining international attention
✅ Generated article: Reggae Revival Movement Captures Global Attention
🎨 Generating image for article 1...
📝 Prompt: Vibrant jamaican reggae scene, cultural revival movement...
✅ Generated image for: Reggae Revival Movement Captures Global Attention
📸 Processing article 1/10: Reggae Revival Movement Captures Global Attention...
💾 Saving 10 articles to database...
✅ Successfully saved 10 articles to database!
🎉 Content regeneration completed successfully!
```

### Error Handling
- **API key validation**
- **MongoDB connection checks**
- **Rate limit handling**
- **Graceful fallbacks**
- **Detailed error messages**

## 💡 Best Practices

### 1. API Rate Limits
- **DALL-E**: Max 50 images per minute
- **ChatGPT**: 3,500 requests per minute (GPT-4)
- **Built-in delays**: 1-2 seconds between requests

### 2. Cost Management
- **Selective DALL-E usage**: First 5 articles + music content get AI images
- **Fallback to Unsplash**: For remaining articles to save costs
- **Batch processing**: Generate multiple articles efficiently

### 3. Content Quality
- **Authentic Jamaican voice**: Uses local expressions and references
- **Factual accuracy**: References real locations and institutions
- **SEO optimization**: Proper keywords and meta tags
- **Readable content**: Proper formatting and structure

## 🛠️ Troubleshooting

### Common Issues

#### 1. OpenAI API Key Issues
```bash
❌ OpenAI API key not configured
```
**Solution**: Add `OPENAI_API_KEY=sk-...` to `.env.local`

#### 2. MongoDB Connection Failed
```bash
❌ Failed to connect to MongoDB
```
**Solution**: Check MongoDB is running and `MONGODB_URI` is correct

#### 3. Server Not Running
```bash
❌ Failed to connect to YaadFeed server
```
**Solution**: Start development server with `npm run dev`

#### 4. Rate Limit Errors
```bash
❌ DALL-E generation failed: Rate limit exceeded
```
**Solution**: Wait a few minutes and try again, or reduce batch size

### Debug Mode
Enable detailed logging by setting:
```bash
NODE_ENV=development
```

## 📈 Performance Metrics

### Typical Generation Times
- **Article generation**: 5-10 seconds per article
- **Image generation**: 10-15 seconds per image
- **Database saving**: 1-2 seconds per article
- **Total for 10 articles**: 3-5 minutes

### API Costs (Approximate)
- **GPT-4**: ~$0.03 per article
- **DALL-E 3**: ~$0.04 per image
- **Total per article**: ~$0.07 (with image)

## 🔄 Automation Options

### Scheduled Generation
Add to your cron jobs for automated content:
```bash
# Generate 5 new articles daily at 6 AM
0 6 * * * cd /path/to/yaadfeed && npm run regenerate:5

# Update images weekly on Sundays at midnight
0 0 * * 0 cd /path/to/yaadfeed && npm run regenerate:images
```

### GitHub Actions
Create `.github/workflows/regenerate-content.yml`:
```yaml
name: Regenerate Content
on:
  schedule:
    - cron: '0 6 * * *' # Daily at 6 AM
  workflow_dispatch: # Manual trigger

jobs:
  regenerate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Regenerate articles
        run: npm run regenerate:15
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          MONGODB_URI: ${{ secrets.MONGODB_URI }}
```

## 🎉 Success Metrics

After successful regeneration, you should see:
- ✅ **New articles** appearing on your homepage
- ✅ **High-quality images** for all articles
- ✅ **Authentic Jamaican content** with proper cultural context
- ✅ **SEO-optimized** titles and descriptions
- ✅ **Database entries** with proper metadata

The system transforms YaadFeed from a static site into a dynamic, AI-powered news platform with authentic Jamaican content and stunning visuals! 🇯🇲✨ 