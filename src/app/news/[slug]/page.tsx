import React from 'react';
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

// Fetch article from MongoDB API
async function fetchArticle(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4000';
    const response = await fetch(`${baseUrl}/api/news/${slug}`, {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await fetchArticle(params.slug);
  
  if (!data || !data.article) {
    return {
      title: 'Article Not Found - YaadFeed',
      description: 'The requested article could not be found.'
    };
  }

  const { article } = data;

  return {
    title: `${article.title} - YaadFeed`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: article.imageUrl ? [article.imageUrl] : undefined,
      type: 'article',
      publishedTime: article.publishedAt,
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
