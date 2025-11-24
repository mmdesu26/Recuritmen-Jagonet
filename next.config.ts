import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  env: {
    NEXT_PUBLIC_WHATSAPP_HRD: process.env.NEXT_PUBLIC_WHATSAPP_HRD,
  },
};

export default nextConfig;
