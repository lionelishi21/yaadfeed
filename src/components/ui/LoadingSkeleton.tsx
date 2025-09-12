'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
  width?: string;
}

export function Skeleton({ className = "", lines = 3, height = "h-4", width = "w-full" }: SkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`${height} ${width} bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded-lg animate-shimmer`}
          style={{
            backgroundSize: '200% 100%',
          }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      {/* Image skeleton */}
      <div className="aspect-[16/10] bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 animate-shimmer" />
      
      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Title skeleton */}
        <div className="h-6 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded animate-shimmer w-3/4" />
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded animate-shimmer w-full" />
          <div className="h-4 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded animate-shimmer w-5/6" />
          <div className="h-4 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded animate-shimmer w-4/6" />
        </div>
        
        {/* Meta skeleton */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded animate-shimmer w-20" />
          <div className="h-4 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded animate-shimmer w-16" />
        </div>
      </div>
    </div>
  );
}

export function NewsGridSkeleton({ count = 6, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          <CardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

export function ArtistSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center space-x-4">
        {/* Avatar skeleton */}
        <div className="w-16 h-16 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded-full animate-shimmer flex-shrink-0" />
        
        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded animate-shimmer w-3/4" />
          <div className="h-4 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded animate-shimmer w-1/2" />
          <div className="h-4 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded animate-shimmer w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function EventSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        {/* Date skeleton */}
        <div className="w-16 h-16 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded-lg animate-shimmer flex-shrink-0" />
        
        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded animate-shimmer w-3/4" />
          <div className="h-4 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded animate-shimmer w-1/2" />
          <div className="h-4 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded animate-shimmer w-5/6" />
          <div className="h-4 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded animate-shimmer w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-gradient-to-br from-logo-light via-white to-logo-muted py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title skeleton */}
        <div className="space-y-4 mb-8">
          <div className="h-12 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded animate-shimmer w-3/4 mx-auto" />
          <div className="h-8 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded animate-shimmer w-1/2 mx-auto" />
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-3 mb-12">
          <div className="h-6 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded animate-shimmer w-2/3 mx-auto" />
          <div className="h-6 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded animate-shimmer w-1/2 mx-auto" />
        </div>
        
        {/* CTA skeleton */}
        <div className="h-12 bg-gradient-to-r from-logo-primary/10 via-logo-secondary/10 to-logo-primary/10 rounded-lg animate-shimmer w-48 mx-auto" />
      </div>
    </div>
  );
}
