import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ✅ Ignore type errors in production build
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Ignore lint errors in production build
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,

  // ✅ Helps prevent SSR context/useContext issues
  experimental: {
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // ✅ Keeps your build server-friendly
  output: 'standalone',
};

module.exports = nextConfig;