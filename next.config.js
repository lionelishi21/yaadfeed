/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export only for production builds
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
  }),
  
  // Optimize images for static export
  images: {
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
      formats: ['image/webp', 'image/avif'],
    },
    productionBrowserSourceMaps: false,
    swcMinify: true,
    compress: true,
    poweredByHeader: false,
  };

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
