/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep trailing slash for consistency
  trailingSlash: true,
  
  // Optimize images
  images: {
    domains: [
      'localhost',
      'i.scdn.co',
      'img.discogs.com',
      'api.dicebear.com',
      'www.jamaica-gleaner.com',
      'www.jamaicaobserver.com',
      'source.unsplash.com',
      'images.unsplash.com'
    ],
    remotePatterns: [],
    // Optimize image formats
    formats: ['image/webp', 'image/avif'],
  },

  // Disable source maps in production
  productionBrowserSourceMaps: false,
  
  // Optimize CSS
  swcMinify: true,
  
  // Reduce bundle size
  compress: true,

  // Disable features to reduce bundle size
  poweredByHeader: false,

  // Experimental features to help with build issues
  experimental: {
    // Disable static generation for problematic pages
    workerThreads: false,
    // Reduce memory usage during build
    isrMemoryCacheSize: 0,
    // Disable static generation for client components
    staticPageGenerationTimeout: 0,
  },
};

module.exports = nextConfig;