/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    allowedDevOrigins: ["http://localhost:3000", "http://10.0.0.99:5000"], // Povolit domény
  },
};

export default nextConfig;
