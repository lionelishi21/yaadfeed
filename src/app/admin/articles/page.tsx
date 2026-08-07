'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'draft' | 'published';
  publishedAt: string;
  imageUrl?: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/articles')
      .then(res => res.json())
      .then(data => {
        if (data.articles) {
          setArticles(data.articles);
        } else if (data.news) {
          setArticles(data.news);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Articles</h1>
        <Link 
          href="/admin/articles/new" 
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Create New Article
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 border-b border-gray-700 text-gray-300">
              <th className="p-4 font-semibold">Image</th>
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">Loading articles...</td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">No articles found.</td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="border-b border-gray-700 hover:bg-gray-750 transition">
                  <td className="p-4">
                    {article.imageUrl ? (
                      <div className="relative w-16 h-12 rounded overflow-hidden">
                        <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-12 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">
                        No Img
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium max-w-md truncate">{article.title}</td>
                  <td className="p-4 text-gray-400 capitalize">{article.category}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      article.status === 'draft' ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'
                    }`}>
                      {article.status || 'published'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/admin/articles/${article.slug}`}
                      className="text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
