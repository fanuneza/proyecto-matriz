import type { MetadataRoute } from "next";
import { REGION_SLUGS } from "@/lib/regions";
import { listSnapshots } from "@/lib/snapshots";
import { TECNOLOGIAS } from "@/lib/technologies";
import { SITE_URL } from "./site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const archiveMonths = listSnapshots();

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/datos`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/regiones`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    {
      url: `${SITE_URL}/tecnologias`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    { url: `${SITE_URL}/comparar`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/archivo`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    ...Object.values(REGION_SLUGS).map((slug) => ({
      url: `${SITE_URL}/regiones/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...TECNOLOGIAS.map((technology) => ({
      url: `${SITE_URL}/tecnologias/${technology.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...archiveMonths.map((month) => ({
      url: `${SITE_URL}/archivo/${month}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
