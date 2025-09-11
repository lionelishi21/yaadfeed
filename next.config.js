/** @type {import('next').NextConfig} */
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({
      enabled: true,
    })
  : (config) => config;

const nextConfig = {
  output: 'standalone',
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
    optimizeCss: false,
    optimizePackageImports: ['lucide-react', 'framer-motion', '@heroicons/react'],
    serverComponentsExternalPackages: ['mongodb', 'bcryptjs', 'stripe'],
    skipTrailingSlashRedirect: true,
    skipMiddlewareUrlNormalize: true,
  },
  // Disable static generation for error pages
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Skip static generation for error pages
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  // Disable static generation for error pages
  generateStaticParams: false,
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
        'clsx': 'commonjs clsx',
        'tailwind-merge': 'commonjs tailwind-merge',
        'tailwindcss-animate': 'commonjs tailwindcss-animate',
        '@radix-ui/react-select': 'commonjs @radix-ui/react-select',
        '@stripe/stripe-js': 'commonjs @stripe/stripe-js',
        '@next-auth/mongodb-adapter': 'commonjs @next-auth/mongodb-adapter',
        // Keep build-essential dependencies available
        // 'autoprefixer', 'postcss', 'tailwindcss' are needed for build
      });
    }
    
    // Disable error page generation to prevent Html import issues
    if (isServer) {
      config.plugins = config.plugins || [];
      config.plugins.push(
        new (require('webpack')).DefinePlugin({
          'process.env.NEXT_RUNTIME': JSON.stringify('nodejs'),
        })
      );
    }
    
    // Removed problematic entry modification
    
    // Optimize bundle size
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxSize: 200000, // 200KB per chunk (reduced from 244KB)
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              chunks: 'all',
              maxSize: 200000,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              maxSize: 200000,
            },
            // Separate chunk for large libraries
            largeLibs: {
              test: /[\\/]node_modules[\\/](mongodb|stripe|bcryptjs|axios)[\\/]/,
              name: 'large-libs',
              chunks: 'all',
              maxSize: 150000,
            },
          },
        },
      };
    }
    
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
