'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PreloaderProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export default function Preloader({ isLoading, children }: PreloaderProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-logo-light via-white to-logo-muted">
      <div className="text-center">
        {/* Logo/Title Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-black text-logo-dark mb-2">
            Yaad<span className="text-logo-primary">Feed</span>
          </h1>
          <p className="text-lg text-gray-600">Jamaica's Premier News & Music Platform</p>
        </motion.div>

        {/* Loading Logo GIF */}
        <div className="relative mb-8">
          <img
            src="/logo.gif"
            alt="Loading YaadFeed"
            className="h-20 w-20 mx-auto rounded-full object-contain"
          />
        </div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-2"
        >
          <p className="text-logo-primary font-semibold text-lg">Loading...</p>
          <p className="text-gray-500 text-sm">Connecting to Jamaica's finest content</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 2, ease: "easeOut" }}
          className="mt-8 h-2 bg-logo-primary/20 rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 2, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-logo-primary to-logo-secondary rounded-full"
          />
        </motion.div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
              className="w-3 h-3 bg-logo-primary rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Compact Preloader for smaller components
export function CompactPreloader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-3 border-logo-primary/20 border-t-logo-primary rounded-full mx-auto mb-3"
        />
        <p className="text-logo-primary text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}

// Skeleton Preloader for content
export function SkeletonPreloader({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-4">
        <div className="h-4 bg-logo-primary/10 rounded w-3/4"></div>
        <div className="h-4 bg-logo-primary/10 rounded w-1/2"></div>
        <div className="h-4 bg-logo-primary/10 rounded w-5/6"></div>
      </div>
    </div>
  );
}
