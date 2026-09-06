import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Pin the project root. Without it, Next walks up looking for a lockfile and
  // can settle on a parent directory that holds other projects.
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd()

  // Product images are rendered with a plain <img> and the srcset the SDK
  // builds from Sokko's stored renditions, so no image host needs allowing
  // here. If you switch to next/image, add Sokko's host to images.remotePatterns.
};

export default nextConfig;
