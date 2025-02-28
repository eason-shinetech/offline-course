/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    AUTH_API_HOST: process.env.AUTH_API_HOST,
  },
};

export default nextConfig;
