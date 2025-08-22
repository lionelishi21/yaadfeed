/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export only for production builds
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
  }),
  
  // Optimize images for static export
  images: {
    unoptimized: process.env.NODE_ENV === 'production',
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
};

module.exports = nextConfig;
