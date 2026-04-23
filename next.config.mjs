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
    // staleTimes: {
    //   dynamic: 180,
    // },
  },
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
