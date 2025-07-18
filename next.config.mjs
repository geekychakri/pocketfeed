/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["geist"],
  devIndicators: {
    position: "bottom-left",
  },
};

export default nextConfig;
