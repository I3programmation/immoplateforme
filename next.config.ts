import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        "@": path.resolve(__dirname, "."),
        // Add other aliases here if needed
      },
    },
  },
};

export default nextConfig;
