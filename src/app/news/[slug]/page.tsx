import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calendar, User, Eye, Share2, Tag, Clock, Bookmark } from 'lucide-react';

// Generate static params for static export
export async function generateStaticParams() {
  return [
    { slug: 'bob-marleys-legacy-continues-to-inspire-new-generation-of-jamaican-artists' },
    { slug: 'jamaicas-tourism-industry-shows-strong-recovery-post-pandemic' },
    { slug: 'reggae-sumfest-2025-lineup-announced-featuring-international-and-local-stars' }
  ];
}
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Footer from '@/components/Footer';
import Comments from '@/components/Comments';
import { notFound } from 'next/navigation';
import { formatters, stringUtils } from '@/utils';
import Header from '@/components/Header';
import ArticleContent from '@/components/ArticleContent';

// Article page component (Server Component)
export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yaadfeed.com';
  let data: any = null;
  try {
    const res = await fetch(`/api/news/${params.slug}`, { next: { revalidate: 60 }, cache: 'no-store' });
    if (!res.ok) {
      notFound();
    }
    data = await res.json().catch(() => null);
  } catch (e) {
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

  // (JSON-LD removed from inline script to avoid SSR head issues)

  return (
    <ArticleContent article={safeArticle} relatedArticles={safeRelated} slug={params.slug} />
  );
}

// Removed unused fetchArticle function for static export compatibility

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  let data: any = null;
  try {
    const res = await fetch(`/api/news/${params.slug}`, { cache: 'no-store' });
    data = res.ok ? await res.json().catch(() => null) : null;
  } catch {
    // Fallback to absolute URL to avoid server 500
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yaadfeed.com';
    try {
      const res2 = await fetch(`${siteUrl}/api/news/${params.slug}`, { cache: 'no-store' });
      data = res2.ok ? await res2.json().catch(() => null) : null;
    } catch {}
  }
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
