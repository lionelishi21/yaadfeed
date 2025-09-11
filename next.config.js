/** @type {import('next').NextConfig} */
// Temporarily disable bundle analyzer to test for stack overflow
const withBundleAnalyzer = (config) => config;

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
    // Simplified webpack config to avoid stack overflow
    if (isServer && !dev) {
      // Only externalize essential server-side dependencies
      config.externals = config.externals || [];
      config.externals.push({
        'mongodb': 'commonjs mongodb',
        'stripe': 'commonjs stripe',
        'bcryptjs': 'commonjs bcryptjs',
      });
    }
    
    return config;
  },
};
module.exports = withBundleAnalyzer(nextConfig);