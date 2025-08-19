'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Eye, Share2, Tag, Clock, Bookmark } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Footer from '@/components/Footer';
import Comments from '@/components/Comments';
import { formatters, stringUtils } from '@/utils';
import Header from '@/components/Header';

interface ArticleContentProps {
  article: any;
  relatedArticles: any[];
  slug: string;
}

export default function ArticleContent({ article, relatedArticles, slug }: ArticleContentProps) {
  // Use the article's actual image if available, otherwise generate AI image
  const getImageUrl = async (article: any, width: number, height: number): Promise<string> => {
    if (article && article.imageUrl && article.imageUrl.startsWith('/images/')) {
      return article.imageUrl; // Use local image
    }
    
    // Try to generate AI image instead of Unsplash fallback
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: article?.title || `Jamaica ${article?.category || 'general'}`,
          category: article?.category || 'general',
          keywords: article?.keywords || [],
          summary: article?.summary || '',
          forceGenerate: true
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          return result.imageUrl;
        }
      }
    } catch (error) {
      console.error('AI image generation failed:', error);
    }
    
    // Use local placeholder as fallback
    const category = article?.category || 'general';
    return `/images/placeholder-${category}.jpg`;
  };

  // Helper function to get category keywords
  const getCategoryKeywords = (category: string): string[] => {
    const categoryMap: { [key: string]: string[] } = {
      'sports': ['sports', 'jamaica', 'athletic', 'competition'],
      'politics': ['government', 'building', 'professional', 'jamaica'],
      'business': ['business', 'office', 'success', 'jamaica'],
      'entertainment': ['party', 'celebration', 'fun', 'jamaica'],
      'health': ['health', 'medical', 'wellness', 'jamaica'],
      'education': ['education', 'school', 'learning', 'jamaica'],
      'culture': ['culture', 'art', 'heritage', 'jamaica'],
      'music': ['music', 'reggae', 'jamaica', 'dancehall'],
      'dancehall': ['dancehall', 'music', 'jamaica', 'reggae'],
      'general': ['jamaica', 'tropical', 'caribbean', 'island']
    };

    return categoryMap[category.toLowerCase()] || categoryMap['general'];
  };

  const [heroImage, setHeroImage] = useState<string>('');
  const [relatedImage, setRelatedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        const hero = await getImageUrl(article, 1200, 600);
        const related = await getImageUrl(article, 400, 250);
        setHeroImage(hero);
        setRelatedImage(related);
      } catch (error) {
        console.error('Error loading images:', error);
        // Set fallback images
        setHeroImage(`/images/placeholder-${article?.category || 'general'}.jpg`);
        setRelatedImage(`/images/placeholder-${article?.category || 'general'}.jpg`);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [article]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative mb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Link 
                href="/news" 
                className="inline-flex items-center text-gray-600 hover:text-jamaica-green-600 transition-colors duration-200 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Link>
        </div>

            {/* Article Header */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <Card className="p-8 lg:p-12 bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl">
                  {/* Category & Meta */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="bg-gradient-to-r from-jamaica-green-500 to-jamaica-gold-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      {stringUtils.capitalize(article.category)}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatters.date(article.publishedAt)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readTime} min read
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {Math.floor(Math.random() * 1000) + 500} views
                </span>
                </div>
              </div>

                  {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {article.title}
              </h1>

                  {/* Summary */}
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed font-light">
                {article.summary}
              </p>

                  {/* Author & Share */}
                  <div className="flex items-center justify-between pb-8 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-jamaica-green-500 to-jamaica-gold-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                  </div>
                      <div>
                        <p className="font-semibold text-gray-900">YaadFeed Editorial</p>
                        <p className="text-gray-500 text-sm">Verified Reporter</p>
                </div>
              </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-gray-300 hover:bg-jamaica-green-50 hover:border-jamaica-green-300"
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-gray-300 hover:bg-jamaica-gold-50 hover:border-jamaica-gold-300"
                      >
                        <Bookmark className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                </Card>
                </div>

              {/* Hero Image */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <Card className="overflow-hidden bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl">
                    <div className="aspect-[4/3] overflow-hidden">
                  <Image
                        src={heroImage}
                    alt={article.title}
                        width={1200}
                        height={600}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    priority
                  />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 text-center">
                        Featured image related to {article.category}
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="mb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <Card className="p-8 lg:p-12 bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl">
                  <article className="prose prose-lg prose-gray max-w-none">
                    <div className="article-content">
                      {/* Enhanced content formatting */}
                      <div className="text-gray-700 leading-relaxed space-y-6">
                {article.content ? (
                          <div 
                            className="formatted-content"
                            dangerouslySetInnerHTML={{ 
                              __html: article.content
                                .replace(/\n\n/g, '</p><p class="mb-6">')
                                .replace(/\n/g, '<br>')
                                .replace(/^/, '<p class="mb-6">')
                                .replace(/$/, '</p>')
                            }} 
                          />
                ) : (
                  <div className="space-y-6">
                            <p className="text-lg leading-relaxed">
                      {article.summary}
                    </p>
                            
                            <div className="bg-gradient-to-r from-jamaica-green-50 to-jamaica-gold-50 border-l-4 border-jamaica-green-500 p-6 rounded-r-xl">
                              <p className="text-gray-700 font-medium">
                                This is a developing story from Jamaica's dynamic news landscape. 
                                Our editorial team is working to bring you comprehensive coverage 
                                of this important {article.category} story.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                              <div>
                                <Image
                                  src={relatedImage}
                                  alt="Related to story"
                                  width={400}
                                  height={300}
                                  className="w-full h-48 object-cover rounded-xl shadow-md"
                                />
                              </div>
                              <div>
                                <Image
                                  src={relatedImage}
                                  alt="Jamaica community"
                                  width={400}
                                  height={300}
                                  className="w-full h-48 object-cover rounded-xl shadow-md"
                                />
                              </div>
                            </div>

                            <p className="text-lg leading-relaxed">
                              Stay tuned to YaadFeed for updates on this story and other breaking news 
                              from Jamaica and the Caribbean diaspora. We're committed to bringing you 
                              authentic, verified reporting on the stories that matter most to our community.
                            </p>

                            <blockquote className="bg-white/60 backdrop-blur-sm border-l-4 border-jamaica-gold-500 p-6 rounded-r-xl italic text-lg">
                              "At YaadFeed, we believe in the power of authentic Jamaican voices to 
                              tell our own stories and share our rich culture with the world."
                            </blockquote>
                  </div>
                )}
              </div>
            </div>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Topics</h3>
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="bg-gray-100 hover:bg-jamaica-green-100 text-gray-700 hover:text-jamaica-green-800 px-3 py-1 rounded-full text-sm transition-colors duration-200 cursor-pointer"
                            >
                              #{tag}
                            </span>
                          ))}
                  </div>
                </div>
                    )}
                  </article>
                </Card>

                {/* Comments Section */}
                <div className="mt-12">
                  <Card className="p-8 bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl">
                    <Comments 
                      articleId={article._id || article.id || slug}
                    />
                  </Card>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-8">
                  {/* Newsletter Signup */}
                  <Card className="p-6 bg-gradient-to-br from-jamaica-green-50 to-jamaica-gold-50 border border-jamaica-green-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Stay Updated</h3>
                    <p className="text-gray-600 mb-4">
                      Get the latest Jamaica news delivered to your inbox.
                    </p>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Your email"
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jamaica-green-500 focus:border-transparent"
                      />
                      <Button className="w-full bg-gradient-to-r from-jamaica-green-600 to-jamaica-gold-500 hover:from-jamaica-green-700 hover:to-jamaica-gold-600">
                        Subscribe Free
                      </Button>
            </div>
                  </Card>

        {/* Related Articles */}
                  <Card className="p-6 bg-white/90 backdrop-blur-sm border border-white/20">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">You Might Also Like</h3>
                    <div className="space-y-4">
                      {relatedArticles && relatedArticles.length > 0 ? (
                        relatedArticles.map((relatedArticle: any, index: number) => (
                          <Link 
                            key={relatedArticle.id}
                            href={`/news/${relatedArticle.slug}`}
                            className="block group hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200"
                          >
                            <div className="flex space-x-3">
                        <Image
                                src={relatedImage}
                          alt={relatedArticle.title}
                                width={80}
                                height={60}
                                className="w-20 h-15 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-jamaica-green-600 transition-colors line-clamp-2">
                                  {relatedArticle.title}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatters.relative(relatedArticle.publishedAt)}
                                </p>
                              </div>
                      </div>
                          </Link>
                        ))
                      ) : (
                        [1, 2, 3].map((item) => (
                          <Link 
                            key={item}
                            href="/news"
                            className="block group hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200"
                          >
                            <div className="flex space-x-3">
                              <Image
                                src={relatedImage}
                                alt={`Related story ${item}`}
                                width={80}
                                height={60}
                                className="w-20 h-15 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-jamaica-green-600 transition-colors line-clamp-2">
                                  Latest updates from Jamaica's vibrant community
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                  about {Math.floor(Math.random() * 23) + 1} hours ago
                                </p>
                              </div>
                      </div>
                    </Link>
                        ))
                      )}
                    </div>
                  </Card>
                </div>
              </div>
              </div>
            </div>
          </section>
      </main>

        <Footer />
      </div>
  );
} 