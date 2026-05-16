import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import { join } from "node:path";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: __dirname,
  },
  outputFileTracingRoot: join(__dirname),
};

export default withBundleAnalyzer(nextConfig);
