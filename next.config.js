/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent Next from "guessing" a higher workspace root
  outputFileTracingRoot: __dirname,

  // Temporarily unblock builds (turn off once stable)
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Keep image domains simple for now; you can re-add later
  images: { domains: [] },

  // Explicit webpack configuration for module resolution
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Ensure proper module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    
    return config;
  },
};
module.exports = nextConfig;
