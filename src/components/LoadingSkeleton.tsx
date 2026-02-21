'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  height = 'h-4', 
  width = 'w-full', 
  rounded = true 
}) => (
  <div 
    className={`bg-gray-200 animate-pulse ${height} ${width} ${rounded ? 'rounded' : ''} ${className}`}
  />
);

export const NewsCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-soft overflow-hidden">
    <Skeleton height="h-48" className="w-full" />
    <div className="p-6 space-y-3">
      <Skeleton height="h-4" width="w-1/4" />
      <Skeleton height="h-6" width="w-3/4" />
      <Skeleton height="h-4" width="w-full" />
      <Skeleton height="h-4" width="w-2/3" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton height="h-4" width="w-1/3" />
        <Skeleton height="h-8" width="w-24" />
      </div>
    </div>
  </div>
);

export const ArtistCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-soft p-6">
    <div className="flex items-center space-x-4">
      <Skeleton height="h-16" width="w-16" className="rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton height="h-5" width="w-3/4" />
        <Skeleton height="h-4" width="w-1/2" />
        <Skeleton height="h-3" width="w-1/3" />
      </div>
    </div>
  </div>
);

export const HomePageSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-logo-light via-white to-logo-muted">
    {/* Header Skeleton */}
    <div className="bg-gradient-to-br from-logo-dark via-logo-primary to-logo-secondary text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <Skeleton height="h-12" width="w-64" className="mx-auto bg-white/20" />
          <Skeleton height="h-8" width="w-96" className="mx-auto bg-white/20" />
          <Skeleton height="h-6" width="w-80" className="mx-auto bg-white/20" />
        </div>
      </div>
    </div>

    {/* Featured News Skeleton */}
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Skeleton height="h-8" width="w-48" className="mx-auto mb-4" />
          <Skeleton height="h-4" width="w-64" className="mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>

    {/* Artists Skeleton */}
    <section className="py-16 bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Skeleton height="h-8" width="w-48" className="mx-auto mb-4" />
          <Skeleton height="h-4" width="w-64" className="mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <ArtistCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default HomePageSkeleton;
