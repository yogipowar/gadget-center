import path from "node:path";

import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";
const rawBasePath = process.env.PAGES_BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || "";
const pagesBasePath = githubPages
  ? rawBasePath && rawBasePath !== "/"
    ? rawBasePath
    : "/gadget-center"
  : "";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_BASE_PATH: pagesBasePath,
  },
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
