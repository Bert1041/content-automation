import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['react-markdown', 'remark-gfm'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
