import { describe, it, expect } from "vitest";
import { buildPageMetadata, siteSchema } from "@/app/seo";
import { getIndexablePaths, getIndexableRoutes } from "@/lib/indexable-routes";
import { listSnapshots } from "@/lib/snapshots";
import { SITE_URL } from "@/app/site";
import sitemap from "@/app/sitemap";

describe("buildPageMetadata", () => {
  it("builds an absolute canonical for a nested path", () => {
    const metadata = buildPageMetadata({
      title: "Antofagasta | Energías renovables",
      description: "Ficha regional.",
      path: "/regiones/antofagasta",
    });

    expect(metadata.alternates!.canonical).toBe(
      "https://matriz.fnunez.cl/regiones/antofagasta",
    );
    expect(metadata.openGraph!.url).toBe(
      "https://matriz.fnunez.cl/regiones/antofagasta",
    );
    expect(metadata.openGraph!.title).toBe("Antofagasta | Energías renovables");
    expect((metadata.twitter as { card?: string }).card).toBe(
      "summary_large_image",
    );
  });

  it("defaults path to / and produces the home canonical", () => {
    const metadata = buildPageMetadata({
      title: "Inicio",
      description: "Portada.",
    });

    expect(metadata.alternates!.canonical).toBe("https://matriz.fnunez.cl/");
  });
});

describe("siteSchema", () => {
  it("declares WebSite and Organization with stable @id", () => {
    expect(siteSchema["@context"]).toBe("https://schema.org");
    const website = siteSchema["@graph"].find(
      (entry) => entry["@type"] === "WebSite",
    );
    const organization = siteSchema["@graph"].find(
      (entry) => entry["@type"] === "Organization",
    );

    expect(website?.["@id"]).toBe(`${SITE_URL}/#website`);
    expect(organization?.["@id"]).toBe(`${SITE_URL}/#organization`);
  });
});

describe("getIndexableRoutes", () => {
  it("includes fixed, region, technology and snapshot routes without duplicates", () => {
    const paths = getIndexablePaths();

    for (const fixed of [
      "/",
      "/datos",
      "/regiones",
      "/tecnologias",
      "/comparar",
      "/archivo",
    ]) {
      expect(paths).toContain(fixed);
    }

    expect(paths).toContain("/regiones/antofagasta");
    expect(paths).toContain("/tecnologias/solar");

    expect(new Set(paths).size).toBe(paths.length);

    for (const path of paths) {
      expect(path.startsWith("/")).toBe(true);
    }
  });

  it("exposes a snapshot route per published snapshot", () => {
    const paths = getIndexablePaths();
    const snapshotPaths = listSnapshots().map((m) => `/archivo/${m}`);

    for (const snapshotPath of snapshotPaths) {
      expect(paths).toContain(snapshotPath);
    }
  });

  it("returns routes with valid changeFrequency and priority", () => {
    for (const route of getIndexableRoutes()) {
      expect(["weekly", "monthly"]).toContain(route.changeFrequency);
      expect(route.priority).toBeGreaterThan(0);
      expect(route.priority).toBeLessThanOrEqual(1);
    }
  });
});

describe("sitemap", () => {
  it("emits an absolute URL for every indexable path and no extras", () => {
    const entries = sitemap();
    const indexablePaths = getIndexablePaths();
    const expectedUrls = new Set(
      indexablePaths.map((p) => `${SITE_URL}${p}`),
    );
    const sitemapUrls = entries.map((entry) => entry.url);

    for (const expected of expectedUrls) {
      expect(sitemapUrls).toContain(expected);
    }

    for (const entry of entries) {
      expect(entry.url.startsWith(SITE_URL)).toBe(true);
    }

    expect(entries).toHaveLength(indexablePaths.length);
  });

  it("uses the snapshot generatedAt for archive routes when available", () => {
    const entries = sitemap();
    const months = listSnapshots();

    for (const month of months) {
      const entry = entries.find((e) => e.url === `${SITE_URL}/archivo/${month}`);
      expect(entry).toBeDefined();
    }
  });
});
