import { artistSpotlightScraper } from '@/lib/scrapers/artistSpotlightScraper';

/**
 * Weekly scraper cron job
 * This would typically be set up with a service like:
 * - Vercel Cron Jobs
 * - GitHub Actions
 * - AWS Lambda with EventBridge
 * - Node-cron for local development
 */

export class WeeklyScraperCron {
  private static instance: WeeklyScraperCron;
  private isRunning: boolean = false;

  private constructor() {}

  public static getInstance(): WeeklyScraperCron {
    if (!WeeklyScraperCron.instance) {
      WeeklyScraperCron.instance = new WeeklyScraperCron();
    }
    return WeeklyScraperCron.instance;
  }

  /**
   * Run the weekly scraper job
   */
  public async runWeeklyScraper(): Promise<void> {
    if (this.isRunning) {
      console.log('⏭️ [WEEKLY SCRAPER CRON] Scraper already running, skipping...');
      return;
    }

    this.isRunning = true;
    console.log('🚀 [WEEKLY SCRAPER CRON] Starting weekly artist spotlight scraper...');

    try {
      const startTime = Date.now();
      
      // Run the scraper
      const newReleases = await artistSpotlightScraper.scrapeNewReleases();
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`✅ [WEEKLY SCRAPER CRON] Completed successfully in ${duration}ms`);
      console.log(`📊 [WEEKLY SCRAPER CRON] Found ${newReleases.length} new releases`);

      // Log summary
      if (newReleases.length > 0) {
        console.log('🎵 [WEEKLY SCRAPER CRON] New releases found:');
        newReleases.forEach(release => {
          console.log(`  - ${release.artistName}: "${release.songTitle}" (${release.status})`);
        });
      }

    } catch (error) {
      console.error('❌ [WEEKLY SCRAPER CRON] Error during weekly scrape:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Get cron job status
   */
  public getStatus(): {
    isRunning: boolean;
    lastRun?: Date;
    nextRun?: Date;
  } {
    return {
      isRunning: this.isRunning,
      // In a real implementation, you'd store these in a database
      lastRun: undefined,
      nextRun: undefined
    };
  }
}

// Export singleton instance
export const weeklyScraperCron = WeeklyScraperCron.getInstance();

/**
 * Vercel Cron Job Handler
 * This would be called by Vercel's cron service
 */
export async function handleWeeklyScraper() {
  console.log('⏰ [VERCEL CRON] Weekly scraper triggered');
  await weeklyScraperCron.runWeeklyScraper();
}

/**
 * Manual trigger for testing
 */
export async function triggerWeeklyScraper() {
  console.log('🔧 [MANUAL TRIGGER] Weekly scraper manually triggered');
  await weeklyScraperCron.runWeeklyScraper();
}
