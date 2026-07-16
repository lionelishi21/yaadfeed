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
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};
module.exports = nextConfig;
