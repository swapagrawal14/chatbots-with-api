import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages
  output: "export",

  // Disable image optimization for static export compatibility
  images: {
    unoptimized: true,
  },

  // GitHub Pages deployment at https://swapagrawal14.github.io/chatbots-with-api/
  basePath: "/chatbots-with-api",
  assetPrefix: "/chatbots-with-api/",

  // Trailing slash for better static hosting compatibility
  trailingSlash: true,
};

export default nextConfig;
