'use client';

import React, { useState, useEffect } from 'react';
import { Play, RefreshCw, BarChart3, Clock, Users, Music, AlertCircle, CheckCircle } from 'lucide-react';

interface ScraperStats {
  totalSpotlights: number;
  lastScrapeTime: Date | null;
  nextScrapeTime: Date | null;
  monitoredArtists: number;
}

export default function ScraperAdminPage() {
  const [stats, setStats] = useState<ScraperStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastScrapeResult, setLastScrapeResult] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/artist-spotlights?action=stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const runScraper = async (force = false) => {
    setLoading(true);
    try {
      const action = force ? 'force-scrape' : 'scrape';
      const response = await fetch(`/api/artist-spotlights?action=${action}`);
      const data = await response.json();
      
      if (data.success) {
        setLastScrapeResult(data.data);
        await loadStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error running scraper:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  };

  const getTimeUntilNext = (nextScrapeTime: Date | null) => {
    if (!nextScrapeTime) return 'Unknown';
    const now = new Date();
    const diff = new Date(nextScrapeTime).getTime() - now.getTime();
    
    if (diff <= 0) return 'Ready to run';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days, ${hours} hours`;
    return `${hours} hours`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Artist Spotlight Scraper</h1>
          <p className="text-gray-600">Manage and monitor the weekly artist spotlight scraper</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Music className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spotlights</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSpotlights}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monitored Artists</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.monitoredArtists}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Last Scrape</p>
                  <p className="text-sm font-bold text-gray-900">{formatDate(stats.lastScrapeTime)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Next Scrape</p>
                  <p className="text-sm font-bold text-gray-900">{getTimeUntilNext(stats.nextScrapeTime)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Scraper Controls</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => runScraper(false)}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Run Weekly Scraper
              </button>

              <button
                onClick={() => runScraper(true)}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Force Scrape Now
              </button>

              <button
                onClick={loadStats}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Refresh Stats
              </button>
            </div>
          </div>
        </div>

        {/* Last Scrape Result */}
        {lastScrapeResult && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Last Scrape Result</h2>
            </div>
            <div className="p-6">
              {Array.isArray(lastScrapeResult) ? (
                <div>
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      Found {lastScrapeResult.length} new releases
                    </span>
                  </div>
                  <div className="space-y-2">
                    {lastScrapeResult.map((release: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{release.artistName}</p>
                          <p className="text-sm text-gray-600">"{release.songTitle}"</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {release.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-600">No new releases found</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Information Panel */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">How It Works</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• The scraper runs automatically every Sunday at midnight</p>
            <p>• It monitors {stats?.monitoredArtists || 20} Jamaican artists for new releases</p>
            <p>• New releases are automatically added to the artist spotlight section</p>
            <p>• You can manually trigger a scrape using the controls above</p>
            <p>• The scraper checks Spotify, YouTube, and social media for new content</p>
          </div>
        </div>
      </div>
    </div>
  );
}
