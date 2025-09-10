/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  trailingSlash: false,
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
      preventFullImport: true,
    },
  },
  images: {
    domains: [
      'localhost',
      'i.scdn.co',
      'img.discogs.com',
      'api.dicebear.com',
      'www.jamaica-gleaner.com',
      'www.jamaicaobserver.com',
      'jamaica-gleaner.com',
      'jamaicaobserver.com',
      'www.dancehallmag.com',
      'dancehallmag.com',
      'www.reggaeville.com',
      'reggaeville.com',
      'urbanislandz.com',
      'www.urbanislandz.com',
      'jamaica.loopnews.com',
      'tt.loopnews.com',
      'www.trinidadexpress.com',
      'trinidadexpress.com',
      'www.caribbeanlifenews.com',
      'caribbeanlifenews.com',
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
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      const externals = config.externals || [];
      config.externals = externals.concat([
        'mongodb',
        'openai',
        'stripe',
      ]);
    }
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
