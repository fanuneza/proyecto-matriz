import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const textExtensions = new Set([
  ".css",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
]);

function filesIn(directory: string): string[] {
  if (!existsSync(directory)) return [];

  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return filesIn(path);
    return path;
  });
}

function textFilesIn(directory: string) {
  return filesIn(directory).filter((file) => textExtensions.has(extname(file)));
}

describe("source hygiene", () => {
  it("does not load direct GA4 scripts or placeholders", () => {
    const files = [
      ...textFilesIn(join(root, "app")),
      ...textFilesIn(join(root, "components")),
      ...textFilesIn(join(root, "lib")),
      ...textFilesIn(join(root, "public")),
    ];

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      expect(source, relative(root, file)).not.toContain("gtag/js");
      expect(source, relative(root, file)).not.toContain(
        "google-analytics.com/gtag",
      );
      expect(source, relative(root, file)).not.toContain("REPLACE_WITH_");
    }
  });

  it("ships the baseline security headers for Cloudflare Pages", () => {
    const headers = readFileSync(join(root, "public", "_headers"), "utf8");

    expect(headers).toContain("Strict-Transport-Security:");
    expect(headers).toContain("Content-Security-Policy:");
    expect(headers).toContain("X-Frame-Options: DENY");
    expect(headers).toContain("X-Content-Type-Options: nosniff");
    expect(headers).toContain(
      "Referrer-Policy: strict-origin-when-cross-origin",
    );
    expect(headers).toContain("Permissions-Policy:");
    expect(headers).toContain("Cross-Origin-Opener-Policy: same-origin");
    expect(headers).toContain("Cross-Origin-Resource-Policy: same-origin");
    expect(headers).not.toContain("*.");
  });
});
