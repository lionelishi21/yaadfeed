import React from 'react';
export const dynamic = "force-dynamic";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleContent from '@/components/ArticleContent';
import { ARTICLE_HIGHLIGHT_KEYWORDS } from '@/config/keywords';
import { highlightKeywords } from '@/utils';
import { contentUtils } from '@/utils';


// ─── Server-side content rendering ───────────────────────────────────────────
// This function converts raw article content to final HTML entirely on the
// server so that Googlebot receives fully-rendered text in the initial HTML
// response — fixing the critical "client-only rendering hides content from
// crawlers" issue.
function buildHtmlContent(rawContent: string): { html: string; headings: { id: string; text: string }[] } {
  if (!rawContent) return { html: '', headings: [] };

  const hasHtml = /<(p|br|h[1-6]|ul|ol|li|blockquote)[^>]*>/i.test(rawContent);
  let processed = rawContent;

  if (!hasHtml) {
    const sanitized = contentUtils.sanitizeText(rawContent);
    const paragraphs = sanitized.split(/\n+/).filter((p) => p.trim().length > 0);
    processed = paragraphs.map((p: string) => `<p>${p}</p>`).join('');
  } else {
    processed = rawContent.replace(/<!\[CDATA\[|]]>/g, '');
  }

  // Highlight configured keywords
  let highlighted = highlightKeywords(processed, ARTICLE_HIGHLIGHT_KEYWORDS);

  // Convert Markdown headings to HTML
  highlighted = highlighted
    .replace(/### ([^\n<]+)/g, '<h3>$1</h3>')
    .replace(/## ([^\n<]+)/g, '<h2>$1</h2>');

  // Extract headings and add IDs for TOC
  const headings: { id: string; text: string }[] = [];
  highlighted = highlighted.replace(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi, (match, level, text) => {
    const cleanText = text.replace(/<[^>]+>/g, '').trim();
    if (!cleanText) return match;
    const id = cleanText
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    headings.push({ id, text: cleanText });
    return `<h${level} id="${id}" class="scroll-mt-32 font-serif font-bold text-white mb-4 mt-8">${text}</h${level}>`;
  });

  return { html: highlighted, headings };
}

// ─── Data fetching ────────────────────────────────────────────────────────────
async function fetchArticleData(slug: string) {
  try {
    console.log(`Fetching article data for slug: ${slug}`);
    
    const { default: NewsService } = await import('@/lib/mongodb');
    
    let article = await NewsService.getNewsBySlug(slug);
    if (!article) {
      article = await NewsService.getNewsById(slug);
    }

    if (!article) {
      console.log('Article not found in database');
      return null;
    }

    // Update view count
    await NewsService.updateViewCount(article.slug);

    // Get related articles
    const relatedArticles = await NewsService.getRelatedNews(article.category, article.slug, 3);

    const articleContent = typeof article.content === 'string' ? article.content : '';
    const articleViewCount = typeof article.viewCount === 'number' ? article.viewCount : 0;
    const wordCount = articleContent.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

    // Pre-render article HTML on the server for SEO
    const { html: preRenderedHtml, headings: preRenderedHeadings } = buildHtmlContent(articleContent);
    
    const transformedArticle = {
      id: (article as any)._id,
      title: article.title || '',
      slug: article.slug || '',
      summary: (article.summary && article.summary.length > 40)
        ? article.summary
        : (articleContent ? (articleContent.replace(/<[^>]+>/g, '').slice(0, 320) + '…') : ''),
      content: articleContent,
      preRenderedHtml,      // ← SSR-rendered HTML for Googlebot
      preRenderedHeadings,  // ← headings extracted server-side
      imageUrl: article.imageUrl || '',
      category: article.category || 'general',
      source: article.source || '',
      publishedAt: article.publishedAt,
      author: article.author || 'YardVybz Staff',
      tags: Array.isArray(article.tags) ? article.tags : [],
      keywords: Array.isArray(article.keywords) ? article.keywords : [],
      isPopular: !!article.isPopular,
      viewCount: articleViewCount + 1,
      readTime: Math.max(1, Math.ceil(wordCount / 200)),
      wordCount,
    };

    const transformedRelated = relatedArticles.map((item: any) => {
      const c = typeof item.content === 'string' ? item.content : '';
      return {
        id: (item as any)._id,
        title: item.title || '',
        slug: item.slug || '',
        summary: item.summary || '',
        imageUrl: item.imageUrl || '',
        category: item.category || 'general',
        source: item.source || '',
        publishedAt: item.publishedAt,
        author: item.author || '',
        viewCount: typeof item.viewCount === 'number' ? item.viewCount : 0,
        readTime: Math.max(1, Math.ceil(c.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / 200)),
      };
    });

    console.log('Successfully fetched article data from database');
    return { article: transformedArticle, relatedArticles: transformedRelated };
    
  } catch (error) {
    console.error('Error fetching article from database:', error);
    return null;
  }
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await fetchArticleData(slug);

  if (!data || !data.article) {
    console.log('Article not found, calling notFound()');
    notFound();
  }
  
  const article = data.article;
  const relatedArticles = data.relatedArticles || [];

  const serializeArticle = (a: any) => ({
    id: typeof a._id?.toString === 'function' ? a._id.toString() : a.id || '',
    title: a.title || '',
    slug: a.slug || '',
    summary: a.summary || '',
    content: typeof a.content === 'string' ? a.content : '',
    preRenderedHtml: typeof a.preRenderedHtml === 'string' ? a.preRenderedHtml : '',
    preRenderedHeadings: Array.isArray(a.preRenderedHeadings) ? a.preRenderedHeadings : [],
    imageUrl: a.imageUrl || '',
    category: a.category || 'general',
    source: a.source || '',
    publishedAt: typeof a.publishedAt === 'string'
      ? a.publishedAt
      : (a.publishedAt ? new Date(a.publishedAt).toISOString() : ''),
    author: a.author || 'YardVybz Staff',
    tags: Array.isArray(a.tags) ? a.tags : [],
    keywords: Array.isArray(a.keywords) ? a.keywords : [],
    isPopular: !!a.isPopular,
    viewCount: typeof a.viewCount === 'number' ? a.viewCount : 0,
    wordCount: typeof a.wordCount === 'number' ? a.wordCount : 0,
  });

  const safeArticle = serializeArticle(article);
  const safeRelated = Array.isArray(relatedArticles) ? relatedArticles.map(serializeArticle) : [];

  // ─── Article JSON-LD structured data ────────────────────────────────────────
  // Required for Google News and AdSense E-E-A-T signals
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    image: article.imageUrl ? [article.imageUrl] : undefined,
    datePublished: typeof article.publishedAt === 'string'
      ? article.publishedAt
      : (article.publishedAt ? new Date(article.publishedAt as any).toISOString() : new Date().toISOString()),
    dateModified: typeof article.publishedAt === 'string'
      ? article.publishedAt
      : (article.publishedAt ? new Date(article.publishedAt as any).toISOString() : new Date().toISOString()),
    author: {
      '@type': 'Organization',
      name: 'YardVybz Editorial',
      url: 'https://yardvybz.news/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'YardVybz',
      url: 'https://yardvybz.news',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yardvybz.news/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://yardvybz.news/news/${article.slug}`,
    },
    keywords: Array.isArray(article.keywords) ? article.keywords.join(', ') : '',
    articleSection: article.category,
    inLanguage: 'en-JM',
  };

  return (
    <>
      {/* Article structured data — critical for E-E-A-T and Google News */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <ArticleContent article={safeArticle} relatedArticles={safeRelated} slug={slug} />
    </>
  );
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchArticleData(slug);
  const article = data?.article;
  
  if (!article) {
    return {
      title: 'Article Not Found - YardVybz',
      description: 'The requested article could not be found.',
    };
  }

  const publishedTime = typeof article.publishedAt === 'string'
    ? article.publishedAt
    : (article.publishedAt ? new Date(article.publishedAt as any).toISOString() : undefined);

  return {
    title: `${article.title} - YardVybz`,
    description: article.summary,
    alternates: { canonical: `https://yardvybz.news/news/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.summary,
      images: article.imageUrl ? [article.imageUrl] : undefined,
      type: 'article',
      publishedTime,
      authors: ['YardVybz Editorial'],
      siteName: 'YardVybz',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
  };
}