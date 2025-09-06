/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  trailingSlash: true,
  images: {
    domains: [
      'localhost',
      'i.scdn.co',
      'img.discogs.com',
      'api.dicebear.com',
      'www.jamaica-gleaner.com',
      'www.jamaicaobserver.com',
      'source.unsplash.com',
      'images.unsplash.com',
    ],
    remotePatterns: [],
    formats: ['image/webp', 'image/avif'],
  },
  productionBrowserSourceMaps: false,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  experimental: {
    workerThreads: false,
    isrMemoryCacheSize: 0,
    staticPageGenerationTimeout: 0,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
