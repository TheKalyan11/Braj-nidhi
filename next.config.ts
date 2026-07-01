import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Creates an optimized bundle for AWS/Docker deployments
  images: {
    formats: ["image/avif", "image/webp"], // AVIF first for best compression, WebP fallback
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920], // Match common mobile + desktop breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Thumbnail & icon sizes
    minimumCacheTTL: 86400, // Cache optimized images for 24 hours
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "blog.yatradham.org",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"], // Reduces initial bundle sizes
  },
};

export default nextConfig;
