import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is static demo data, so the app ships as plain files (Netlify serves out/).
  output: "export",
  trailingSlash: true,
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
