let userConfig = undefined;
try {
  userConfig = await import("./v0-user-next.config.mjs");
} catch (e) {
  try {
    userConfig = await import("./v0-user-next.config");
  } catch (innerError) {
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    // Added canvas and konva to external packages
    serverComponentsExternalPackages: ["canvas", "konva"],
    esmExternals: "loose",
  },
  webpack: (config, { isServer }) => {
    // Exclude canvas from client-side bundles
    config.externals = [...(config.externals || []), { canvas: "canvas" }];

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
      };
    }

    // Add performance hints for better debugging
    config.performance = {
      ...config.performance,
      hints: "warning",
      maxAssetSize: 500000,
      maxEntrypointSize: 500000,
    };

    return config;
  },
  // Added production browser source maps
  productionBrowserSourceMaps: true,
  // Enable SWC minification
  swcMinify: true,
  // Configure build output
  output: "standalone",
};

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig;

  // Deep merge for specific configuration sections
  const deepMergeKeys = ["experimental", "webpack", "images"];

  for (const key in config) {
    if (
      deepMergeKeys.includes(key) &&
      typeof nextConfig[key] === "object" &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      };
    } else {
      nextConfig[key] = config[key];
    }
  }
}

export default nextConfig;
