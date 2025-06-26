/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bundle optimization
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["react-icons", "swiper"],
  },

  // Reduce memory usage during build
  webpack: (config, { dev, isServer }) => {
    // Optimize for memory usage
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        maxInitialRequests: 25,
        maxAsyncRequests: 25,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            maxSize: 244000, // 244KB chunks
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            maxSize: 244000,
          },
        },
      };

      // Reduce memory usage
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    return config;
  },

  // Compress responses
  compress: true,

  // Reduce build memory
  generateBuildId: async () => {
    return "build-" + Date.now();
  },
};

export default nextConfig;
