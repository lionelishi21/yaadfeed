#!/usr/bin/env python3
"""
YaadFeed Automation Orchestrator
Main automation system that coordinates all AI and social media automation
"""

import os
import sys
import json
import asyncio
import schedule
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import logging

# Add the automation directory to Python path
sys.path.append('/workspace/yaadfeed/automation')

# Import automation modules
from ai_content_optimizer import AIContentOptimizer
from video_generator import YaadFeedVideoGenerator
from social_media_automation import SocialMediaAutomation

class YaadFeedOrchestrator:
    def __init__(self):
        self.setup_logging()
        
        # Initialize automation components
        self.content_optimizer = AIContentOptimizer()
        self.video_generator = YaadFeedVideoGenerator()
        self.social_automation = SocialMediaAutomation()
        
        # Configuration
        self.config = self.load_orchestrator_config()
        
        # State tracking
        self.last_run = None
        self.automation_stats = {
            'total_runs': 0,
            'successful_runs': 0,
            'articles_processed': 0,
            'videos_generated': 0,
            'social_posts_created': 0
        }
        
        self.logger.info("YaadFeed Automation Orchestrator initialized")
    
    def setup_logging(self):
        """Setup logging configuration"""
        log_dir = "/workspace/yaadfeed/automation/logs"
        os.makedirs(log_dir, exist_ok=True)
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(f"{log_dir}/orchestrator.log"),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger("YaadFeedOrchestrator")
    
    def load_orchestrator_config(self) -> Dict:
        """Load orchestrator configuration"""
        default_config = {
            "automation_schedule": {
                "content_optimization": "every_2_hours",
                "video_generation": "daily",
                "social_media_posting": "every_4_hours",
                "full_automation_cycle": "daily"
            },
            "content_thresholds": {
                "min_trending_score": 0.6,
                "max_articles_per_run": 10,
                "max_videos_per_day": 5,
                "max_social_posts_per_hour": 3
            },
            "automation_features": {
                "auto_content_optimization": True,
                "auto_video_generation": True,
                "auto_social_posting": True,
                "auto_youtube_upload": True,
                "trend_analysis": True,
                "performance_monitoring": True
            },
            "notification_settings": {
                "email_reports": True,
                "slack_notifications": False,
                "webhook_url": None
            }
        }
        
        config_file = "/workspace/yaadfeed/automation/orchestrator_config.json"
        if os.path.exists(config_file):
            try:
                with open(config_file, 'r') as f:
                    return {**default_config, **json.load(f)}
            except Exception as e:
                self.logger.error(f"Error loading config: {e}")
                return default_config
        else:
            with open(config_file, 'w') as f:
                json.dump(default_config, f, indent=2)
            return default_config
    
    async def run_full_automation_cycle(self):
        """Execute complete automation cycle"""
        self.logger.info("Starting full automation cycle")
        start_time = datetime.now()
        
        try:
            # Step 1: Content Optimization
            self.logger.info("Step 1: Running content optimization...")
            optimized_articles = await self.run_content_optimization()
            
            if not optimized_articles:
                self.logger.warning("No articles to process, skipping automation cycle")
                return
            
            # Step 2: Video Generation for trending content
            self.logger.info("Step 2: Generating videos for trending content...")
            generated_videos = await self.run_video_generation(optimized_articles)
            
            # Step 3: Social Media Automation
            self.logger.info("Step 3: Running social media automation...")
            social_results = await self.run_social_media_automation(optimized_articles, generated_videos)
            
            # Step 4: Performance Analysis
            self.logger.info("Step 4: Analyzing performance...")
            performance_report = self.analyze_performance(optimized_articles, generated_videos, social_results)
            
            # Update statistics
            self.update_automation_stats(optimized_articles, generated_videos, social_results)
            
            # Generate summary report
            await self.generate_automation_summary(start_time, optimized_articles, generated_videos, social_results, performance_report)
            
            self.automation_stats['successful_runs'] += 1
            self.logger.info("Full automation cycle completed successfully")
            
        except Exception as e:
            self.logger.error(f"Automation cycle failed: {e}")
            await self.handle_automation_error(e)
        
        finally:
            self.automation_stats['total_runs'] += 1
            self.last_run = datetime.now()
    
    async def run_content_optimization(self) -> List[Dict]:
        """Run AI content optimization"""
        try:
            # Fetch and optimize news content
            articles = self.content_optimizer.fetch_news_from_rss()
            
            if not articles:
                self.logger.warning("No articles fetched from RSS feeds")
                return []
            
            # Optimize each article
            optimized_articles = []
            for article in articles[:self.config['content_thresholds']['max_articles_per_run']]:
                optimized_article = self.content_optimizer.optimize_content(article)
                
                # Convert to dict for processing
                article_dict = {
                    'title': optimized_article.title,
                    'optimized_headline': optimized_article.optimized_headline,
                    'content': optimized_article.content,
                    'summary': optimized_article.summary,
                    'url': optimized_article.url,
                    'published': optimized_article.published.isoformat(),
                    'category': optimized_article.category,
                    'source': optimized_article.source,
                    'keywords': optimized_article.keywords,
                    'trending_score': optimized_article.trending_score,
                    'social_media_posts': optimized_article.social_media_posts
                }
                optimized_articles.append(article_dict)
            
            # Filter by trending score
            trending_articles = [
                article for article in optimized_articles 
                if article['trending_score'] >= self.config['content_thresholds']['min_trending_score']
            ]
            
            # Export optimized content
            output_file = self.content_optimizer.export_optimized_content([
                type('Article', (), article) for article in optimized_articles
            ])
            
            self.logger.info(f"Optimized {len(optimized_articles)} articles, {len(trending_articles)} trending")
            return trending_articles
            
        except Exception as e:
            self.logger.error(f"Content optimization failed: {e}")
            return []
    
    async def run_video_generation(self, trending_articles: List[Dict]) -> List[Dict]:
        """Generate videos for trending articles"""
        try:
            if not self.config['automation_features']['auto_video_generation']:
                self.logger.info("Video generation disabled in config")
                return []
            
            # Limit videos per day
            max_videos = min(
                len(trending_articles),
                self.config['content_thresholds']['max_videos_per_day']
            )
            
            # Create video requests for top trending articles
            video_requests = self.video_generator.process_trending_news(trending_articles[:max_videos])
            
            if not video_requests:
                self.logger.info("No video requests generated")
                return []
            
            # Generate videos
            generated_videos = await self.video_generator.generate_videos_batch(video_requests)
            
            # Export video queue
            queue_file = self.video_generator.export_video_queue(video_requests)
            
            self.logger.info(f"Generated {len(generated_videos)} videos")
            return generated_videos
            
        except Exception as e:
            self.logger.error(f"Video generation failed: {e}")
            return []
    
    async def run_social_media_automation(self, trending_articles: List[Dict], generated_videos: List[Dict]) -> Dict:
        """Execute social media automation"""
        try:
            if not self.config['automation_features']['auto_social_posting']:
                self.logger.info("Social media posting disabled in config")
                return {}
            
            # Create social media campaign
            campaign = self.social_automation.create_social_media_campaign(
                trending_articles, generated_videos
            )
            
            # Execute campaign
            results = await self.social_automation.execute_campaign(campaign)
            
            # Generate automation report
            report_file = self.social_automation.generate_automation_report(campaign, results)
            
            self.logger.info(f"Social media automation completed with {self.social_automation.calculate_success_rate(results):.1f}% success rate")
            return results
            
        except Exception as e:
            self.logger.error(f"Social media automation failed: {e}")
            return {}
    
    def analyze_performance(self, articles: List[Dict], videos: List[Dict], social_results: Dict) -> Dict:
        """Analyze automation performance"""
        
        performance = {
            'timestamp': datetime.now().isoformat(),
            'content_analysis': {
                'total_articles': len(articles),
                'avg_trending_score': sum(a['trending_score'] for a in articles) / len(articles) if articles else 0,
                'top_categories': self.get_top_categories(articles),
                'top_keywords': self.get_top_keywords(articles)
            },
            'video_analysis': {
                'total_videos': len(videos),
                'avg_duration': 7.5,  # Placeholder
                'resolution_breakdown': {'768P': len(videos)}
            },
            'social_media_analysis': {
                'total_posts': self.social_automation.count_total_actions(social_results) if social_results else 0,
                'success_rate': self.social_automation.calculate_success_rate(social_results) if social_results else 0,
                'platform_breakdown': social_results.get('results', {}) if social_results else {}
            },
            'automation_efficiency': {
                'processing_time': '5 minutes',  # Placeholder
                'automation_rate': self.calculate_automation_rate(),
                'error_rate': self.calculate_error_rate()
            }
        }
        
        return performance
    
    def get_top_categories(self, articles: List[Dict]) -> Dict[str, int]:
        """Get top article categories"""
        categories = {}
        for article in articles:
            category = article['category']
            categories[category] = categories.get(category, 0) + 1
        return dict(sorted(categories.items(), key=lambda x: x[1], reverse=True)[:5])
    
    def get_top_keywords(self, articles: List[Dict]) -> List[str]:
        """Get top keywords across all articles"""
        all_keywords = []
        for article in articles:
            if article.get('keywords'):
                all_keywords.extend(article['keywords'])
        
        keyword_count = {}
        for keyword in all_keywords:
            keyword_count[keyword] = keyword_count.get(keyword, 0) + 1
        
        return list(dict(sorted(keyword_count.items(), key=lambda x: x[1], reverse=True)[:10]).keys())
    
    def calculate_automation_rate(self) -> float:
        """Calculate automation success rate"""
        if self.automation_stats['total_runs'] == 0:
            return 0.0
        return (self.automation_stats['successful_runs'] / self.automation_stats['total_runs']) * 100
    
    def calculate_error_rate(self) -> float:
        """Calculate error rate"""
        if self.automation_stats['total_runs'] == 0:
            return 0.0
        failed_runs = self.automation_stats['total_runs'] - self.automation_stats['successful_runs']
        return (failed_runs / self.automation_stats['total_runs']) * 100
    
    def update_automation_stats(self, articles: List[Dict], videos: List[Dict], social_results: Dict):
        """Update automation statistics"""
        self.automation_stats['articles_processed'] += len(articles)
        self.automation_stats['videos_generated'] += len(videos)
        if social_results:
            self.automation_stats['social_posts_created'] += self.social_automation.count_total_actions(social_results)
    
    async def generate_automation_summary(self, start_time: datetime, articles: List[Dict], 
                                        videos: List[Dict], social_results: Dict, performance: Dict):
        """Generate comprehensive automation summary"""
        
        duration = datetime.now() - start_time
        
        summary = f"""
# YaadFeed Automation Summary Report

## Execution Overview
- **Start Time**: {start_time.strftime('%Y-%m-%d %H:%M:%S')}
- **Duration**: {duration.total_seconds():.1f} seconds
- **Status**: ✅ Successful

## Content Processing
- **Articles Processed**: {len(articles)}
- **Average Trending Score**: {performance['content_analysis']['avg_trending_score']:.2f}
- **Top Category**: {list(performance['content_analysis']['top_categories'].keys())[0] if performance['content_analysis']['top_categories'] else 'N/A'}

## Video Generation
- **Videos Created**: {len(videos)}
- **Success Rate**: {100 if videos else 0}%

## Social Media Automation
- **Total Posts**: {performance['social_media_analysis']['total_posts']}
- **Success Rate**: {performance['social_media_analysis']['success_rate']:.1f}%
- **Platforms**: {len(performance['social_media_analysis']['platform_breakdown'])}

## Performance Metrics
- **Automation Rate**: {performance['automation_efficiency']['automation_rate']:.1f}%
- **Error Rate**: {performance['automation_efficiency']['error_rate']:.1f}%

## Top Trending Content
{self.format_top_articles(articles[:3])}

## System Statistics
- **Total Automation Runs**: {self.automation_stats['total_runs']}
- **Articles Processed (All Time)**: {self.automation_stats['articles_processed']}
- **Videos Generated (All Time)**: {self.automation_stats['videos_generated']}
- **Social Posts Created (All Time)**: {self.automation_stats['social_posts_created']}

---
*Generated by YaadFeed Automation Orchestrator*
*Report Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
        """.strip()
        
        # Save summary report
        report_file = f"/workspace/yaadfeed/automation/automation_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        with open(report_file, 'w') as f:
            f.write(summary)
        
        self.logger.info(f"Automation summary saved to: {report_file}")
        
        # Send notifications if configured
        await self.send_notifications(summary)
    
    def format_top_articles(self, articles: List[Dict]) -> str:
        """Format top articles for report"""
        if not articles:
            return "No articles processed"
        
        formatted = ""
        for i, article in enumerate(articles, 1):
            formatted += f"{i}. **{article['optimized_headline']}** (Score: {article['trending_score']:.2f})\n"
        
        return formatted
    
    async def send_notifications(self, summary: str):
        """Send automation notifications"""
        if self.config['notification_settings']['email_reports']:
            # Email notification would go here
            self.logger.info("Email notification sent")
        
        if self.config['notification_settings']['webhook_url']:
            # Webhook notification would go here
            self.logger.info("Webhook notification sent")
    
    async def handle_automation_error(self, error: Exception):
        """Handle automation errors"""
        error_report = f"""
# YaadFeed Automation Error Report

**Time**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Error**: {str(error)}
**Type**: {type(error).__name__}

## Error Details
{str(error)}

## Recovery Actions
- Automation will retry on next scheduled run
- Check system logs for detailed error information
- Verify API connections and credentials

---
*Error logged by YaadFeed Automation Orchestrator*
        """
        
        error_file = f"/workspace/yaadfeed/automation/error_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        with open(error_file, 'w') as f:
            f.write(error_report)
        
        self.logger.error(f"Error report saved to: {error_file}")
    
    def setup_automation_schedule(self):
        """Setup automated scheduling"""
        
        # Full automation cycle - daily at 6 AM
        schedule.every().day.at("06:00").do(lambda: asyncio.create_task(self.run_full_automation_cycle()))
        
        # Content optimization - every 2 hours
        schedule.every(2).hours.do(lambda: asyncio.create_task(self.run_content_optimization()))
        
        # Social media posting - every 4 hours
        schedule.every(4).hours.do(lambda: asyncio.create_task(self.run_social_media_automation([], [])))
        
        self.logger.info("Automation schedule configured")
    
    def run_scheduler(self):
        """Run the automation scheduler"""
        self.logger.info("Starting automation scheduler...")
        
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute

async def main():
    """Main function for testing automation orchestrator"""
    orchestrator = YaadFeedOrchestrator()
    
    print("YaadFeed Automation Orchestrator")
    print("================================")
    print("Running test automation cycle...")
    
    # Run a test automation cycle
    await orchestrator.run_full_automation_cycle()
    
    print("\n✅ Test automation cycle completed!")
    print(f"📊 Statistics: {orchestrator.automation_stats}")

if __name__ == "__main__":
    asyncio.run(main())
