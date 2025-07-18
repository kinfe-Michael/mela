import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'mela-s3-storage.s3.eu-north-1.amazonaws.com',
      'placehold.co',
    ],
  },
};

export default nextConfig;
