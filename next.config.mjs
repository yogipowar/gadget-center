import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const githubPages = process.env.GITHUB_PAGES === "true";
const rawBasePath = process.env.PAGES_BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || "";
const pagesBasePath = githubPages
  ? rawBasePath && rawBasePath !== "/"
    ? rawBasePath
    : "/gadget-center"
  : "";

/** @type {import("next").NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_BASE_PATH: pagesBasePath,
  },
  serverExternalPackages: ["sequelize", "mysql2"],
  outputFileTracingIncludes: {
    "/*": ["./node_modules/mysql2/**/*", "./node_modules/sequelize/**/*"],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    proxyClientMaxBodySize: "8mb",
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
    unoptimized: githubPages,
  },
  ...(githubPages
    ? {
        output: "export",
        trailingSlash: true,
        basePath: pagesBasePath,
      }
    : {
        output: "standalone",
      }),
};

export default nextConfig;
