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
      {
        hostname:
          "cyclic-sore-lime-rabbit-tutu-us-west-1.s3.us-west-1.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
