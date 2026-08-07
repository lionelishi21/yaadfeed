'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

export default function ArticleEditorPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const isNew = slug === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'general',
    imageUrl: '',
    source: 'YardVybz',
    status: 'draft',
    publishedAt: new Date().toISOString(),
    author: 'Admin',
    tags: '',
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/articles/${slug}`)
        .then(res => res.json())
        .then(data => {
          if (data.article) {
            setFormData({
              ...data.article,
              tags: data.article.tags?.join(', ') || '',
              status: data.article.status || 'published',
            });
          } else {
            setError('Article not found');
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('Failed to load article');
          setLoading(false);
        });
    }
  }, [slug, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto-generate slug from title if it's a new article and we are typing the title
      ...(name === 'title' && isNew ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') } : {})
    }));
  };

  const handleSave = async (status: 'draft' | 'published') => {
    setSaving(true);
    setError('');
    
    try {
      const payload = {
        ...formData,
        status,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        publishedAt: formData.publishedAt || new Date().toISOString()
      };

      const url = isNew ? '/api/news' : `/api/admin/articles/${slug}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to save');

      router.push('/admin/articles');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading editor...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{isNew ? 'Create New Article' : 'Edit Article'}</h1>
        <div className="space-x-3">
          <button 
            onClick={() => router.push('/admin/articles')}
            className="px-4 py-2 text-gray-300 hover:text-white transition"
          >
            Cancel
          </button>
          <button 
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button 
            onClick={() => handleSave('published')}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
          >
            Publish Live
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-white p-4 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Slug</label>
          <input 
            type="text" 
            name="slug" 
            value={formData.slug} 
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="music">Music</option>
              <option value="entertainment">Entertainment</option>
              <option value="culture">Culture</option>
              <option value="sports">Sports</option>
              <option value="news">News</option>
              <option value="general">General</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Tags (comma separated)</label>
            <input 
              type="text" 
              name="tags" 
              value={formData.tags} 
              onChange={handleChange}
              placeholder="dancehall, reggae, vybz kartel"
              className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
          <input 
            type="text" 
            name="imageUrl" 
            value={formData.imageUrl} 
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
          />
          {formData.imageUrl && (
            <div className="mt-2 relative w-full h-48 rounded overflow-hidden">
              <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Summary</label>
          <textarea 
            name="summary" 
            value={formData.summary} 
            onChange={handleChange}
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
          <textarea 
            name="content" 
            value={formData.content} 
            onChange={handleChange}
            rows={15}
            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
}
