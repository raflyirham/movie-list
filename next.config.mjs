/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.theatlantic.com", // TODO: Remove this
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com", // TODO: Remove this
      },
    ],
  },
};

export default nextConfig;
