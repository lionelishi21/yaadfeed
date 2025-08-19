'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Zap, 
  RefreshCw,
  Calendar,
  User,
  Tag,
  TrendingUp,
  BarChart3,
  Settings,
  Download,
  Upload
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  status: 'published' | 'draft' | 'pending';
  views: number;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  hasImage: boolean;
  keywords: string[];
}

interface ArticleStats {
  totalArticles: number;
  published: number;
  drafts: number;
  totalViews: number;
  avgViews: number;
  topCategory: string;
}

export default function ArticlesPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'generate' | 'analytics'>('overview');
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<ArticleStats>({
    totalArticles: 1247,
    published: 1156,
    drafts: 91,
    totalViews: 234567,
    avgViews: 203,
    topCategory: 'music'
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [generateCount, setGenerateCount] = useState(10);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      // Map API response to Article interface
      setArticles(
        (data.news || []).map((item: any) => ({
          id: item.id || item._id,
          title: item.title,
          summary: item.summary,
          content: item.content,
          category: item.category,
          author: item.author,
          status: item.status || 'published',
          views: item.viewCount || 0,
          createdAt: item.publishedAt || item.createdAt,
          updatedAt: item.updatedAt,
          featured: !!item.isPopular,
          hasImage: !!item.imageUrl,
          keywords: item.keywords || [],
        }))
      );
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateArticles = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/regenerate-articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          count: generateCount,
          mode: 'generate'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Successfully generated ${result.generated} articles!`);
        fetchArticles(); // Refresh the list
      } else {
        alert('Failed to generate articles. Please try again.');
      }
    } catch (error) {
      console.error('Article generation failed:', error);
      alert('Error generating articles. Please check your connection.');
    } finally {
      setGenerating(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      setLoading(true);
      try {
        const response = await fetch(`/api/news/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete article');
        setArticles(prev => prev.filter(article => article.id !== id));
      } catch (error) {
        alert('Error deleting article.');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleFeatured = async (id: string) => {
    const article = articles.find(a => a.id === id);
    if (!article) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPopular: !article.featured })
      });
      if (!response.ok) throw new Error('Failed to update article');
      fetchArticles();
    } catch (error) {
      alert('Error updating article.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'music': return 'bg-pink-100 text-pink-800';
      case 'politics': return 'bg-blue-100 text-blue-800';
      case 'sports': return 'bg-orange-100 text-orange-800';
      case 'business': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Article Management</h1>
          <p className="mt-2 text-gray-600">Create, manage, and optimize your content with AI assistance</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </button>
          <button
            onClick={generateArticles}
            disabled={generating}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>AI Generate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalArticles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Edit className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.drafts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgViews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-pink-50 rounded-lg">
              <Tag className="w-6 h-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Category</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">{stats.topCategory}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'articles', label: 'All Articles' },
            { key: 'generate', label: 'AI Generator' },
            { key: 'analytics', label: 'Analytics' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <h2 className="text-xl font-semibold mb-2">🚀 AI-Powered Content Creation</h2>
            <p className="text-blue-100 mb-4">
              Generate authentic Jamaican content with ChatGPT-4, complete with local context and cultural relevance!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">65+</p>
                <p className="text-sm text-blue-100">Topic Templates</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm text-blue-100">Jamaican Voice</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">$0.03</p>
                <p className="text-sm text-blue-100">Cost per Article</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Content Categories</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Music & Artists</span>
                  <span className="font-medium">456 articles</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Politics & Government</span>
                  <span className="font-medium">234 articles</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sports & Culture</span>
                  <span className="font-medium">189 articles</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Business & Economy</span>
                  <span className="font-medium">156 articles</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">15 articles generated today</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">23 articles published this week</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">89% articles have AI images</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Average 203 views per article</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles Tab */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">All Articles</h3>
                <div className="flex space-x-3">
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>All Categories</option>
                    <option>Music</option>
                    <option>Politics</option>
                    <option>Sports</option>
                    <option>Business</option>
                  </select>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>All Status</option>
                    <option>Published</option>
                    <option>Draft</option>
                    <option>Pending</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading articles...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Article
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {articles.map((article) => (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {article.featured && (
                              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                {article.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                by {article.author}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(article.category)}`}>
                            {article.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(article.status)}`}>
                            {article.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {article.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleFeatured(article.id)}
                              className={`${article.featured ? 'text-yellow-600' : 'text-gray-400'} hover:text-yellow-900`}
                            >
                              <TrendingUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteArticle(article.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Generator Tab */}
      {activeTab === 'generate' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">AI Article Generator</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Articles
                  </label>
                  <input
                    type="number"
                    value={generateCount}
                    onChange={(e) => setGenerateCount(parseInt(e.target.value) || 10)}
                    min="1"
                    max="50"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Estimated cost: ${(generateCount * 0.03).toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Focus
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500">
                    <option>Mixed Content (Recommended)</option>
                    <option>Music & Artists Only</option>
                    <option>News & Politics Only</option>
                    <option>Sports & Culture Only</option>
                    <option>Business & Economy Only</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">AI Generation Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Authentic Jamaican perspective</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>SEO-optimized content</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Cultural references included</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Automatic image generation</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <p>Last generation: 2 hours ago (15 articles)</p>
                  <p>Total AI articles this month: 234</p>
                </div>
                <button
                  onClick={generateArticles}
                  disabled={generating}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Generating {generateCount} Articles...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Generate {generateCount} Articles</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Top Performing Articles</h3>
              <div className="space-y-4">
                {articles.slice(0, 5).map((article, index) => (
                  <div key={article.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-sm truncate max-w-xs">{article.title}</h4>
                        <p className="text-xs text-gray-500">{article.category} • {article.author}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{article.views.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Content Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average views per article</span>
                  <span className="font-medium">{stats.avgViews}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Most popular category</span>
                  <span className="font-medium capitalize">{stats.topCategory}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Articles with images</span>
                  <span className="font-medium">89%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Featured articles</span>
                  <span className="font-medium">12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 