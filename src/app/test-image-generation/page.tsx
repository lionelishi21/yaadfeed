'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import ImageSelector from '@/components/ImageSelector';

export default function TestImageGeneration() {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');

  const handleImageSelected = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    console.log('Selected image:', imageUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Image Generation Test</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Article</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">Title: "Vybz Kartel Releases New Dancehall Anthem"</p>
              <p className="text-sm text-gray-600">Category: music</p>
              <p className="text-sm text-gray-600">Keywords: ["vybz kartel", "dancehall", "music"]</p>
            </div>
          </div>

          <ImageSelector
            title="Vybz Kartel Releases New Dancehall Anthem"
            category="music"
            keywords={["vybz kartel", "dancehall", "music"]}
            summary="Jamaican dancehall artist Vybz Kartel has released a new track that's taking the Caribbean by storm."
            onImageSelected={handleImageSelected}
          />

          {selectedImageUrl && (
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Selected Image URL:</h3>
              <p className="text-sm text-green-700 break-all">{selectedImageUrl}</p>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">How it works:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Click "Use Current Image" to select the existing image (if available)</li>
              <li>• Click "Generate AI Image" to create a new DALL-E image</li>
              <li>• The image will be generated and saved locally</li>
              <li>• You can see the image status indicators (Local, AI Generated, Fallback)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 