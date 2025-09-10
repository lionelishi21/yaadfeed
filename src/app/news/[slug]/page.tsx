import React from 'react';
export const dynamic = 'force-dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calendar, User, Eye, Share2, Tag, Clock, Bookmark } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Footer from '@/components/Footer';
import Comments from '@/components/Comments';
import { notFound } from 'next/navigation';
import { formatters, stringUtils } from '@/utils';
import ClientHeader from '@/components/ClientHeader';
import ArticleContent from '@/components/ArticleContent';

// Centralized data fetching function
async function fetchArticleData(slug: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yaadfeed.com';
  
  try {

    console.log(`Fetching article data for slug: ${slug}`);
    
    
    // Always use absolute URL for server-side fetching
    const response = await fetch(`${siteUrl}/api/news/${slug}`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        // Add any auth headers if needed
      }
    });
    
    console.log(`API Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error ${response.status}:`, errorText);
      return null;
    }
    
    const data = await response.json();
    console.log('Successfully fetched article data');
    return data;
    
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Article page component (Server Component)
export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const data = await fetchArticleData(params.slug);

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
    <ArticleContent article={safeArticle} relatedArticles={safeRelated} slug={params.slug} />
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await fetchArticleData(params.slug);
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