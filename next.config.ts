import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  // Enable static export only when STATIC_EXPORT=true
  ...(isStaticExport && { output: "export" }),
  
  // Disable image optimization for static export compatibility
  images: {
    unoptimized: true,
  },
  
  // For GitHub Pages deployment with a repo name subdirectory
  basePath: "/chatbots-with-api",
  assetPrefix: "/chatbots-with-api/",
  
  // Trailing slash for better static hosting compatibility
  trailingSlash: true,
};

export default nextConfig;
