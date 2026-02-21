#!/bin/bash

# Daily scraper script for YaadFeed
# This script runs the news scraper and AI automation tasks

# Configuration
BASE_URL="http://localhost:4000"
CRON_SECRET="your-cron-secret"  # Updated to match the default in the API route

echo "🕐 Starting daily scraper at $(date)"

# Step 1: Run news scraper
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 📰 Running news scraper..."
SCRAPER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/cron/scrape/" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json")

if [[ $? -eq 0 ]]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Scraper completed successfully"
  echo "$SCRAPER_RESPONSE"
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ Scraper failed"
fi

# Wait a bit for processing
sleep 5

# Step 2: Run AI automation tasks
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🤖 Running AI automation tasks..."
AUTOMATION_RESPONSE=$(curl -s -X POST "$BASE_URL/api/automation/run" \
  -H "Content-Type: application/json" \
  -d '{
    "tasks": ["generate-images", "link-artists", "optimize-content", "categorize-articles"]
  }')

if [[ $? -eq 0 ]]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ AI automation completed successfully"
  echo "$AUTOMATION_RESPONSE"
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ AI automation failed"
fi

# Step 3: Generate missing images
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🎨 Generating missing images..."
IMAGE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/admin/generate-missing-images" \
  -H "Content-Type: application/json")

if [[ $? -eq 0 ]]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Image generation completed"
  echo "$IMAGE_RESPONSE"
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ Image generation failed"
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🎉 Daily scraper and AI orchestration completed!"

# Optional: Send notification to webhook (uncomment and configure if needed)
# curl -X POST "YOUR_WEBHOOK_URL" -H "Content-Type: application/json" \
#     -d '{"text": "Daily scraper completed successfully at $(date)"}'
