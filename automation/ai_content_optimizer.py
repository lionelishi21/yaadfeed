#!/usr/bin/env python3
"""
YaadFeed AI Content Optimizer
Optimizes news content and generates AI-powered summaries, headlines, and social media posts
"""

import json
import re
import requests
from datetime import datetime
from typing import Dict, List, Optional
import feedparser
from dataclasses import dataclass
import hashlib

@dataclass
class NewsArticle:
    title: str
    content: str
    url: str
    published: datetime
    category: str
    source: str
    summary: Optional[str] = None
    optimized_headline: Optional[str] = None
    social_media_posts: Optional[Dict[str, str]] = None
    keywords: Optional[List[str]] = None
    trending_score: float = 0.0

class AIContentOptimizer:
    def __init__(self):
        self.rss_feeds = {
            'jamaica_gleaner': 'https://jamaica-gleaner.com/feed/rss.xml',
            'jamaica_observer': 'https://www.jamaicaobserver.com/app/news/',
            'jamaican_star': 'https://jamaicastar.com/feed/news.xml',
            'gleaner_news': 'https://jamaica-gleaner.com/feed/news.xml'
        }
        
    def fetch_news_from_rss(self) -> List[NewsArticle]:
        """Fetch latest news from Jamaican RSS feeds"""
        articles = []
        
        for source, feed_url in self.rss_feeds.items():
            try:
                feed = feedparser.parse(feed_url)
                for entry in feed.entries[:10]:  # Get latest 10 articles per source
                    article = NewsArticle(
                        title=entry.title if hasattr(entry, 'title') else 'No Title',
                        content=entry.summary if hasattr(entry, 'summary') else entry.description if hasattr(entry, 'description') else '',
                        url=entry.link if hasattr(entry, 'link') else '',
                        published=datetime.now(),
                        category=self._categorize_article(entry.title if hasattr(entry, 'title') else ''),
                        source=source
                    )
                    articles.append(article)
            except Exception as e:
                print(f"Error fetching from {source}: {e}")
                continue
                
        return articles
    
    def _categorize_article(self, title: str) -> str:
        """Categorize article based on title keywords"""
        politics_keywords = ['government', 'minister', 'parliament', 'election', 'party', 'political']
        entertainment_keywords = ['music', 'artist', 'celebrity', 'entertainment', 'concert', 'festival']
        sports_keywords = ['sports', 'football', 'cricket', 'athletics', 'olympics', 'team']
        crime_keywords = ['police', 'crime', 'arrest', 'court', 'shooting', 'murder']
        
        title_lower = title.lower()
        
        for keyword in politics_keywords:
            if keyword in title_lower:
                return 'politics'
        for keyword in entertainment_keywords:
            if keyword in title_lower:
                return 'entertainment'
        for keyword in sports_keywords:
            if keyword in title_lower:
                return 'sports'
        for keyword in crime_keywords:
            if keyword in title_lower:
                return 'crime'
        
        return 'general'
    
    def optimize_content(self, article: NewsArticle) -> NewsArticle:
        """Optimize article content with AI-generated improvements"""
        
        # Generate optimized headline
        article.optimized_headline = self._generate_optimized_headline(article.title, article.content)
        
        # Generate summary
        article.summary = self._generate_summary(article.content)
        
        # Extract keywords
        article.keywords = self._extract_keywords(article.title + ' ' + article.content)
        
        # Calculate trending score
        article.trending_score = self._calculate_trending_score(article)
        
        # Generate social media posts
        article.social_media_posts = self._generate_social_media_posts(article)
        
        return article
    
    def _generate_optimized_headline(self, title: str, content: str) -> str:
        """Generate an optimized headline for better engagement"""
        # Simple optimization rules - in production, use advanced AI models
        title = title.strip()
        
        # Add emotion and urgency for better engagement
        if 'breaking' not in title.lower() and any(word in content.lower() for word in ['urgent', 'emergency', 'crisis']):
            title = f"BREAKING: {title}"
        
        # Ensure title ends with proper punctuation
        if not title.endswith(('.', '!', '?')):
            title += '!'
            
        return title
    
    def _generate_summary(self, content: str) -> str:
        """Generate a concise summary of the article"""
        # Simple extractive summarization - in production, use advanced AI
        sentences = re.split(r'[.!?]+', content)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 20]
        
        if len(sentences) <= 2:
            return content[:200] + '...' if len(content) > 200 else content
        
        # Take first 2 sentences as summary
        summary = '. '.join(sentences[:2]) + '.'
        return summary
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract relevant keywords from article text"""
        # Simple keyword extraction - in production, use NLP libraries
        words = re.findall(r'\b[A-Za-z]{4,}\b', text.lower())
        
        # Filter out common words
        stop_words = {'this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'said', 'each', 'which', 'their', 'time', 'year', 'people', 'many', 'some', 'very', 'when', 'much', 'also', 'more', 'other', 'after', 'first', 'well', 'work', 'life', 'only', 'good', 'even', 'come', 'make', 'take', 'could', 'would', 'should'}
        
        keywords = [word for word in set(words) if word not in stop_words and len(word) > 4]
        
        # Count frequency and return top keywords
        keyword_freq = {}
        for word in keywords:
            keyword_freq[word] = text.lower().count(word)
        
        sorted_keywords = sorted(keyword_freq.items(), key=lambda x: x[1], reverse=True)
        return [keyword for keyword, freq in sorted_keywords[:10]]
    
    def _calculate_trending_score(self, article: NewsArticle) -> float:
        """Calculate trending score based on various factors"""
        score = 0.0
        
        # Content length factor
        if len(article.content) > 500:
            score += 0.2
        
        # Category factors
        if article.category in ['entertainment', 'sports']:
            score += 0.3
        elif article.category == 'politics':
            score += 0.2
        
        # Keyword factors
        trending_keywords = ['jamaica', 'dancehall', 'reggae', 'bob marley', 'usain bolt', 'festival', 'carnival']
        if article.keywords:
            for keyword in article.keywords:
                if keyword.lower() in trending_keywords:
                    score += 0.1
        
        # Time factor (recent articles score higher)
        hours_old = (datetime.now() - article.published).total_seconds() / 3600
        if hours_old < 6:
            score += 0.3
        elif hours_old < 24:
            score += 0.2
        
        return min(score, 1.0)  # Cap at 1.0
    
    def _generate_social_media_posts(self, article: NewsArticle) -> Dict[str, str]:
        """Generate optimized posts for different social media platforms"""
        posts = {}
        
        # Twitter post (280 characters)
        twitter_post = f"{article.optimized_headline[:200]}... 🇯🇲 #{article.category.title()} #Jamaica"
        if len(twitter_post) > 280:
            twitter_post = f"{article.optimized_headline[:150]}... 🇯🇲 #{article.category.title()}"
        posts['twitter'] = twitter_post
        
        # Instagram post (longer format with hashtags)
        instagram_hashtags = ['#Jamaica', '#YaadFeed', f'#{article.category.title()}', '#Caribbean', '#News']
        if article.keywords:
            instagram_hashtags.extend([f'#{keyword.title()}' for keyword in article.keywords[:3]])
        
        instagram_post = f"{article.optimized_headline}\n\n{article.summary}\n\n{' '.join(instagram_hashtags)}"
        posts['instagram'] = instagram_post
        
        # Facebook post (more detailed)
        facebook_post = f"{article.optimized_headline}\n\n{article.summary}\n\nRead more: {article.url}\n\n🇯🇲 Stay informed with YaadFeed!"
        posts['facebook'] = facebook_post
        
        return posts
    
    def get_trending_articles(self, articles: List[NewsArticle], limit: int = 5) -> List[NewsArticle]:
        """Get articles sorted by trending score"""
        return sorted(articles, key=lambda x: x.trending_score, reverse=True)[:limit]
    
    def export_optimized_content(self, articles: List[NewsArticle], filename: str = None) -> str:
        """Export optimized articles to JSON file"""
        if not filename:
            filename = f"optimized_news_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        data = []
        for article in articles:
            data.append({
                'title': article.title,
                'optimized_headline': article.optimized_headline,
                'content': article.content,
                'summary': article.summary,
                'url': article.url,
                'published': article.published.isoformat(),
                'category': article.category,
                'source': article.source,
                'keywords': article.keywords,
                'trending_score': article.trending_score,
                'social_media_posts': article.social_media_posts
            })
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"Exported {len(articles)} optimized articles to {filename}")
        return filename

def main():
    """Main function to run the AI content optimizer"""
    optimizer = AIContentOptimizer()
    
    print("YaadFeed AI Content Optimizer")
    print("=============================")
    
    # Fetch news articles
    print("Fetching news from RSS feeds...")
    articles = optimizer.fetch_news_from_rss()
    print(f"Fetched {len(articles)} articles")
    
    # Optimize content
    print("Optimizing content with AI...")
    optimized_articles = []
    for article in articles:
        optimized_article = optimizer.optimize_content(article)
        optimized_articles.append(optimized_article)
    
    # Get trending articles
    trending_articles = optimizer.get_trending_articles(optimized_articles)
    print(f"\nTop {len(trending_articles)} Trending Articles:")
    for i, article in enumerate(trending_articles, 1):
        print(f"{i}. {article.optimized_headline} (Score: {article.trending_score:.2f})")
    
    # Export results
    output_file = optimizer.export_optimized_content(optimized_articles)
    print(f"\nResults exported to: {output_file}")
    
    return optimized_articles

if __name__ == "__main__":
    main()
