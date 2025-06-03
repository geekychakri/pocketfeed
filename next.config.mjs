/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["geist"],
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
