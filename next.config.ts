import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import { join } from "node:path";

if (process.env.NODE_ENV === "production") {
  const probe = (name: string) => {
    const value = process.env[name];
    return value ? `set (len=${value.trim().length})` : "MISSING";
  };
  console.log(
    `[build-env] NEXT_PUBLIC_GTM_ID: ${probe("NEXT_PUBLIC_GTM_ID")} · CNE_API_EMAIL: ${probe("CNE_API_EMAIL")}`,
  );
}

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
