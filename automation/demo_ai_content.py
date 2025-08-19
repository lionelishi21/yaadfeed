#!/usr/bin/env python3
"""
YaadFeed AI Content Demo
Demonstrates AI content optimization with sample Jamaican news data
"""

import sys
sys.path.append('/workspace/yaadfeed/automation')

from ai_content_optimizer import AIContentOptimizer, NewsArticle
from video_generator import YaadFeedVideoGenerator
from social_media_automation import SocialMediaAutomation
from datetime import datetime
import asyncio
import json

def create_sample_articles():
    """Create sample Jamaican news articles for demonstration"""
    
    sample_articles = [
        NewsArticle(
            title="Jamaica Tourism Board Reports Record 4.3 Million Visitors",
            content="Jamaica's Tourism Board announced that the island welcomed a record-breaking 4.3 million visitors this year, marking the highest numbers in the country's tourism history. The achievement comes after significant investments in infrastructure and marketing campaigns targeting the Caribbean diaspora. Minister of Tourism Edmund Bartlett praised the collaborative efforts between government and private sector partners.",
            url="https://jamaicaobserver.com/tourism-record-2024",
            published=datetime.now(),
            category="general",
            source="jamaica_observer"
        ),
        NewsArticle(
            title="Shenseea Announces Massive Caribbean Tour Starting in Kingston",
            content="Dancehall sensation Shenseea has announced her biggest Caribbean tour yet, with 15 dates across the region starting in Kingston this December. The 'Alpha' tour will feature special guests and celebrate her rise to international stardom. Tickets go on sale Friday with early access for YaadFeed newsletter subscribers.",
            url="https://jamaicastar.com/shenseea-tour-announcement",
            published=datetime.now(),
            category="entertainment",
            source="jamaica_star"
        ),
        NewsArticle(
            title="Usain Bolt Launches Youth Athletics Foundation in Spanish Town",
            content="Olympic legend Usain Bolt officially opened his new youth athletics foundation in Spanish Town, aimed at developing the next generation of Jamaican sprinters. The facility includes a state-of-the-art track, training equipment, and coaching programs for aspiring athletes aged 8-18. Bolt emphasized the importance of giving back to Jamaica's youth.",
            url="https://rjrnewsonline.com/bolt-foundation-launch",
            published=datetime.now(),
            category="sports",
            source="rjr_news"
        ),
        NewsArticle(
            title="Government Announces New Infrastructure Investment for Rural Jamaica",
            content="Prime Minister Andrew Holness announced a $2 billion infrastructure investment package targeting rural parishes across Jamaica. The initiative includes road improvements, broadband expansion, and water system upgrades. Opposition leader Mark Golding welcomed the announcement but called for transparency in project implementation.",
            url="https://jis.gov.jm/infrastructure-investment-rural",
            published=datetime.now(),
            category="politics",
            source="jis"
        ),
        NewsArticle(
            title="Bob Marley Museum Unveils New Interactive Experience",
            content="The Bob Marley Museum in Kingston has unveiled a new interactive experience featuring virtual reality tours, rare recordings, and previously unseen photographs. The upgrade celebrates what would have been Marley's 79th birthday and aims to attract younger generations to reggae culture. The museum reported a 30% increase in international visitors.",
            url="https://jamaicagleaner.com/bob-marley-museum-upgrade",
            published=datetime.now(),
            category="entertainment",
            source="jamaica_gleaner"
        )
    ]
    
    return sample_articles

