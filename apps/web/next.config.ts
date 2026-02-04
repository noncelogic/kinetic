import type { NextConfig } from 'next';

const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui', '@repo/entities', '@repo/service'],
  // Fix Prisma query engine bundling for Vercel (rhel-openssl-3.0.x)
  // See: https://pris.ly/d/engine-not-found-nextjs
  serverExternalPackages: ['@prisma/client', '@repo/database'],
  experimental: {
    typedRoutes: true,
  },
  eslint: {
    // Allow builds to complete even with ESLint errors (for development iteration)
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
};

export default nextConfig;
