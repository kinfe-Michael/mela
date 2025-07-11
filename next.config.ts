import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'mela-s3-storage.s3.eu-north-1.amazonaws.com',
      // Add any other image hostnames here if you have them
      'placehold.co', // For your placeholder images
    ],
  },
  /* config options here */
};

export default nextConfig;
