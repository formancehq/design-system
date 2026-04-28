import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/docs/:path*.md',
        destination: '/docs-md/:path*',
      },
    ];
  },
};

export default nextConfig;
