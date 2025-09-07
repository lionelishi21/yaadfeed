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
  // Use the article's actual image if available (relative or absolute). Otherwise generate AI image, else placeholder
  const getImageUrl = async (article: any, width: number, height: number): Promise<string> => {
    const provided = article?.imageUrl;
    if (typeof provided === 'string' && provided.trim().length > 0) {
      // Accept both relative and absolute URLs
      try {
        // Valid absolute URL
        const u = new URL(provided);
        if (u.protocol === 'http:' || u.protocol === 'https:') {
          return provided;
        }
      } catch {
        // Not an absolute URL – treat as relative path
        return provided.startsWith('/') ? provided : `/${provided}`;
      }
    }

    // Try to generate AI image if none provided
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article?.title || `Jamaica ${article?.category || 'general'}`,
          category: article?.category || 'general',
          keywords: article?.keywords || [],
          summary: article?.summary || '',
          forceGenerate: true,
          width,
          height,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result?.success && typeof result.imageUrl === 'string') {
          return result.imageUrl;
        }
      }
    } catch (error) {
      console.error('AI image generation failed:', error);
    }

    // Fallback placeholder by category
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
  const [paragraphs, setParagraphs] = useState<string[]>([]);

  const stripHtmlToText = (html: string): string => {
    if (!html) return '';
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<br\s*\/?\s*>/gi, '\n')
      .replace(/<\/(p|div|section|article|h\d|li)>/gi, '\n\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\r/g, '')
      .replace(/\t/g, ' ')
      .replace(/ +/g, ' ')
      .trim();
  };

  const splitIntoParagraphs = (text: string): string[] => {
    if (!text) return [];
    const raw = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
    if (raw.length > 0) return raw;
    const sentences = text.split(/(?<=[.!?])\s+/);
    const blocks: string[] = [];
    let buf = '';
    sentences.forEach((s, i) => {
      buf = buf ? `${buf} ${s}` : s;
      if (buf.length > 280 || i === sentences.length - 1) {
        blocks.push(buf.trim());
        buf = '';
      }
    });
    return blocks.filter(Boolean);
  };

  const renderEmbed = (embed: any, idx: number) => {
    if (!embed || !embed.url) return null;
    const url = String(embed.url);
    const type = String(embed.type || 'link');
    if (type === 'youtube') {
      let videoId = '';
      try {
        const u = new URL(url);
        if (u.hostname.includes('youtu.be')) videoId = u.pathname.replace('/', '');
        else if (u.searchParams.get('v')) videoId = u.searchParams.get('v') as string;
      } catch {}
      if (!videoId) {
        return (
          <a key={`emb-${idx}`} href={url} target="_blank" rel="noopener noreferrer" className="block my-6 underline text-jamaica-green-700">Watch on YouTube</a>
        );
      }
      return (
        <div key={`emb-${idx}`} className="my-6 aspect-video rounded-xl overflow-hidden shadow">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      );
    }
    if (type === 'instagram') {
      return (
        <a key={`emb-${idx}`} href={url} target="_blank" rel="noopener noreferrer" className="block my-6">
          <Card className="p-4">
            <p className="text-sm text-gray-700">View this post on Instagram</p>
            <p className="text-xs text-gray-500 break-all">{url}</p>
          </Card>
        </a>
      );
    }
    return (
      <a key={`emb-${idx}`} href={url} target="_blank" rel="noopener noreferrer" className="block my-6">
        <Card className="p-4">
          <p className="text-sm text-gray-700">Related link</p>
          <p className="text-xs text-gray-500 break-all">{url}</p>
        </Card>
      </a>
    );
  };

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
    const text = stripHtmlToText(article?.content || article?.summary || '');
    setParagraphs(splitIntoParagraphs(text));
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
                        src={heroImage || `/images/placeholder-${article?.category || 'general'}.jpg`}
                    alt={article.title}
                        width={1200}
                        height={600}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    priority
                  />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 text-center">{stringUtils.capitalize(article.category)} illustration</p>
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
                      <div className="text-gray-800 leading-relaxed space-y-6">
                        {paragraphs.length > 0 ? (
                          <>
                            {paragraphs.map((p, idx) => (
                              <div key={idx}>
                                <p className="mb-6">{p}</p>
                                {idx === 0 && (
                                  <div className="my-8">
                                    <Card className="overflow-hidden">
                                      <div className="aspect-[16/9] overflow-hidden">
                                        <Image
                                          src={relatedImage || heroImage || `/images/placeholder-${article?.category || 'general'}.jpg`}
                                          alt={article.title}
                                          width={1200}
                                          height={675}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="p-4 text-sm text-gray-600">Illustration: {stringUtils.capitalize(article.category)} context</div>
                                    </Card>
                                  </div>
                                )}
                                {idx === 2 && (
                                  <blockquote className="bg-gradient-to-r from-jamaica-green-50 to-jamaica-gold-50 border-l-4 border-jamaica-gold-500 p-6 rounded-r-xl italic text-lg">
                                    {article.summary || 'Authentic voices from Jamaica shaping the narrative.'}
                                  </blockquote>
                                )}
                            </div>
                            ))}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                              <div>
                                <Image
                                  src={relatedImage || `/images/placeholder-${article?.category || 'general'}.jpg`}
                                  alt="Related to story"
                                  width={600}
                                  height={400}
                                  className="w-full h-56 object-cover rounded-xl shadow-md"
                                />
                              </div>
                              <div>
                                <Image
                                  src={heroImage || `/images/placeholder-${article?.category || 'general'}.jpg`}
                                  alt="Related visual"
                                  width={600}
                                  height={400}
                                  className="w-full h-56 object-cover rounded-xl shadow-md"
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-6">
                            <p className="text-lg leading-relaxed">{article.summary}</p>
                            <div className="bg-gradient-to-r from-jamaica-green-50 to-jamaica-gold-50 border-l-4 border-jamaica-green-500 p-6 rounded-r-xl">
                              <p className="text-gray-700 font-medium">This is a developing story from Jamaica's dynamic news landscape. Our editorial team is working to bring you comprehensive coverage of this important {article.category} story.</p>
                            </div>
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
                  {/* Key Facts */}
                  <Card className="p-6 bg-white/90 backdrop-blur-sm border border-white/20">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Key Facts</h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      {(article.tags && article.tags.length > 0 ? article.tags.slice(0, 5) : (article.summary || '').split(/(?<=[.!?])\s+/).slice(0, 3)).map((fact: string, i: number) => (
                        <li key={i}>{fact}</li>
                      ))}
                    </ul>
                  </Card>
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
                                src={relatedImage || `/images/placeholder-${article?.category || 'general'}.jpg`}
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
                                src={relatedImage || `/images/placeholder-${article?.category || 'general'}.jpg`}
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