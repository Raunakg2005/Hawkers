import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // self-contained server bundle for the Docker image (see Dockerfile)
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default nextConfig;
