import path from "node:path";

import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";
const pagesBasePath = process.env.PAGES_BASE_PATH || (githubPages ? "/gadget-center" : "");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["sequelize", "mysql2"],
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
    unoptimized: githubPages,
  },
  ...(githubPages
    ? {
        output: "export" as const,
        trailingSlash: true,
        basePath: pagesBasePath,
      }
    : {}),
};

export default nextConfig;
