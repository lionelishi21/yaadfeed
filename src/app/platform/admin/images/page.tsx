'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { 
  Image, 
  Zap, 
  Eye, 
  Download, 
  Trash2, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Upload,
  Settings,
  BarChart3,
  DollarSign,
  Search
} from 'lucide-react';
import ImageSelector from '@/components/ImageSelector';

interface ImageStats {
  totalImages: number;
  aiGenerated: number;
  localStored: number;
  missingImages: number;
  totalCost: number;
  monthlySavings: number;
}

interface Article {
  id: string;
  title: string;
  category: string;
  hasImage: boolean;
  imageUrl?: string;
  needsImageGeneration: boolean;
  createdAt: string;
  summary?: string;
  keywords?: string[];
}

export default function ImagesPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'missing' | 'individual' | 'generate' | 'settings'>('overview');
  const [stats, setStats] = useState<ImageStats>({
    totalImages: 456,
    aiGenerated: 124,
    localStored: 432,
    missingImages: 23,
    totalCost: 12.45,
    monthlySavings: 234.67
  });
  const [missingImages, setMissingImages] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [generating, setGenerating] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetchMissingImages();
    fetchAllArticles();
  }, []);

  const fetchMissingImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/generate-missing-images');
      if (!response.ok) throw new Error('Failed to fetch missing images');
      const data = await response.json();
      setMissingImages(
        (data.articles || []).map((item: any) => ({
          id: item.id || item._id,
          title: item.title,
          category: item.category,
          hasImage: !!item.imageUrl,
          imageUrl: item.imageUrl,
          needsImageGeneration: !!item.needsImageGeneration,
          createdAt: item.createdAt || '',
          summary: item.summary,
          keywords: item.keywords,
        }))
      );
      // Update stats from API response if available
      if (data.imageStats) {
        setStats({
          totalImages: data.imageStats.totalImages || 0,
          aiGenerated: data.imageStats.aiGenerated || 0,
          localStored: data.imageStats.localStored || 0,
          missingImages: data.articlesNeedingImages || 0,
          totalCost: data.imageStats.totalCost || 0,
          monthlySavings: data.imageStats.monthlySavings || 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch missing images:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllArticles = async () => {
    try {
      const response = await fetch('/api/admin/articles');
      if (response.ok) {
        const data = await response.json();
        setAllArticles(data.articles || []);
      }
    } catch (error) {
      console.error('Failed to fetch all articles:', error);
    }
  };

  const generateImages = async (articleIds: string[]) => {
    setGenerating(true);
    try {
      // If generating for all articles, use generateAll flag
      if (articleIds.length === missingImages.length) {
        const response = await fetch('/api/admin/generate-missing-images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ generateAll: true }),
        });

        if (response.ok) {
          const result = await response.json();
          // Refresh the missing images list
          await fetchMissingImages();
          setSelectedArticles([]);
          alert(`Successfully generated images! ${result.summary?.successful || 0} successful, ${result.summary?.failed || 0} failed.`);
        } else {
          alert('Failed to generate images. Please try again.');
        }
      } else {
        // Generate for specific articles
        const results = [];
        for (const articleId of articleIds) {
          const response = await fetch('/api/admin/generate-missing-images', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ articleId }),
          });

          if (response.ok) {
            const result = await response.json();
            results.push(result);
          }
        }
        
        // Refresh the missing images list
        await fetchMissingImages();
        setSelectedArticles([]);
        alert(`Successfully generated ${results.length} images!`);
      }
    } catch (error) {
      console.error('Image generation failed:', error);
      alert('Error generating images. Please check your connection.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedArticles.length === missingImages.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(missingImages.map(article => article.id));
    }
  };

  const handleSelectArticle = (articleId: string) => {
    setSelectedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handleImageSelected = (imageUrl: string) => {
    if (selectedArticle) {
      // Update the article with the new image
      setAllArticles(prev => 
        prev.map(article => 
          article.id === selectedArticle.id 
            ? { ...article, imageUrl, hasImage: true }
            : article
        )
      );
      setMissingImages(prev => 
        prev.map(article => 
          article.id === selectedArticle.id 
            ? { ...article, imageUrl, hasImage: true }
            : article
        )
      );
    }
  };

  const filteredArticles = allArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Image Management</h1>
          <p className="mt-2 text-gray-600">Generate, manage, and optimize AI images for your articles</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Cost Tracker</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'missing', label: `Missing Images (${stats.missingImages})` },
            { key: 'individual', label: 'Individual Selection' },
            { key: 'generate', label: 'Bulk Generate' },
            { key: 'settings', label: 'Settings' },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Image className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Images</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalImages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AI Generated</p>
                <p className="text-2xl font-bold text-gray-900">{stats.aiGenerated}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Local Stored</p>
                <p className="text-2xl font-bold text-gray-900">{stats.localStored}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Missing Images</p>
                <p className="text-2xl font-bold text-gray-900">{stats.missingImages}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Individual Selection Tab */}
      {activeTab === 'individual' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Article List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                      selectedArticle?.id === article.id ? 'bg-green-50 border-green-200' : ''
                    }`}
                  >
                    <h4 className="font-medium text-gray-900 truncate">{article.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        article.category === 'music' ? 'bg-pink-100 text-pink-800' :
                        article.category === 'politics' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {article.category}
                      </span>
                      {article.hasImage ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image Selector */}
          <div className="lg:col-span-2">
            {selectedArticle ? (
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedArticle.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Category: {selectedArticle.category} • 
                    {selectedArticle.hasImage ? ' Has Image' : ' Missing Image'}
                  </p>
                </div>
                
                <ImageSelector
                  title={selectedArticle.title}
                  category={selectedArticle.category}
                  keywords={selectedArticle.keywords}
                  summary={selectedArticle.summary}
                  currentImageUrl={selectedArticle.imageUrl}
                  onImageSelected={handleImageSelected}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="text-center text-gray-500">
                  <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Select an Article</h3>
                  <p className="text-sm">Choose an article from the list to manage its image</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Missing Images Tab */}
      {activeTab === 'missing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Articles Missing Images</h3>
                  <p className="text-gray-600">Generate AI images for articles that need them</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleSelectAll}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {selectedArticles.length === missingImages.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <button
                    onClick={() => generateImages(selectedArticles)}
                    disabled={selectedArticles.length === 0 || generating}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Generate Selected ({selectedArticles.length})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading articles...</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {missingImages.map((article) => (
                  <div key={article.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedArticles.includes(article.id)}
                        onChange={() => handleSelectArticle(article.id)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{article.title}</h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            article.category === 'music' ? 'bg-pink-100 text-pink-800' :
                            article.category === 'politics' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {article.category}
                          </span>
                          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm text-gray-500">No image</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bulk Generate Tab */}
      {activeTab === 'generate' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Bulk Image Generation</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 group transition-colors">
                  <Zap className="w-8 h-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 group-hover:text-green-600">Generate All Missing</h4>
                  <p className="text-sm text-gray-500">Create images for all articles without them</p>
                  <p className="text-xs text-gray-400 mt-2">~$1.64 estimated cost</p>
                </button>

                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 group transition-colors">
                  <RefreshCw className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600">Regenerate Low Quality</h4>
                  <p className="text-sm text-gray-500">Replace poor performing images</p>
                  <p className="text-xs text-gray-400 mt-2">~$0.80 estimated cost</p>
                </button>

                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 group transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 group-hover:text-purple-600">Upload Custom Images</h4>
                  <p className="text-sm text-gray-500">Manually upload images for specific articles</p>
                  <p className="text-xs text-gray-400 mt-2">No API cost</p>
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">Cost Optimization Tips</h4>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Music articles get priority for AI generation (higher engagement)</li>
                        <li>General articles use fallback images to save costs</li>
                        <li>Generated images are stored locally forever (one-time cost)</li>
                        <li>Estimated cost: $0.07 per DALL-E image</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Image Generation Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto-generate for new articles</h4>
                  <p className="text-sm text-gray-600">Automatically create images when articles are published</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Priority categories for AI generation</h4>
                  <p className="text-sm text-gray-600">Only generate AI images for selected categories</p>
                </div>
                <div className="flex space-x-2">
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-pink-100 text-pink-800 rounded-full">music</span>
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">featured</span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">DALL-E Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image Size</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500">
                      <option value="1024x1024">1024x1024 (Square)</option>
                      <option value="1792x1024">1792x1024 (Landscape)</option>
                      <option value="1024x1792">1024x1792 (Portrait)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500">
                      <option value="standard">Standard (Faster, Cheaper)</option>
                      <option value="hd">HD (Slower, More Expensive)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 