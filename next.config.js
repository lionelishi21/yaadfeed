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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://*.googletagmanager.com https://*.google-analytics.com https://vercel.live https://cmp.gatekeeperconsent.com https://the.gatekeeperconsent.com https://*.gatekeeperconsent.com https://www.ezojs.com https://*.ezojs.com https://ezoicanalytics.com https://*.ezoicanalytics.com https://*.ezoic.net https://*.ezoic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https: http: https://*.google-analytics.com https://*.googletagmanager.com https://*.gatekeeperconsent.com https://*.ezojs.com https://*.ezoicanalytics.com https://*.ezoic.net https://*.ezoic.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://region1.google-analytics.com https://region2.google-analytics.com https://stats.g.doubleclick.net https://vercel.live https://cmp.gatekeeperconsent.com https://the.gatekeeperconsent.com https://*.gatekeeperconsent.com https://www.ezojs.com https://*.ezojs.com https://ezoicanalytics.com https://*.ezoicanalytics.com https://*.ezoic.net https://*.ezoic.com https://srv.adstxtmanager.com; frame-src 'self' https://googleads.g.doubleclick.net https://vercel.live https://*.gatekeeperconsent.com https://*.ezojs.com https://*.ezoic.net https://*.ezoic.com;"
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
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
  },
});

module.exports = withPWA(nextConfig);
