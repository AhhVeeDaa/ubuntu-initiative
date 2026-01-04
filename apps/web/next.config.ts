import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@ai-sdk/react', '@ai-sdk/google', 'ai'],
};

export default nextConfig;
