'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Eye, Share2, Tag, Clock, Bookmark } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Footer from '@/components/Footer';
import Comments from '@/components/Comments';
import { formatters, stringUtils, contentUtils, highlightKeywords } from '@/utils';
import ClientHeader from '@/components/ClientHeader';
import AudioPlayer from '@/components/AudioPlayer';
import SocialShare from '@/components/SocialShare';
import { ARTICLE_HIGHLIGHT_KEYWORDS } from '@/config/keywords';

import { useSession } from 'next-auth/react';

interface ArticleContentProps {
  article: any;
  relatedArticles: any[];
  slug: string;
}

export default function ArticleContent({ article, relatedArticles, slug }: ArticleContentProps) {
  const { data: session } = useSession();
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
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [headings, setHeadings] = useState<{ id: string, text: string }[]>([]);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);

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

  // Track article read
  useEffect(() => {
    if (session?.user && article?.id) {
      fetch('/api/user/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id }),
      }).catch(err => console.error('Failed to track read:', err));
    }
  }, [session, article?.id]);

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
    const content = article?.content || article?.summary || '';
    
    const hasHtml = /<(p|br|h[1-6]|ul|ol|li|blockquote)[^>]*>/i.test(content);
    let processedContent = content;
    
    if (!hasHtml) {
      // Legacy plain text: convert newlines to paragraph tags
      const sanitized = contentUtils.sanitizeText(content);
      const paragraphs = sanitized.split(/\n+/).filter(p => p.trim().length > 0);
      
      // Wrap paragraphs (the CSS will automatically add a drop-cap to the first paragraph)
      processedContent = paragraphs.map((p: string) => `<p>${p}</p>`).join('');
    } else {
      // New HTML format: just strip XML CDATA markers if present
      processedContent = content.replace(/<!\[CDATA\[|]]>/g, '');
    }
    
    // Highlight configured keywords
    let highlightedContent = highlightKeywords(processedContent, ARTICLE_HIGHLIGHT_KEYWORDS);
    
    // Safely convert Markdown headings to HTML headings
    highlightedContent = highlightedContent
      .replace(/### ([^\n<]+)/g, '<h3>$1</h3>')
      .replace(/## ([^\n<]+)/g, '<h2>$1</h2>');
      
    // Extract headings for TOC
    const extractedHeadings: { id: string, text: string }[] = [];
    highlightedContent = highlightedContent.replace(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi, (match, level, text) => {
      const cleanText = text.replace(/<[^>]+>/g, "").trim();
      if (!cleanText) return match;
      const id = cleanText.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
      extractedHeadings.push({ id, text: cleanText });
      return `<h${level} id="${id}" class="scroll-mt-32 font-serif font-bold text-white mb-4 mt-8">${text}</h${level}>`;
    });
    
    setHtmlContent(highlightedContent);
    setHeadings(extractedHeadings);
  }, [article]);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveHeading(visible[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings, htmlContent]);

  return (
    <div className="min-h-screen bg-transparent text-white font-sans overflow-x-hidden">
      <ClientHeader />

      <main>
        {/* Hero */}
        <div className="relative w-full h-[420px] md:h-[500px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#091208] via-[#111f0a] to-[#020702]"></div>
          
          {/* Decorative SVG */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <rect x="6" y="6" width="68" height="68" rx="3" fill="none" stroke="#E8B84B" strokeWidth="1.5"/>
              <circle cx="28" cy="30" r="11" fill="#E8B84B" opacity=".45"/>
              <path d="M6 62 L24 40 L38 54 L52 32 L74 62Z" fill="#E8B84B" opacity=".3"/>
            </svg>
          </div>

          <Image 
            src={heroImage || `/images/placeholder-${article?.category || 'general'}.jpg`} 
            alt={article.title} 
            fill
            className="object-cover opacity-60"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto p-6 md:p-12">
            <div className="inline-block bg-[#E8B84B] text-[#0B0B0B] px-3 py-1 rounded-sm text-[10px] font-bold tracking-[0.12em] uppercase mb-4">
              {stringUtils.capitalize(article.category)}
            </div>
            <h1 className="font-serif text-3xl md:text-[44px] font-black text-white leading-[1.1] m-0 tracking-[-0.01em] text-balance">
              {contentUtils.sanitizeText(article.title)}
            </h1>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 flex flex-col lg:flex-row gap-12 bg-transparent">
          
          <div className="flex-1 min-w-0 max-w-4xl mx-auto lg:mx-0">
            {/* Meta */}
            <div className="flex items-center justify-between p-6 md:px-12 md:py-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8B84B] to-[#9a7020] flex items-center justify-center text-[11px] font-bold text-[#0B0B0B] shrink-0">
                YV
              </div>
              <div>
                <div className="text-[13px] font-medium text-white">YardVybes Staff</div>
                <div className="text-[11px] text-white/40">
                  {formatters.date(article.publishedAt)} · {article.readTime} min read
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                <Bookmark className="w-4 h-4 text-[#E8B84B]" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-8 md:px-12 md:py-10">
            {/* Summary Block */}
            {article.summary && (
              <div className="mb-8 p-6 bg-yard-gold/5 border-l-4 border-yard-gold rounded-r-md">
                <h3 className="text-yard-gold font-bold text-sm uppercase tracking-wider mb-2">Quick Summary</h3>
                <p className="text-white/90 text-lg font-medium leading-relaxed">
                  {article.summary
                    .replace(/<!\[CDATA\[|]]>/g, '')
                    .replace(/<[^>]+>/g, '')
                    .replace(/Read More(?:\s*\(\s*Source:\s*[^)]+\))?/gi, '')
                    .trim()}
                </p>
              </div>
            )}
            
            {/* Audio Player */}
            <AudioPlayer title={article.title} content={htmlContent} slug={slug} />

            {/* Ad: After summary, before article body */}
            <div className="my-8">
            </div>

            <div className="mb-10 relative w-full h-[300px] md:float-right md:w-[400px] md:ml-8 md:mb-6 rounded-sm overflow-hidden border border-white/10">
              <Image
                src={relatedImage || heroImage || `/images/placeholder-${article?.category || 'general'}.jpg`}
                alt="Related visual"
                fill
                className="object-cover"
              />
            </div>

            <article 
              className="yf-article max-w-none" 
              dangerouslySetInnerHTML={{ __html: htmlContent }} 
            />
          </div>
          
          {/* Social Share Buttons */}
          <SocialShare url={`/news/${slug}`} title={article.title} />

          {/* Author / Source Box */}
          {article.tags && article.tags.length > 0 && (
            <div className="px-6 pb-8 md:px-12 md:pb-10 flex flex-wrap gap-2">
              {article.tags.map((tag: string, index: number) => (
                <div key={index} className="border border-[#E8B84B]/40 text-[#E8B84B] px-3 py-1 rounded-sm text-[11px] font-medium tracking-[0.05em] hover:bg-[#E8B84B]/10 cursor-pointer transition-colors">
                  {tag}
                </div>
              ))}
            </div>
          )}

          {/* Related */}
          <div className="p-6 md:p-12 border-t border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div className="text-[9px] font-bold tracking-[0.14em] text-white/30 uppercase">More Stories</div>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles && relatedArticles.length > 0 ? (
                relatedArticles.slice(0,3).map((relatedArticle: any, index: number) => (
                  <Link href={`/news/${relatedArticle.slug}`} key={relatedArticle.id} className="flex-1 border border-white/5 rounded-sm overflow-hidden hover:border-white/20 transition-colors group flex flex-col">
                    <div className="h-[88px] relative shrink-0">
                      <Image src={relatedImage || `/images/placeholder-${relatedArticle?.category || 'general'}.jpg`} alt={relatedArticle.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 bg-[#090909] flex-1 flex flex-col justify-start">
                      <div className="inline-block self-start bg-[#E8B84B]/10 text-[#E8B84B] px-2 py-0.5 rounded-sm text-[9px] font-bold tracking-[0.1em] uppercase mb-2">
                        {stringUtils.capitalize(relatedArticle.category || 'News')}
                      </div>
                      <div className="font-serif text-[14px] font-bold text-white/90 leading-[1.35] line-clamp-3">
                        {relatedArticle.title}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                [1, 2, 3].map((item) => (
                  <div key={item} className="flex-1 border border-white/5 rounded-sm overflow-hidden hover:border-white/20 transition-colors cursor-pointer group flex flex-col">
                    <div className="h-[88px] bg-gradient-to-br from-[#091500] to-[#1a2c00] shrink-0"></div>
                    <div className="p-4 bg-[#090909] flex-1 flex flex-col justify-start">
                      <div className="inline-block self-start bg-[#E8B84B]/10 text-[#E8B84B] px-2 py-0.5 rounded-sm text-[9px] font-bold tracking-[0.1em] uppercase mb-2">
                        Culture
                      </div>
                      <div className="font-serif text-[14px] font-bold text-white/90 leading-[1.35]">
                        Kingston Is Reshaping Global Pop Culture
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ad: Before comments - high engagement zone */}
          <div className="px-6 md:px-12 pb-8">
          </div>

            {/* Comments Section */}
            <div className="p-6 md:p-12 border-t border-white/5">
              <Comments articleId={article._id || article.id || slug} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-[320px] shrink-0">
            <div className="sticky top-28 space-y-8">
              {headings.length > 0 && (
                <div className="bg-[#090909] border border-white/10 rounded-xl p-6">
                  <h3 className="text-[#E8B84B] font-bold text-[11px] tracking-[0.15em] uppercase mb-5">
                    On This Page
                  </h3>
                  <nav className="space-y-3">
                    {headings.map((h) => (
                      <a 
                        key={h.id} 
                        href={`#${h.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(h.id);
                          if (el) {
                            const top = el.getBoundingClientRect().top + window.scrollY - 100;
                            window.scrollTo({ top, behavior: 'smooth' });
                            setActiveHeading(h.id);
                          }
                        }}
                        className={`block text-[14px] leading-snug transition-colors relative pl-3 ${
                          activeHeading === h.id 
                            ? 'text-[#E8B84B] font-medium' 
                            : 'text-white/60 hover:text-white/90'
                        }`}
                      >
                        <span className={`absolute left-0 top-0 bottom-0 w-[2px] transition-colors ${
                          activeHeading === h.id ? 'bg-[#E8B84B]' : 'bg-transparent'
                        }`} />
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </aside>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}; 