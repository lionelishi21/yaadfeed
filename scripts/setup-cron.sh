#!/bin/bash

# Setup Cron Job for Daily Scraper
# This script sets up a daily cron job to run the scraper

echo "🕐 Setting up daily cron job for YaadFeed scraper..."

# Get the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DAILY_SCRIPT="$SCRIPT_DIR/run-daily-scraper.sh"

# Make sure the daily script is executable
chmod +x "$DAILY_SCRIPT"

# Create the cron job entry (runs daily at 6:00 AM)
CRON_JOB="0 6 * * * cd $PROJECT_DIR && $DAILY_SCRIPT >> logs/scraper.log 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "run-daily-scraper.sh"; then
    echo "⚠️  Cron job already exists. Removing old entry..."
    crontab -l 2>/dev/null | grep -v "run-daily-scraper.sh" | crontab -
fi

# Add the new cron job
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

# Create logs directory if it doesn't exist
mkdir -p "$PROJECT_DIR/logs"

echo "✅ Cron job set up successfully!"
echo "📅 The scraper will run daily at 6:00 AM"
echo "📝 Logs will be saved to: $PROJECT_DIR/logs/scraper.log"
echo ""
echo "To view current cron jobs:"
echo "  crontab -l"
echo ""
echo "To remove the cron job:"
echo "  crontab -e"
echo "  (then delete the line with run-daily-scraper.sh)"
echo ""
echo "To test the scraper manually:"
echo "  $DAILY_SCRIPT"
