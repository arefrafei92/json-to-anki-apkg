import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["anki-apkg-export"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
