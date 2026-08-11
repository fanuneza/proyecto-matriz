import { listSnapshots } from "@/lib/snapshots";
import { REGION_ENTRIES, REGION_SLUGS } from "@/lib/regions";
import { TECNOLOGIAS } from "@/lib/technologies";

export type IndexableRoute = {
  path: string;
  changeFrequency: "weekly" | "monthly";
  priority: number;
};

const FIXED_ROUTES: IndexableRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/datos", changeFrequency: "weekly", priority: 0.7 },
  { path: "/regiones", changeFrequency: "weekly", priority: 0.7 },
  { path: "/tecnologias", changeFrequency: "weekly", priority: 0.7 },
  { path: "/comparar", changeFrequency: "weekly", priority: 0.7 },
  { path: "/archivo", changeFrequency: "weekly", priority: 0.6 },
];

export function getIndexableRoutes(): IndexableRoute[] {
  const regionRoutes: IndexableRoute[] = REGION_ENTRIES.map((entry) => ({
    path: `/regiones/${REGION_SLUGS[entry.nombre] ?? entry.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const technologyRoutes: IndexableRoute[] = TECNOLOGIAS.map((technology) => ({
    path: `/tecnologias/${technology.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const snapshotRoutes: IndexableRoute[] = listSnapshots().map((month) => ({
    path: `/archivo/${month}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...FIXED_ROUTES, ...regionRoutes, ...technologyRoutes, ...snapshotRoutes];
}

export function getIndexablePaths(): string[] {
  return getIndexableRoutes().map((route) => route.path);
}
