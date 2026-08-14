console.log("=== BUILD DIAGNOSTICS ===");
console.log("MONGODB_URI present:", !!process.env.MONGODB_URI);
console.log("NEXTAUTH_SECRET present:", !!process.env.NEXTAUTH_SECRET);
console.log("=========================");

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  serverExternalPackages: ['mongoose', 'mongodb', 'sharp'],
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/platform/admin/dashboard',
        permanent: false,
      },
      {
        source: '/admin/articles',
        destination: '/platform/admin/articles',
        permanent: false,
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://*.googletagmanager.com https://*.google-analytics.com https://vercel.live; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https: http: https://*.google-analytics.com https://*.googletagmanager.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://region1.google-analytics.com https://region2.google-analytics.com https://stats.g.doubleclick.net https://vercel.live; frame-src 'self' https://googleads.g.doubleclick.net https://vercel.live;"
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ]
      }
    ];
  }
};
module.exports = nextConfig;
