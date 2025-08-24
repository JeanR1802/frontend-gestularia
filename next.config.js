/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  // --- Configuración para subdominios ---
  assetPrefix: isProd ? "https://gestularia.com" : "",
  // Opcional: para que Next.js genere correctamente rutas relativas en build
  basePath: "",
};

module.exports = nextConfig;
