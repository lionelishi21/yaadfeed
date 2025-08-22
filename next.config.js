/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep trailing slash for consistency
  trailingSlash: true,
  output: 'export',
  
  // Optimize images for SSR (remove unoptimized flag)
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
};

module.exports = nextConfig;