/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: false,
  
  // Completely disable static generation
  experimental: {
    isrMemoryCacheSize: 0,
    serverComponentsExternalPackages: ['mongodb', 'bcryptjs', 'stripe'],
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
    // Only externalize essential server-side dependencies
    if (isServer && !dev) {
      config.externals = config.externals || [];
      config.externals.push({
        'mongodb': 'commonjs mongodb',
        'stripe': 'commonjs stripe',
        'bcryptjs': 'commonjs bcryptjs',
      });
    }
    
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