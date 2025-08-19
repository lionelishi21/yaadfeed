#!/usr/bin/env python3
"""
YaadFeed Video Generator
Automatically generates videos for popular news articles and artist content
"""

import json
import os
import asyncio
from typing import Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime
import hashlib

@dataclass
class VideoRequest:
    title: str
    content: str
    category: str
    duration: int = 6  # seconds
    resolution: str = "768P"
    output_path: str = ""
    thumbnail_path: str = ""
    script: str = ""
    visual_style: str = "news"

class YaadFeedVideoGenerator:
    def __init__(self):
        self.output_dir = "/workspace/yaadfeed/generated_videos"
        self.thumbnails_dir = "/workspace/yaadfeed/generated_thumbnails"
        self.ensure_directories()
        
        # Video generation prompts for different content types
        self.video_prompts = {
            'news': {
                'general': "Create a professional news broadcast style video with Jamaican flag elements, modern graphics, and clean typography displaying the news headline and key points",
                'politics': "Generate a political news video with government building imagery, official symbols, and serious tone with Jamaica national colors",
                'entertainment': "Create an entertainment news video with vibrant colors, music note graphics, Jamaican cultural elements, and energetic visual style",
                'sports': "Generate a sports news video with dynamic action graphics, Jamaica team colors, athletic imagery, and high-energy visual effects",
                'crime': "Create a serious news report video with authoritative graphics, muted colors, and professional news broadcast style"
            },
            'artist': {
                'profile': "Create a vibrant artist profile video with Jamaican music culture elements, reggae/dancehall visual style, and artist information display",
                'trending': "Generate a trending artist content video with social media style graphics, vibrant Jamaica colors, and modern music industry aesthetics"
            }
        }
    
    def ensure_directories(self):
        """Create necessary directories for video output"""
        os.makedirs(self.output_dir, exist_ok=True)
        os.makedirs(self.thumbnails_dir, exist_ok=True)
    
    def create_video_script(self, title: str, content: str, category: str) -> str:
        """Generate a video script for news content"""
        
        # Clean and prepare content
        content_words = content.split()[:50]  # Limit to first 50 words
        summary = ' '.join(content_words)
        
        script_templates = {
            'politics': f"Breaking political news from Jamaica. {title}. {summary}",
            'entertainment': f"Latest from Jamaica's entertainment scene! {title}. {summary}",
            'sports': f"Sports update from Jamaica! {title}. {summary}",
            'crime': f"Important safety update from Jamaica. {title}. {summary}",
            'general': f"News from Jamaica. {title}. {summary}"
        }
        
        return script_templates.get(category, script_templates['general'])
    
    def generate_video_from_news(self, article_data: Dict) -> VideoRequest:
        """Create video request from news article data"""
        
        # Generate unique filename
        title_hash = hashlib.md5(article_data['title'].encode()).hexdigest()[:8]
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"news_{article_data['category']}_{timestamp}_{title_hash}.mp4"
        
        # Create video script
        script = self.create_video_script(
            article_data['optimized_headline'],
            article_data['summary'],
            article_data['category']
        )
        
        video_request = VideoRequest(
            title=article_data['optimized_headline'],
            content=article_data['summary'],
            category=article_data['category'],
            duration=10 if article_data['trending_score'] > 0.7 else 6,
            resolution="768P",
            output_path=os.path.join(self.output_dir, filename),
            script=script,
            visual_style='news'
        )
        
        return video_request
    
    def generate_artist_video(self, artist_data: Dict, content_type: str = 'profile') -> VideoRequest:
        """Create video request for artist content"""
        
        # Generate unique filename
        artist_name = artist_data.get('name', 'unknown').replace(' ', '_').lower()
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"artist_{content_type}_{artist_name}_{timestamp}.mp4"
        
        if content_type == 'profile':
            script = f"Meet {artist_data['name']}, Jamaica's {artist_data.get('genre', 'music')} sensation. {artist_data.get('bio', '')[:100]}..."
        else:  # trending content
            script = f"{artist_data['name']} is trending! Latest updates on Jamaica's hottest {artist_data.get('genre', 'music')} artist."
        
        video_request = VideoRequest(
            title=f"{artist_data['name']} - {content_type.title()}",
            content=artist_data.get('bio', ''),
            category='entertainment',
            duration=8,
            resolution="768P",
            output_path=os.path.join(self.output_dir, filename),
            script=script,
            visual_style='artist'
        )
        
        return video_request
    
    def get_video_prompt(self, video_request: VideoRequest) -> str:
        """Generate AI video prompt based on content"""
        
        base_prompt = ""
        if video_request.visual_style == 'news':
            base_prompt = self.video_prompts['news'].get(video_request.category, self.video_prompts['news']['general'])
        elif video_request.visual_style == 'artist':
            base_prompt = self.video_prompts['artist']['profile']
        
        # Add Jamaica-specific elements
        jamaica_elements = "Include Jamaica flag colors (green, gold, black), tropical background elements, and professional broadcast quality"
        
        # Combine with specific content
        full_prompt = f"{base_prompt}. {jamaica_elements}. Text overlay: '{video_request.title}'. Duration: {video_request.duration} seconds."
        
        return full_prompt
    
    async def generate_videos_batch(self, video_requests: List[VideoRequest]) -> List[str]:
        """Generate multiple videos using AI video generation"""
        generated_videos = []
        
        try:
            # Import the video generation function
            from batch_text_to_video import batch_text_to_video
            
            # Prepare batch requests
            prompts = []
            output_files = []
            durations = []
            resolutions = []
            
            for request in video_requests:
                prompt = self.get_video_prompt(request)
                prompts.append(prompt)
                output_files.append(request.output_path)
                durations.append(request.duration)
                resolutions.append(request.resolution)
            
            print(f"Generating {len(video_requests)} videos...")
            
            # Generate videos using the AI video generation API
            # Note: This uses the batch_text_to_video function which requires proper API setup
            try:
                await batch_text_to_video(
                    count=len(video_requests),
                    prompt_list=prompts,
                    output_file_list=output_files,
                    duration_list=durations,
                    resolution_list=resolutions
                )
                
                generated_videos = output_files
                print(f"Successfully generated {len(generated_videos)} videos")
                
            except Exception as e:
                print(f"AI video generation unavailable: {e}")
                # Create placeholder video information
                for request in video_requests:
                    placeholder_info = {
                        'title': request.title,
                        'output_path': request.output_path,
                        'prompt': self.get_video_prompt(request),
                        'status': 'pending_generation',
                        'duration': request.duration,
                        'resolution': request.resolution
                    }
                    generated_videos.append(placeholder_info)
                
        except ImportError:
            print("Video generation API not available - creating placeholder configurations")
            # Create detailed video generation configs for manual processing
            for request in video_requests:
                config = {
                    'title': request.title,
                    'script': request.script,
                    'prompt': self.get_video_prompt(request),
                    'output_path': request.output_path,
                    'category': request.category,
                    'duration': request.duration,
                    'resolution': request.resolution,
                    'visual_style': request.visual_style
                }
                generated_videos.append(config)
        
        return generated_videos
    
    def create_thumbnail(self, video_request: VideoRequest) -> str:
        """Generate thumbnail image for video"""
        thumbnail_filename = os.path.basename(video_request.output_path).replace('.mp4', '_thumb.jpg')
        thumbnail_path = os.path.join(self.thumbnails_dir, thumbnail_filename)
        
        # Thumbnail prompt for image generation
        thumbnail_prompt = f"Professional YouTube thumbnail for Jamaica news video: '{video_request.title}'. Bright colors, Jamaica flag elements, bold text overlay, high contrast, eye-catching design"
        
        # Store thumbnail configuration
        thumbnail_config = {
            'title': video_request.title,
            'prompt': thumbnail_prompt,
            'output_path': thumbnail_path,
            'video_path': video_request.output_path
        }
        
        return thumbnail_config
    
    def process_trending_news(self, trending_articles: List[Dict]) -> List[VideoRequest]:
        """Process trending news articles for video generation"""
        video_requests = []
        
        # Generate videos for top trending articles
        for article in trending_articles[:5]:  # Top 5 trending articles
            if article['trending_score'] > 0.5:  # Only high-scoring articles
                video_request = self.generate_video_from_news(article)
                video_requests.append(video_request)
        
        return video_requests
    
    def export_video_queue(self, video_requests: List[VideoRequest], filename: str = None) -> str:
        """Export video generation queue to JSON file"""
        if not filename:
            filename = f"video_queue_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        queue_data = []
        for request in video_requests:
            queue_data.append({
                'title': request.title,
                'content': request.content,
                'category': request.category,
                'duration': request.duration,
                'resolution': request.resolution,
                'output_path': request.output_path,
                'script': request.script,
                'visual_style': request.visual_style,
                'prompt': self.get_video_prompt(request),
                'thumbnail_config': self.create_thumbnail(request)
            })
        
        output_path = f"/workspace/yaadfeed/automation/{filename}"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(queue_data, f, indent=2, ensure_ascii=False)
        
        print(f"Video queue exported to: {output_path}")
        return output_path

