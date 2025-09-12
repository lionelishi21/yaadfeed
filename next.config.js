/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: false,
  
  // Completely disable static generation
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
  
  // Force all pages to be dynamic
  generateBuildId: async () => {
    return 'build-' + Date.now();
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
    
    return config;
  },
};

module.exports = nextConfig;