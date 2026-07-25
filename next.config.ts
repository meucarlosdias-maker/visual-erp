import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      '@tanstack/react-table',
    ],
  },
  serverExternalPackages: ['pino'],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
