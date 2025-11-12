import type { NextConfig } from "next";

export const experimental = {
  proxyTimeout: 2000,
};

const nextConfig: NextConfig = {
  experimental: {
    proxyTimeout: 2000,
  },
};

export default nextConfig;
