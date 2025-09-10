/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  trailingSlash: false,
  output: 'standalone',
  generateStaticParams: false,
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
  webpack: (config, { isServer, dev }) => {
    if (isServer && !dev) {
      // Exclude large dependencies from serverless functions
      config.externals = config.externals || [];
      config.externals.push({
        'mongodb': 'commonjs mongodb',
        'openai': 'commonjs openai',
        'stripe': 'commonjs stripe',
        'bcryptjs': 'commonjs bcryptjs',
        'axios': 'commonjs axios',
        'dayjs': 'commonjs dayjs',
        'dotenv': 'commonjs dotenv',
        '@next/bundle-analyzer': 'commonjs @next/bundle-analyzer',
        'typescript': 'commonjs typescript',
        'ts-node': 'commonjs ts-node',
        '@heroicons/react': 'commonjs @heroicons/react',
        'lucide-react': 'commonjs lucide-react',
        'motion': 'commonjs motion',
        'react-spinners': 'commonjs react-spinners',
        'react-rough-notation': 'commonjs react-rough-notation',
        'react-hot-toast': 'commonjs react-hot-toast',
        // Keep build-essential dependencies available
        // 'autoprefixer', 'postcss', 'tailwindcss' are needed for build
      });
    }
    
    // Optimize bundle size
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxSize: 244000, // 244KB per chunk
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              chunks: 'all',
              maxSize: 244000,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              maxSize: 244000,
            },
          },
        },
      };
    }
    
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
