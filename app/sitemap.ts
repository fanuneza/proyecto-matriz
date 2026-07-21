import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { REGION_SLUGS } from "@/lib/regions";
import { listSnapshots, readSnapshot } from "@/lib/snapshots";
import { TECNOLOGIAS } from "@/lib/technologies";
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
  const archiveMonths = listSnapshots();

  return [
    {
      url: SITE_URL,
      lastModified: currentDataLastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/datos`,
      lastModified: currentDataLastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/regiones`,
      lastModified: currentDataLastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/tecnologias`,
      lastModified: currentDataLastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/comparar`,
      lastModified: currentDataLastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/archivo`,
      lastModified: currentDataLastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...Object.values(REGION_SLUGS).map((slug) => ({
      url: `${SITE_URL}/regiones/${slug}`,
      lastModified: currentDataLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...TECNOLOGIAS.map((technology) => ({
      url: `${SITE_URL}/tecnologias/${technology.slug}`,
      lastModified: currentDataLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...archiveMonths.map((month) => {
      const snapshot = readSnapshot(month);

      return {
        url: `${SITE_URL}/archivo/${month}`,
        lastModified: snapshot?.generatedAt
          ? new Date(snapshot.generatedAt)
          : currentDataLastModified,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      };
    }),
  ];
}
