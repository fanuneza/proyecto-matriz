import type { NextConfig } from "next";
import { join } from "node:path";

const nextConfig: NextConfig = {
  output: "export",
  turbopack: {
    root: __dirname,
  },
  outputFileTracingRoot: join(__dirname),
};

export default nextConfig;
