import React from 'react';
export const dynamic = "force-dynamic";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleContent from '@/components/ArticleContent';

// Generate static params for static export
export async function generateStaticParams() {
  try {
    const { default: NewsService } = await import('@/lib/mongodb');
    const slugs = await NewsService.getAllSlugs();
    return slugs.map(slug => ({ slug }));
  } catch (error) {
    console.error('Error fetching slugs for generateStaticParams:', error);
    // Fallback to empty array if database is not available
    return [];
  }
}

// Centralized data fetching function
async function fetchArticleData(slug: string) {
  try {
    console.log(`Fetching article data for slug: ${slug}`);
    
    const { default: NewsService } = await import('@/lib/mongodb');
    
    // Try to find article by slug first
    let article = await NewsService.getNewsBySlug(slug);

    // If not found by slug, try by ID
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
    const relatedArticles = await NewsService.getRelatedNews(
      article.category, 
      article.slug, 
      3
    );

    // Transform article data (defensive)
    let articleContent = typeof article.content === 'string' ? article.content : '';
    const articleViewCount = typeof article.viewCount === 'number' ? article.viewCount : 0;
    
    const transformedArticle = {
      id: (article as any)._id,
      title: article.title || '',
      slug: article.slug || '',
      summary: (article.summary && article.summary.length > 40) ? article.summary : (articleContent ? (articleContent.slice(0, 320) + (articleContent.length > 320 ? '…' : '')) : ''),
      content: articleContent,
      imageUrl: article.imageUrl || '',
      category: article.category || 'general',
      source: article.source || '',
      publishedAt: article.publishedAt,
      author: article.author || '',
      tags: Array.isArray(article.tags) ? article.tags : [],
      keywords: Array.isArray(article.keywords) ? article.keywords : [],
      isPopular: !!article.isPopular,
      viewCount: articleViewCount + 1, // Include the increment
      readTime: Math.max(1, Math.ceil(articleContent.length / 1000))
    };

    // Transform related articles (defensive)
    const transformedRelated = relatedArticles.map(item => {
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
        readTime: Math.max(1, Math.ceil(c.length / 1000))
      }
    });

    console.log('Successfully fetched article data from database');
    return {
      article: transformedArticle,
      relatedArticles: transformedRelated
    };
    
  } catch (error) {
    console.error('Error fetching article from database:', error);
    return null;
  }
}

// Article page component (Server Component)
export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await fetchArticleData(slug);

  if (!data || !data.article) {
    console.log('Article not found, calling notFound()');
    notFound();
  }
  
  const article = data.article;
  const relatedArticles = data.relatedArticles || [];

  // Serialize MongoDB docs to plain JSON-safe objects for Client Components
  const serializeArticle = (a: any) => ({
    id: typeof a._id?.toString === 'function' ? a._id.toString() : a.id || '',
    title: a.title || '',
    slug: a.slug || '',
    summary: a.summary || '',
    content: typeof a.content === 'string' ? a.content : (a.content ? String(a.content) : ''),
    imageUrl: a.imageUrl || '',
    category: a.category || 'general',
    source: a.source || '',
    publishedAt: typeof a.publishedAt === 'string' ? a.publishedAt : (a.publishedAt ? new Date(a.publishedAt).toISOString() : ''),
    author: a.author || '',
    tags: Array.isArray(a.tags) ? a.tags : [],
    keywords: Array.isArray(a.keywords) ? a.keywords : [],
    isPopular: !!a.isPopular,
    viewCount: typeof a.viewCount === 'number' ? a.viewCount : 0,
  });

  const safeArticle = serializeArticle(article);
  const safeRelated = Array.isArray(relatedArticles) ? relatedArticles.map(serializeArticle) : [];

  return (
    <ArticleContent article={safeArticle} relatedArticles={safeRelated} slug={slug} />
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchArticleData(slug);
  const article = data?.article;
  
  if (!article) {
    return {
      title: 'Article Not Found - YaadFeed',
      description: 'The requested article could not be found.'
    };
  }

  return {
    title: `${article.title} - YaadFeed`,
    description: article.summary,
    alternates: { canonical: `/news/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.summary,
      images: article.imageUrl ? [article.imageUrl] : undefined,
      type: 'article',
      publishedTime: (typeof article.publishedAt === 'string') ? article.publishedAt : article.publishedAt?.toISOString(),
      authors: article.author ? [article.author] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    }
  };
}