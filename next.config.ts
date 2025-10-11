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
};

export default nextConfig;
