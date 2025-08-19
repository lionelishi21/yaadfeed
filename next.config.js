/** @type {import('next').NextConfig} */
const nextConfig = {
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
    remotePatterns: []
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp']
  },
  
  // SEO optimizations
  poweredByHeader: false,
  generateEtags: false,
  
  // Custom headers for SEO
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
      {
        source: '/news/:slug*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ]
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      // Redirect old ID-based URLs to slug-based URLs if needed
      {
        source: '/news/:id(\\d+)',
        destination: '/news',
        permanent: true,
      },
    ];
  },
  
  // URL rewrites for clean URLs
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
}

module.exports = nextConfig