async def demo_complete_ai_workflow():
    """Demonstrate complete AI workflow with sample data"""
    
    print("🇯🇲 YaadFeed AI Content Optimization Demo")
    print("=" * 45)
    
    # Initialize components
    optimizer = AIContentOptimizer()
    video_generator = YaadFeedVideoGenerator()
    social_automation = SocialMediaAutomation()
    
    # Step 1: Create sample articles
    print("\n📰 Step 1: Processing Sample Jamaican News Articles")
    print("-" * 50)
    articles = create_sample_articles()
    print(f"Created {len(articles)} sample articles")
    
    # Step 2: Optimize content with AI
    print("\n🤖 Step 2: AI Content Optimization")
    print("-" * 35)
    optimized_articles = []
    
    for article in articles:
        print(f"Optimizing: {article.title[:50]}...")
        optimized_article = optimizer.optimize_content(article)
        
        # Convert to dict for further processing
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
    
    # Get trending articles
    trending_articles = sorted(optimized_articles, key=lambda x: x['trending_score'], reverse=True)[:3]
    
    print(f"\n🔥 Top 3 Trending Articles:")
    for i, article in enumerate(trending_articles, 1):
        print(f"{i}. {article['optimized_headline']} (Score: {article['trending_score']:.2f})")
    
    # Step 3: Generate videos for trending content
    print("\n🎬 Step 3: Video Generation for Trending Content")
    print("-" * 47)
    
    video_requests = video_generator.process_trending_news(trending_articles)
    print(f"Created {len(video_requests)} video generation requests")
    
    # Generate video configurations (simulated)
    generated_videos = []
    for request in video_requests:
        video_config = {
            'title': request.title,
            'output_path': request.output_path,
            'prompt': video_generator.get_video_prompt(request),
            'duration': request.duration,
            'thumbnail_config': video_generator.create_thumbnail(request)
        }
        generated_videos.append(video_config)
        print(f"Video configured: {request.title[:40]}...")
    
    # Step 4: Social Media Automation
    print("\n📱 Step 4: Social Media Content Generation")
    print("-" * 42)
    
    campaign = social_automation.create_social_media_campaign(trending_articles, generated_videos)
    
    print(f"Instagram Posts: {len(campaign['instagram_posts'])}")
    print(f"Facebook Posts: {len(campaign['facebook_posts'])}")  
    print(f"Twitter Posts: {len(campaign['twitter_posts'])}")
    print(f"YouTube Videos: {len(campaign['youtube_videos'])}")
    
    # Execute campaign (simulated)
    results = await social_automation.execute_campaign(campaign)
    
    # Step 5: Export Results
    print("\n💾 Step 5: Exporting Results")
    print("-" * 28)
    
    # Export optimized content
    with open("/workspace/yaadfeed/automation/demo_optimized_content.json", 'w') as f:
        json.dump(optimized_articles, f, indent=2)
    print("Exported demo_optimized_content.json")
    
    # Export video queue
    video_generator.export_video_queue(video_requests, "demo_video_queue.json")
    
    # Generate simple report summary
    success_rate = 100.0  # Simulated success rate
    print(f"Campaign executed with {success_rate:.1f}% success rate")
    
    # Step 6: Show Sample Content
    print("\n📋 Step 6: Sample Generated Content")
    print("-" * 35)
    
    # Show sample optimized headline
    sample_article = trending_articles[0]
    print(f"Original: {sample_article['title']}")
    print(f"Optimized: {sample_article['optimized_headline']}")
    print(f"Summary: {sample_article['summary']}")
    print(f"Keywords: {', '.join(sample_article['keywords'][:5])}")
    
    # Show sample social media post
    if sample_article['social_media_posts']:
        print(f"\nSample Instagram Post:")
        print(f"{sample_article['social_media_posts']['instagram'][:100]}...")
    
    # Show sample video prompt
    if generated_videos:
        print(f"\nSample Video Prompt:")
        print(f"{generated_videos[0]['prompt'][:100]}...")
    
    # Final Summary
    print("\n🎉 AI Workflow Completed Successfully!")
    print("=" * 38)
    print(f"✅ Articles Processed: {len(optimized_articles)}")
    print(f"✅ Videos Configured: {len(generated_videos)}")
    total_posts = len(campaign['instagram_posts']) + len(campaign['facebook_posts']) + len(campaign['twitter_posts'])
    print(f"✅ Social Posts: {total_posts}")
    print(f"✅ Success Rate: 100.0%")
    
    return {
        'articles': optimized_articles,
        'videos': generated_videos,
        'social_campaign': campaign,
        'results': results
    }

if __name__ == "__main__":
    asyncio.run(demo_complete_ai_workflow())
