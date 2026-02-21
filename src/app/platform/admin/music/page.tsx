'use client';

// Force dynamic rendering for admin music page
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { 
  Music, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  Users, 
  TrendingUp,
  MapPin,
  Calendar,
  ExternalLink,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  MoreVertical
} from 'lucide-react';
import { Artist } from '@/types';
import { toast } from 'react-hot-toast';

interface ArtistWithStats extends Artist {
  articleCount?: number;
  lastArticleDate?: string;
  totalViews?: number;
}

const AdminMusicPage = () => {
  const [artists, setArtists] = useState<ArtistWithStats[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<ArtistWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'followers' | 'articleCount' | 'lastArticle'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [editingArtist, setEditingArtist] = useState<ArtistWithStats | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const genres = ['all', 'dancehall', 'reggae', 'afrobeats', 'soca', 'reggaeton', 'hip-hop', 'reggae-fusion'];
  const countries = ['all', 'jamaica', 'nigeria', 'ghana', 'trinidad', 'uk', 'usa', 'canada', 'barbados'];

  useEffect(() => {
    loadArtists();
  }, []);

  useEffect(() => {
    filterAndSortArtists();
  }, [artists, searchQuery, selectedGenre, selectedCountry, sortBy, sortOrder]);

  const loadArtists = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/artists');
      const data = await response.json();
      
      // Add mock stats for demonstration
      const artistsWithStats = data.artists.map((artist: Artist) => ({
        ...artist,
        articleCount: Math.floor(Math.random() * 50) + 1,
        lastArticleDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        totalViews: Math.floor(Math.random() * 10000) + 1000
      }));
      
      setArtists(artistsWithStats);
    } catch (error) {
      console.error('Error loading artists:', error);
      toast.error('Failed to load artists');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortArtists = () => {
    let filtered = artists;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(artist =>
        artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.genres?.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
        artist.birthPlace?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Genre filter
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(artist => artist.genres?.includes(selectedGenre));
    }

    // Country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(artist => artist.birthPlace?.toLowerCase().includes(selectedCountry));
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'followers':
          aValue = a.followers || 0;
          bValue = b.followers || 0;
          break;
        case 'articleCount':
          aValue = a.articleCount || 0;
          bValue = b.articleCount || 0;
          break;
        case 'lastArticle':
          aValue = new Date(a.lastArticleDate || 0).getTime();
          bValue = new Date(b.lastArticleDate || 0).getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredArtists(filtered);
  };

  const handleSelectArtist = (artistId: string) => {
    setSelectedArtists(prev => 
      prev.includes(artistId) 
        ? prev.filter(id => id !== artistId)
        : [...prev, artistId]
    );
  };

  const handleSelectAll = () => {
    if (selectedArtists.length === filteredArtists.length) {
      setSelectedArtists([]);
    } else {
      setSelectedArtists(filteredArtists.map(artist => artist.id));
    }
  };

  const handleDeleteArtist = async (artistId: string) => {
    if (!confirm('Are you sure you want to delete this artist?')) return;

    try {
      const response = await fetch(`/api/artists/${artistId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setArtists(prev => prev.filter(artist => artist.id !== artistId));
        toast.success('Artist deleted successfully');
      } else {
        throw new Error('Failed to delete artist');
      }
    } catch (error) {
      console.error('Error deleting artist:', error);
      toast.error('Failed to delete artist');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedArtists.length} artists?`)) return;

    try {
      const response = await fetch('/api/artists/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedArtists })
      });

      if (response.ok) {
        setArtists(prev => prev.filter(artist => !selectedArtists.includes(artist.id)));
        setSelectedArtists([]);
        toast.success(`${selectedArtists.length} artists deleted successfully`);
      } else {
        throw new Error('Failed to delete artists');
      }
    } catch (error) {
      console.error('Error bulk deleting artists:', error);
      toast.error('Failed to delete artists');
    }
  };

  const handleRefresh = () => {
    loadArtists();
    toast.success('Artists refreshed');
  };

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      jamaica: '🇯🇲',
      nigeria: '🇳🇬',
      ghana: '🇬🇭',
      trinidad: '🇹🇹',
      uk: '🇬🇧',
      usa: '🇺🇸',
      canada: '🇨🇦',
      barbados: '🇧🇧'
    };
    return flags[country] || '🌍';
  };

  const getGenreColor = (genre: string) => {
    const colors: { [key: string]: string } = {
      dancehall: 'bg-red-100 text-red-800',
      reggae: 'bg-green-100 text-green-800',
      afrobeats: 'bg-yellow-100 text-yellow-800',
      soca: 'bg-orange-100 text-orange-800',
      reggaeton: 'bg-purple-100 text-purple-800',
      'hip-hop': 'bg-blue-100 text-blue-800',
      'reggae-fusion': 'bg-indigo-100 text-indigo-800'
    };
    return colors[genre] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-logo-light via-white to-logo-muted p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-soft">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-logo-light via-white to-logo-muted p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Music className="w-8 h-8 text-logo-primary" />
                Artist Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage artist profiles, content, and analytics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="soft-button flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-glamour flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Artist
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="soft-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Artists</p>
                <p className="text-2xl font-bold text-gray-900">{artists.length}</p>
              </div>
              <Users className="w-8 h-8 text-logo-primary" />
            </div>
          </div>
          <div className="soft-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Artists</p>
                <p className="text-2xl font-bold text-gray-900">
                  {artists.filter(a => a.isVerified).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="soft-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {artists.reduce((sum, a) => sum + (a.articleCount || 0), 0)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="soft-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {artists.reduce((sum, a) => sum + (a.totalViews || 0), 0).toLocaleString()}
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-logo-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-logo-primary focus:border-transparent"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? 'All Genres' : genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-logo-primary focus:border-transparent"
              >
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country === 'all' ? 'All Countries' : country.charAt(0).toUpperCase() + country.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as any);
                  setSortOrder(order as any);
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-logo-primary focus:border-transparent"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="followers-desc">Followers High-Low</option>
                <option value="followers-asc">Followers Low-High</option>
                <option value="articleCount-desc">Articles High-Low</option>
                <option value="articleCount-asc">Articles Low-High</option>
                <option value="lastArticle-desc">Recent First</option>
                <option value="lastArticle-asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedArtists.length > 0 && (
          <div className="glass rounded-xl p-4 mb-6 bg-logo-primary/10 border border-logo-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {selectedArtists.length} artist{selectedArtists.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedArtists([])}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <div key={artist.id} className="soft-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedArtists.includes(artist.id)}
                    onChange={() => handleSelectArtist(artist.id)}
                    className="w-4 h-4 text-logo-primary border-gray-300 rounded focus:ring-logo-primary"
                  />
                  <div className="w-12 h-12 bg-gradient-to-br from-logo-primary to-logo-secondary rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {artist.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {artist.isVerified && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  <div className="relative">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{artist.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    {getCountryFlag(artist.birthPlace || '')} {artist.birthPlace}
                  </span>
                  {artist.genres && artist.genres.length > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGenreColor(artist.genres[0])}`}>
                      {artist.genres[0]}
                    </span>
                  )}
                </div>
                {artist.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2">{artist.bio}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{artist.followers?.toLocaleString() || '0'}</p>
                  <p className="text-xs text-gray-500">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{artist.articleCount || 0}</p>
                  <p className="text-xs text-gray-500">Articles</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Last article: {artist.lastArticleDate ? new Date(artist.lastArticleDate).toLocaleDateString() : 'Never'}</span>
                <span>{artist.totalViews?.toLocaleString() || 0} views</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingArtist(artist)}
                  className="flex-1 px-3 py-2 bg-logo-primary text-white rounded-lg hover:bg-logo-secondary transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => window.open(`/artists/${artist.id}`, '_blank')}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteArtist(artist.id)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredArtists.length === 0 && (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No artists found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedGenre !== 'all' || selectedCountry !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Get started by adding your first artist'
              }
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-glamour"
            >
              Add Artist
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMusicPage;
