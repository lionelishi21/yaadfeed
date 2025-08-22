/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export only for production builds
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
  }),
  
  // Optimize bundle size
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
    // Disable static generation
    isrMemoryCacheSize: 0,
    // Force dynamic rendering
    workerThreads: false,
    // Optimize bundle
    optimizePackageImports: ['@heroicons/react', 'lucide-react'],
    // Reduce bundle size
    bundlePagesExternals: true,
    // Disable features that increase bundle size
    optimizeCss: true,
  },
  
  // Optimize images for static export
  images: {
    unoptimized: process.env.NODE_ENV === 'production',
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

  // Optimize webpack
  webpack: (config, { isServer, dev }) => {
    // Reduce bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        buffer: false,
        util: false,
        querystring: false,
        punycode: false,
        domain: false,
        dns: false,
        dgram: false,
        cluster: false,
        child_process: false,
        worker_threads: false,
        vm: false,
        inspector: false,
        async_hooks: false,
        events: false,
        string_decoder: false,
        timers: false,
        tty: false,
        readline: false,
        repl: false,
        v8: false,
        perf_hooks: false,
        trace_events: false,
        wasi: false,
      };
    }

    // Tree shake unused code
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
      // Split chunks more aggressively
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // Common chunk
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
      // Remove unused modules
      minimize: !dev,
    };

    return config;
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
