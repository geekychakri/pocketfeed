/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["geist"],
  cacheComponents: true,
  devIndicators: {
    position: "bottom-left",
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
