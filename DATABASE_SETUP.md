# YaadFeed Database Setup Guide

## 🔧 MongoDB Integration Complete!

Your news system has been upgraded from static files to dynamic database fetching with **daily web scraping** using **MongoDB running locally**. Here's how to set it up:

## 📋 What Changed

✅ **API Routes Created:**
- `/api/news` - Fetch all news articles with filtering
- `/api/news/[slug]` - Fetch individual articles by slug or ID
- `/api/scrape` - Manually trigger news scraping
- `/api/cron/scrape` - Automated daily scraping endpoint

✅ **Web Scraping System:**
- Daily automated scraping at 12 AM
- Scrapes Jamaica Gleaner, Jamaica Observer, Jamaica Star
- Automatic deduplication (no duplicate articles)
- Content categorization (sports, entertainment, politics, etc.)
- SEO-friendly slug generation
- Automatic cleanup of old articles (30+ days)

✅ **Pages Updated:**
- `/news` - Now fetches ONLY from database (no static fallback)
- `/news/[slug]` - Dynamic content from scraped articles

✅ **Features Added:**
- Real-time Jamaican news content
- Automatic content categorization
- View count tracking
- Related articles
- Search and filtering
- Daily content refresh

## 🚀 Quick Setup (MongoDB Local)

### 1. Install MongoDB Locally

**macOS (using Homebrew):**
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Verify installation
mongosh --eval "db.adminCommand('ismaster')"
```

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install and start as a Windows service
3. Add MongoDB to PATH
4. Test with `mongosh` in command prompt

**Linux (Ubuntu/Debian):**
```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Set Environment Variables
Create `.env.local` in your root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=yaadfeed

# Scraper Authentication
SCRAPER_API_KEY=development-scraper-key
CRON_SECRET=your-cron-secret-key

# App Configuration (for production)
NEXT_PUBLIC_SITE_URL=http://localhost:3002
```

### 3. Verify MongoDB Connection
Test your MongoDB connection:

```bash
# Connect to MongoDB shell
mongosh

# Switch to yaadfeed database
use yaadfeed

# Check if connected
db.getName()

# Exit
exit
```

### 4. Test the Application
Once MongoDB is running, start your Next.js app:

```bash
cd yaadfeed
npm run dev
```

The app will automatically:
- Connect to MongoDB
- Create the `yaadfeed` database
- Create the `news_items` collection
- Set up indexes for performance

### 5. Test Manual Scraping
Test the scraper to populate your database:

```bash
# Manual scraping test
curl -X POST http://localhost:3002/api/scrape \
  -H "Authorization: Bearer development-scraper-key" \
  -H "Content-Type: application/json"

# Check scraper status
curl http://localhost:3002/api/scrape
```

## 🕛 Daily Automated Scraping

### Local Development:
The scraper runs when triggered manually. For daily automation in production, deploy to Vercel.

### Production (Vercel):
The `vercel.json` configuration automatically sets up:
- Daily cron job at 12:00 AM UTC
- Scrapes all Jamaican news sources
- Only adds new articles (deduplication)
- Cleans up articles older than 30 days

**For production, you'll need MongoDB Atlas:**
1. Create a free MongoDB Atlas account
2. Create a cluster and get connection string
3. Update `MONGODB_URI` in Vercel environment variables

## 🧪 Test the Integration

1. **Check API endpoints:**
   - `http://localhost:3002/api/news` - Should return scraped articles
   - `http://localhost:3002/api/news/[article-slug]` - Should return specific article

2. **Check scraping:**
   - `http://localhost:3002/api/scrape` - Manual scraping endpoint
   - `http://localhost:3002/api/cron/scrape` - Cron endpoint (needs auth)

3. **Check pages:**
   - `/news` - Should load articles from database only
   - `/news/[article-slug]` - Should load specific scraped article

4. **Check MongoDB data:**
   ```bash
   mongosh
   use yaadfeed
   db.news_items.find().limit(5).pretty()
   db.news_items.countDocuments()
   ```

## 🎯 MongoDB Collections & Schema

### `news_items` Collection:
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String (unique),
  summary: String,
  content: String,
  imageUrl: String,
  category: String,
  source: String,
  url: String (unique),
  publishedAt: Date,
  author: String,
  tags: [String],
  keywords: [String],
  isPopular: Boolean,
  viewCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes Created:
- `publishedAt: -1` - Latest articles first
- `category: 1` - Filter by category
- `slug: 1` - Unique article URLs
- `url: 1` - Prevent duplicates
- `isPopular: 1` - Featured articles
- `source: 1` - Filter by news source
- `title: text, content: text` - Full-text search

## 🎯 Scraping Features

### News Sources:
- **Jamaica Gleaner** - `jamaica-gleaner.com`
- **Jamaica Observer** - `jamaicaobserver.com`  
- **Jamaica Star** - `jamaica-star.com`

### Automatic Categorization:
- **Sports** - Athletics, cricket, football, etc.
- **Entertainment** - Music, reggae, dancehall, celebrities
- **Politics** - Government, elections, policy
- **Business** - Economy, tourism, trade
- **Culture** - Heritage, traditions, festivals
- **Health** - Medical news, healthcare
- **Education** - Schools, universities, exams
- **Local** - General Jamaica news

### Content Processing:
- **Deduplication** - No duplicate articles by title/URL
- **SEO Slugs** - Automatic URL-friendly slugs
- **Summaries** - Auto-generated article summaries  
- **Tags & Keywords** - Automatic content tagging
- **Image Extraction** - Featured image detection
- **Author Detection** - Byline extraction

## 🔍 Troubleshooting

**If no articles appear:**
1. Check if MongoDB is running: `brew services list | grep mongodb`
2. Check environment variables in `.env.local`
3. Run manual scraping: `/api/scrape`
4. Check MongoDB connection in app logs

**If MongoDB connection fails:**
- Ensure MongoDB service is running
- Check connection string in `.env.local`
- Verify database permissions
- Try connecting with `mongosh`

**If scraping fails:**
- Check network connectivity
- Verify news source websites are accessible
- Check scraper logs in API responses
- Monitor MongoDB insertions: `db.news_items.find().count()`

**Daily scraping not working:**
- Ensure `CRON_SECRET` environment variable is set
- Check Vercel cron logs in dashboard
- Verify `vercel.json` cron configuration

## 📊 MongoDB Useful Commands

```bash
# Connect to database
mongosh
use yaadfeed

# View collections
show collections

# Count articles
db.news_items.countDocuments()

# Find latest articles
db.news_items.find().sort({publishedAt: -1}).limit(5)

# Find articles by category
db.news_items.find({category: "sports"})

# Check indexes
db.news_items.getIndexes()

# Drop collection (if needed)
db.news_items.drop()
```

## 🚀 Next Steps

1. **Monitor Scraping:** Check daily scraping logs
2. **Database Maintenance:** Monitor collection size and performance
3. **Content Moderation:** Review auto-categorization accuracy  
4. **SEO Optimization:** Monitor search performance
5. **User Analytics:** Track popular articles and categories
6. **Content Expansion:** Add more Jamaican news sources

Your news system now automatically fetches fresh Jamaican content daily with MongoDB! 🇯🇲📰🍃 