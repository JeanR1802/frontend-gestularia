/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  // Forzar que los assets se sirvan desde el dominio principal
  assetPrefix: process.env.NODE_ENV === "production" ? "https://gestularia.com" : "",
};

module.exports = nextConfig;
