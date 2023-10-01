/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["api.mapbox.com"],
  },
};

module.exports = nextConfig;
