import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui', '@repo/entities', '@repo/service'],
  experimental: {
    typedRoutes: true,
  },
  eslint: {
    // Allow builds to complete even with ESLint errors (for development iteration)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
