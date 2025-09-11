/** @type {import('next').NextConfig} */
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({
      enabled: true,
    })
  : (config) => config;

const nextConfig = {
  output: 'standalone',
  outputFileTracing: true,
  trailingSlash: false,
  
  // Optimize imports
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
  
  experimental: {
    workerThreads: false,
    isrMemoryCacheSize: 0,
    optimizeCss: false,
    optimizePackageImports: ['lucide-react'],
    serverComponentsExternalPackages: ['mongodb', 'bcryptjs', 'stripe'],
    
    // Exclude heavy files from function bundles
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
        'node_modules/mongodb/lib/**/*.js',
        'node_modules/mongodb/lib/**/*.d.ts',
        'node_modules/stripe/lib/**/*.js',
        'node_modules/typescript/lib/**/*.d.ts',
        'node_modules/typescript/lib/**/*.js',
      ],
    },
  },
  
  // Disable static generation for error pages
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  
  webpack: (config, { isServer, dev }) => {
    if (isServer && !dev) {
      // Only externalize truly server-side dependencies
      config.externals = config.externals || [];
      config.externals.push({
        // Core server dependencies
        'mongodb': 'commonjs mongodb',
        'stripe': 'commonjs stripe',
        'bcryptjs': 'commonjs bcryptjs',
        '@next-auth/mongodb-adapter': 'commonjs @next-auth/mongodb-adapter',
        
        // Optional: Heavy server-only packages
        'openai': 'commonjs openai',
      });
      
      // Optimize for smaller bundles
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxSize: 200000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Separate server dependencies
            serverDeps: {
              test: /[\\/]node_modules[\\/](mongodb|stripe|bcryptjs|@next-auth)[\\/]/,
              name: 'server-deps',
              chunks: 'all',
              enforce: true,
            },
            // Common vendor chunk
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              chunks: 'all',
              maxSize: 200000,
            },
          },
        },
      };
    }
    
    // Prevent static generation of error pages
    if (isServer) {
      config.plugins = config.plugins || [];
      config.plugins.push(
        new (require('webpack')).DefinePlugin({
          'process.env.NEXT_DISABLE_ERROR_PAGES': JSON.stringify('true'),
        })
      );
      
      // Remove error page entries from webpack
      if (config.entry && typeof config.entry === 'object') {
        delete config.entry['pages/_error'];
        delete config.entry['pages/404'];
        delete config.entry['pages/500'];
      }
    }
    
    // Client-side optimizations
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxSize: 200000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Framework chunk
            framework: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'framework',
              chunks: 'all',
              enforce: true,
            },
            // UI libraries
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|@heroicons)[\\/]/,
              name: 'ui-libs',
              chunks: 'all',
              maxSize: 150000,
            },
            // Other vendor libraries
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              chunks: 'all',
              maxSize: 200000,
            },
          },
        },
      };
    }
    
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);