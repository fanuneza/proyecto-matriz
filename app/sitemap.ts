import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { getIndexableRoutes } from "@/lib/indexable-routes";
import { readSnapshot } from "@/lib/snapshots";
import { SITE_URL } from "./site";

export const dynamic = "force-static";

function readCurrentDataLastModified() {
  const metadataPath = path.join(
    process.cwd(),
    "public/data/current/metadata.json",
  );

  if (!fs.existsSync(metadataPath)) {
    return new Date();
  }

  const raw = JSON.parse(fs.readFileSync(metadataPath, "utf-8")) as {
    generatedAt?: string;
  };
  return raw.generatedAt ? new Date(raw.generatedAt) : new Date();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDataLastModified = readCurrentDataLastModified();

  return getIndexableRoutes().map((route) => {
    let lastModified = currentDataLastModified;

    if (route.path.startsWith("/archivo/")) {
      const month = route.path.slice("/archivo/".length);
      const snapshot = readSnapshot(month);
      if (snapshot?.generatedAt) {
        lastModified = new Date(snapshot.generatedAt);
      }
    }

    return {
      url: `${SITE_URL}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    };
  });
}
