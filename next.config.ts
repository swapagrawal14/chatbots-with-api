import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  // Enable static export only when STATIC_EXPORT=true
  ...(isStaticExport && { output: "export" }),
  
  // Disable image optimization for static export compatibility
  images: {
    unoptimized: true,
  },
  
  // Set basePath via env var for GitHub Pages, leave empty for Vercel
  ...(process.env.BASE_PATH && { basePath: process.env.BASE_PATH }),
  ...(process.env.ASSET_PREFIX && { assetPrefix: process.env.ASSET_PREFIX }),
  
  // Trailing slash for better static hosting compatibility
  trailingSlash: true,
};

export default nextConfig;
