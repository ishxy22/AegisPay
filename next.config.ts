import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warnings should not abort production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
