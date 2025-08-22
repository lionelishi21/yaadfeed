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
import { NextResponse } from 'next/server';
import { NewsService } from '@/lib/mongodb';
import ArticleContent from '@/components/ArticleContent';

// Article page component (Server Component)
export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  // Fetch article and related articles
  let article = await NewsService.getNewsBySlug(params.slug);
  if (!article) {
    article = await NewsService.getNewsById(params.slug);
  }
  if (!article) {
    notFound();
  }
  const relatedArticles = article.category
    ? await NewsService.getRelatedNews(article.category, article.slug)
    : [];

  return <ArticleContent article={article} relatedArticles={relatedArticles} slug={params.slug} />;
}

// Removed unused fetchArticle function for static export compatibility

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await NewsService.getNewsBySlug(params.slug) || await NewsService.getNewsById(params.slug);
  
  if (!article) {
    return {
      title: 'Article Not Found - YaadFeed',
      description: 'The requested article could not be found.'
    };
  }

  return {
    title: `${article.title} - YaadFeed`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: article.imageUrl ? [article.imageUrl] : undefined,
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
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