async def main():
    """Main function to demonstrate video generation"""
    generator = YaadFeedVideoGenerator()
    
    print("YaadFeed Video Generator")
    print("=======================")
    
    # Sample trending news data for demonstration
    sample_articles = [
        {
            'title': 'Jamaican Sprinter Breaks World Record',
            'optimized_headline': 'BREAKING: Jamaica Sprinter Shatters World Record!',
            'summary': 'A Jamaican athlete has broken the world record in track and field, bringing pride to the nation.',
            'category': 'sports',
            'trending_score': 0.9
        },
        {
            'title': 'New Dancehall Festival Announced',
            'optimized_headline': 'Massive Dancehall Festival Coming to Jamaica!',
            'summary': 'The biggest dancehall festival of the year has been announced featuring top Jamaican artists.',
            'category': 'entertainment',
            'trending_score': 0.8
        }
    ]
    
    # Generate video requests
    print("Creating video requests for trending articles...")
    video_requests = generator.process_trending_news(sample_articles)
    
    # Export video queue
    queue_file = generator.export_video_queue(video_requests)
    
    # Generate videos (or create configs if API unavailable)
    print("Processing video generation...")
    generated_videos = await generator.generate_videos_batch(video_requests)
    
    print(f"\nGenerated {len(generated_videos)} video configurations")
    for i, video in enumerate(generated_videos, 1):
        if isinstance(video, dict):
            print(f"{i}. {video.get('title', 'Video')} - {video.get('status', 'configured')}")
        else:
            print(f"{i}. Video file: {video}")
    
    return generated_videos

if __name__ == "__main__":
    asyncio.run(main())
