/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: false,
  
  
  // Optimize imports
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
      preventFullImport: true,
    },
    'react-spinners': {
      transform: 'react-spinners/{{member}}',
      preventFullImport: true,
    },
  },
  
  images: {
    domains: [
      'localhost',
      'i.scdn.co',
      'img.discogs.com',
      'api.dicebear.com',
      'source.unsplash.com',
      'images.unsplash.com',
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Performance optimizations
  productionBrowserSourceMaps: false,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Additional size optimizations
  optimizeFonts: true,
  
  // Force all pages to be dynamic
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },

  // Disable error page generation
  experimental: {
    isrMemoryCacheSize: 0,
    serverComponentsExternalPackages: [
      'mongodb',
      'bcryptjs',
      'axios',
      'dayjs',
      'react-hot-toast',
      'tailwind-merge',
      'tailwindcss-animate'
    ],
  },
  
  webpack: (config, { isServer, dev }) => {
         // Externalize heavy dependencies to reduce bundle size
    if (isServer && !dev) {
      config.externals = config.externals || [];
      config.externals.push({
        'mongodb': 'commonjs mongodb',
        'bcryptjs': 'commonjs bcryptjs',
        'axios': 'commonjs axios',
        'dayjs': 'commonjs dayjs',
             'react-hot-toast': 'commonjs react-hot-toast',
             'tailwind-merge': 'commonjs tailwind-merge',
             'tailwindcss-animate': 'commonjs tailwindcss-animate',
             'framer-motion': 'commonjs framer-motion',
             'react-spinners': 'commonjs react-spinners',
        'lucide-react': 'commonjs lucide-react',
           });
         }
    
    // Optimize bundle splitting
    config.optimization = config.optimization || {};
    config.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
              chunks: 'all',
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
          enforce: true,
        },
      },
    };
    
         // Completely disable error page generation
         if (config.entry && typeof config.entry === 'object') {
           // Remove error page entries completely
           delete config.entry['pages/_error'];
           delete config.entry['pages/404'];
           delete config.entry['pages/500'];
         }

         // Override Next.js error page generation
         config.resolve = config.resolve || {};
         config.resolve.alias = {
           ...config.resolve.alias,
           'next/dist/pages/_error': false,
           'next/dist/pages/404': false,
           'next/dist/pages/500': false,
         };

         // Disable static generation for error pages
         const webpack = require('webpack');
         config.plugins = config.plugins || [];
         config.plugins.push(
           new webpack.DefinePlugin({
             'process.env.NEXT_DISABLE_ERROR_PAGES': JSON.stringify('true'),
             'process.env.NEXT_DISABLE_STATIC_GENERATION': JSON.stringify('true'),
           })
         );

         // Override error page generation completely
         if (config.entry && typeof config.entry === 'object') {
           delete config.entry['pages/_error'];
           delete config.entry['pages/404'];
           delete config.entry['pages/500'];
         }

         // Additional optimizations for Vercel size limit
         config.optimization = config.optimization || {};
         config.optimization.usedExports = true;
         config.optimization.sideEffects = false;
         config.optimization.providedExports = true;
         config.optimization.usedExports = true;
         
         // More aggressive tree shaking
         config.optimization.concatenateModules = true;
         config.optimization.flagIncludedChunks = true;
         config.optimization.removeAvailableModules = true;
         config.optimization.removeEmptyChunks = true;
         config.optimization.mergeDuplicateChunks = true;
         
         // Additional size optimizations
         config.optimization.minimize = true;
         config.optimization.minimizer = config.optimization.minimizer || [];
         
         // Exclude large chunks from being included
         config.optimization.splitChunks = {
           ...config.optimization.splitChunks,
           maxSize: 200000, // 200KB per chunk
           maxAsyncSize: 200000,
           maxInitialSize: 200000,
           cacheGroups: {
             ...config.optimization.splitChunks?.cacheGroups,
             default: {
               minChunks: 2,
               priority: -20,
               reuseExistingChunk: true,
               maxSize: 200000,
             },
             // Separate large libraries
             lucide: {
               test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
               name: 'lucide',
               chunks: 'all',
               priority: 20,
               maxSize: 100000,
             },
             framer: {
               test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
               name: 'framer',
               chunks: 'all',
               priority: 20,
               maxSize: 100000,
             },
           },
         };
         
         // Tree shaking optimizations
         config.resolve = config.resolve || {};
    
    return config;
  },
};

module.exports = nextConfig;