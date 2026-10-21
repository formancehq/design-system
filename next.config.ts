import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/docs/components/attachment',
        destination: '/docs/ai-elements/attachment',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/docs/:path*.md',
        destination: '/docs-md/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/schemas/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
        ],
      },
    ];
  },
};

export default nextConfig;
