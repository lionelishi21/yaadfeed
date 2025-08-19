'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Zap, RefreshCw, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ImageSelectorProps {
  title: string;
  category: string;
  keywords?: string[];
  summary?: string;
  currentImageUrl?: string;
  onImageSelected: (imageUrl: string) => void;
  className?: string;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  title,
  category,
  keywords = [],
  summary = '',
  currentImageUrl,
  onImageSelected,
  className = ''
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateNewImage = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          category,
          keywords,
          summary,
          forceGenerate: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const result = await response.json();
      
      if (result.success) {
        setGeneratedImageUrl(result.imageUrl);
        onImageSelected(result.imageUrl);
      } else {
        throw new Error(result.error || 'Failed to generate image');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
      console.error('Image generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectExistingImage = () => {
    if (currentImageUrl) {
      onImageSelected(currentImageUrl);
    }
  };

  const getFallbackImage = async (category: string): Promise<string> => {
    try {
      // Try to generate an AI image for the fallback
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Jamaica ${category}`,
          category,
          keywords: getCategoryKeywords(category),
          summary: '',
          forceGenerate: true
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          return result.imageUrl;
        }
      }
    } catch (error) {
      console.error('AI fallback generation failed:', error);
    }
    
    // Use local placeholder as fallback
    return `/images/placeholder-${category}.jpg`;
  };

  // Helper function to get category keywords
  const getCategoryKeywords = (category: string): string[] => {
    const categoryMap: { [key: string]: string[] } = {
      'sports': ['sports', 'jamaica', 'athletic', 'competition'],
      'politics': ['government', 'building', 'professional', 'jamaica'],
      'business': ['business', 'office', 'success', 'jamaica'],
      'entertainment': ['party', 'celebration', 'fun', 'jamaica'],
      'health': ['health', 'medical', 'wellness', 'jamaica'],
      'education': ['education', 'school', 'learning', 'jamaica'],
      'culture': ['culture', 'art', 'heritage', 'jamaica'],
      'music': ['music', 'reggae', 'jamaica', 'dancehall'],
      'dancehall': ['dancehall', 'music', 'jamaica', 'reggae'],
      'general': ['jamaica', 'tropical', 'caribbean', 'island']
    };

    return categoryMap[category.toLowerCase()] || categoryMap['general'];
  };

  const [displayImageUrl, setDisplayImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDisplayImage = async () => {
      try {
        setLoading(true);
        const url = generatedImageUrl || currentImageUrl || await getFallbackImage(category);
        setDisplayImageUrl(url);
      } catch (error) {
        console.error('Error loading display image:', error);
        setDisplayImageUrl(`/images/placeholder-${category}.jpg`);
      } finally {
        setLoading(false);
      }
    };

    loadDisplayImage();
  }, [generatedImageUrl, currentImageUrl, category]);

  const hasLocalImage = currentImageUrl?.startsWith('/images/generated/');
  const hasGeneratedImage = generatedImageUrl?.startsWith('/images/generated/');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image Display */}
      <div className="relative group">
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full bg-gray-200">
              <RefreshCw className="w-10 h-10 animate-spin text-green-500" />
            </div>
          ) : (
            <Image
              src={displayImageUrl || ''}
              alt={title}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `/images/placeholder-${category}.jpg`;
              }}
            />
          )}
          
          {/* Image Status Overlay */}
          <div className="absolute top-2 right-2 flex space-x-2">
            {hasLocalImage && (
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Local</span>
              </div>
            )}
            {hasGeneratedImage && (
              <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>AI Generated</span>
              </div>
            )}
            {!hasLocalImage && !hasGeneratedImage && (
              <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>Fallback</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          onClick={selectExistingImage}
          variant="outline"
          disabled={!currentImageUrl}
          className="flex-1"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Use Current Image
        </Button>
        
        <Button
          onClick={generateNewImage}
          disabled={isGenerating}
          loading={isGenerating}
          className="flex-1"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Generate AI Image
            </>
          )}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• AI images are generated using DALL-E and saved locally</p>
        <p>• Music and featured articles get priority for AI generation</p>
        <p>• Generated images are stored forever (one-time cost)</p>
      </div>
    </div>
  );
};

export default ImageSelector; 