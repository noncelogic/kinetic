import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui', '@repo/entities', '@repo/service'],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
