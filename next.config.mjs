/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["geist"],
  cacheComponents: true,
  typedRoutes: true,
  devIndicators: {
    position: "bottom-left",
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    typedEnv: true,
  },
};

export default nextConfig;
