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
};
module.exports = nextConfig;
