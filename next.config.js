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
  typescript: { ignoreBuildErrors: true },
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'mongodb', 'sharp'],
  },
};
module.exports = nextConfig;
