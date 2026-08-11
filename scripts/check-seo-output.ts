import * as fs from "node:fs";
import { getIndexablePaths } from "../lib/indexable-routes";
import { SITE_URL } from "../app/site";

let errors = 0;
const indexablePaths = getIndexablePaths();

function resolveHtmlFile(routePath: string): string | null {
  const candidates =
    routePath === "/"
      ? ["out/index.html"]
      : [`out${routePath}.html`, `out${routePath}/index.html`];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function readSitemapUrls(): Set<string> {
  const sitemapPath = "out/sitemap.xml";
  if (!fs.existsSync(sitemapPath)) {
    console.error(`MISSING: ${sitemapPath}`);
    errors += 1;
    return new Set();
  }

  const content = fs.readFileSync(sitemapPath, "utf-8");
  const matches = content.matchAll(/<loc>([^<]+)<\/loc>/g);
  return new Set([...matches].map((match) => match[1].trim()));
}

// Tolerant canonical extraction: handles rel/href in either order.
function extractCanonical(html: string): string | null {
  const linkTags = html.matchAll(
    /<link\b[^>]*>/gi,
  );
  for (const link of linkTags) {
    const tag = link[0];
    const rel = /rel\s*=\s*["']\s*canonical\s*["']/i.test(tag);
    if (!rel) continue;
    const hrefMatch = tag.match(/href\s*=\s*["']([^"']+)["']/i);
    if (hrefMatch) {
      return hrefMatch[1];
    }
  }
  return null;
}

function extractDescription(html: string): string {
  const match = html.match(
    /<meta\s+name\s*=\s*["']\s*description\s*["']\s+content\s*=\s*["']([^"']*)["']/i,
  );
  return match ? match[1] : "";
}

function countH1(html: string): number {
  const matches = html.match(/<h1[\s>]/gi);
  return matches ? matches.length : 0;
}

const sitemapUrls = readSitemapUrls();

for (const routePath of indexablePaths) {
  const publicUrl = `${SITE_URL}${routePath}`;
  const htmlFile = resolveHtmlFile(routePath);

  if (!htmlFile) {
    console.error(`MISSING EXPORT: no HTML for indexable route ${routePath}`);
    errors += 1;
    continue;
  }

  if (!sitemapUrls.has(publicUrl)) {
    console.error(`MISSING IN SITEMAP: ${publicUrl} not in out/sitemap.xml`);
    errors += 1;
  }

  const html = fs.readFileSync(htmlFile, "utf-8");
  const canonical = extractCanonical(html);

  if (!canonical) {
    console.error(`MISSING CANONICAL: ${htmlFile} has no rel=canonical link`);
    errors += 1;
  } else if (canonical !== publicUrl) {
    console.error(
      `WRONG CANONICAL: ${htmlFile} canonical "${canonical}" !== "${publicUrl}"`,
    );
    errors += 1;
  }

  const description = extractDescription(html);
  if (!description) {
    console.error(
      `MISSING DESCRIPTION: ${htmlFile} has no meta[name="description"]`,
    );
    errors += 1;
  }

  const h1Count = countH1(html);
  if (h1Count === 0) {
    console.error(`MISSING H1: ${htmlFile} has no <h1>`);
    errors += 1;
  } else if (h1Count > 1) {
    console.error(`MULTIPLE H1: ${htmlFile} has ${h1Count} <h1> elements`);
    errors += 1;
  }
}

if (errors > 0) {
  console.error(`\n${errors} SEO output error(s). Fix before deploying.`);
  process.exit(1);
}

console.log("SEO output check passed.");
