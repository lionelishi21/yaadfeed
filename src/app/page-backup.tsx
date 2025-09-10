'use client';

import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Yaad<span className="text-blue-600">Feed</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Jamaica's Premier News & Music Platform
        </p>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Homepage is Working!</h2>
          <p className="text-gray-600">
            If you can see this, the basic Next.js app is working.
            The issue was with the complex homepage code.
          </p>
        </div>
      </div>
    </div>
  );
}
