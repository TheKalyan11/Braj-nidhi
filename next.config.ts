import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Creates an optimized bundle for AWS/Docker deployments
  images: {
    unoptimized: true, // Prevents high CPU/Memory usage on small AWS instances by disabling dynamic image resizing
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"], // Reduces initial bundle sizes
  },
  };

export default nextConfig;
