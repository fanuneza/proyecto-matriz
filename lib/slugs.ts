import { canonicalRegionName, REGION_SLUGS } from "@/lib/regions";
import {
  canonicalTechnologyName,
  TEC_BY_NOMBRE,
  TEC_BY_SLUG,
} from "@/lib/technologies";

const SLUG_TO_REGION = new Map(
  Object.entries(REGION_SLUGS).map(([name, slug]) => [slug, name]),
);

export function regionSlug(nombre: string): string {
  const canonical = canonicalRegionName(nombre);
  return REGION_SLUGS[canonical] ?? toSlug(canonical);
}

export function slugToRegion(slug: string): string | undefined {
  return SLUG_TO_REGION.get(slug);
}

export function tecnologiaSlug(nombre: string): string {
  const canonical = canonicalTechnologyName(nombre) ?? nombre;
  return TEC_BY_NOMBRE.get(canonical)?.slug ?? toSlug(canonical);
}

export function slugToTecnologia(slug: string): string | undefined {
  return TEC_BY_SLUG.get(slug)?.nombre;
}

export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
