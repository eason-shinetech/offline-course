/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    AUTH_API_HOST: process.env.AUTH_API_HOST,
  },
};

export default nextConfig;
