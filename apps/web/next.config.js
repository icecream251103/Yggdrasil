/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'modelviewer.dev',
      },
    ],
  },
  transpilePackages: ['@google/model-viewer'],
  webpack: (config, { dev }) => {
    // Avoid using eval in development to satisfy strict CSP without 'unsafe-eval'
    if (dev) {
      config.devtool = 'source-map';
    }
    return config;
  },
};

module.exports = nextConfig;
