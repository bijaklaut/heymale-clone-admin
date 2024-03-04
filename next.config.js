/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
      },
      {
        hostname: "127.0.0.1",
      },
      {
        hostname: "sore-lime-rabbit-tutu.cyclic.app",
      },
    ],
  },
};

module.exports = nextConfig;
