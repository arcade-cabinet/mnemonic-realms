import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Allow production builds even if there are type errors (for now)
    ignoreBuildErrors: false,
  },
  eslint: {
    // We're using Biome instead
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
