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
    globalNotFound: true,

    // staleTimes: {
    //   dynamic: 180,
    // },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
