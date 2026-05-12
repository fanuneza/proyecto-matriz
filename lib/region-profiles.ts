import {
  capacidadPorAnio,
  filtrarErnc,
  netBillingPorRegion,
  pipelinePorRegion,
  totalNetaMw,
} from "@/lib/aggregates";
import type { NetBillingRecord } from "@/lib/normalize-netbilling";
import type { PlantaOperacional, ProyectoPipeline } from "@/lib/normalize-ernc";
import {
  canonicalRegionName,
  nombreRegion,
  REGION_ENTRIES,
} from "@/lib/regions";
import { regionSlug, tecnologiaSlug } from "@/lib/slugs";
import { canonicalTechnologyName, TECNOLOGIAS } from "@/lib/technologies";

export type RegionTechnologyEntry = {
  nombre: string;
  slug: string;
  mw: number;
  sharePct: number;
};

export type RegionProfile = {
  slug: string;
  nombre: string;
  erncMw: number;
  nationalSharePct: number;
  comparisonToNationalPct: number;
  mainTecnologia: string | null;
  tecnologias: RegionTechnologyEntry[];
  nbMw: number | null;
  pipelineMw: number | null;
  pipelineProjects: number | null;
};

export type TechnologyRegionEntry = {
  nombre: string;
  slug: string;
  mw: number;
  sharePct: number;
};

export type TechnologyProfile = {
  slug: string;
  nombre: string;
  descripcion: string;
  erncMw: number;
  nationalSharePct: number;
  regiones: TechnologyRegionEntry[];
  porAnio: { anio: number; mw: number }[];
  pipelineMw: number | null;
  pipelineProjects: number;
  topRegion: string | null;
  topRegionSharePct: number | null;
};

function aggregateTechnologyMw(plantas: PlantaOperacional[]) {
  const byTechnology = new Map<string, number>();

  for (const planta of plantas) {
    const canonical = canonicalTechnologyName(planta.tecnologia);
    if (!canonical) {
      continue;
    }

    byTechnology.set(
      canonical,
      (byTechnology.get(canonical) ?? 0) + (planta.potenciaNetaMw ?? 0),
    );
  }

  return [...byTechnology.entries()]
    .map(([nombre, mw]) => ({
      nombre,
      slug: tecnologiaSlug(nombre),
      mw,
    }))
    .sort((a, b) => b.mw - a.mw);
}

function aggregatePipelineByRegion(proyectos: ProyectoPipeline[]) {
  const counts = new Map<string, number>();

  for (const proyecto of proyectos) {
    const region = canonicalRegionName(proyecto.region);
    counts.set(region, (counts.get(region) ?? 0) + 1);
  }

  return new Map(
    pipelinePorRegion(
      proyectos.map((proyecto) => ({
        ...proyecto,
        region: canonicalRegionName(proyecto.region),
      })),
    ).map((entry) => [entry.region, { mw: entry.mw, count: counts.get(entry.region) ?? 0 }]),
  );
}

function aggregatePipelineByTechnology(proyectos: ProyectoPipeline[]) {
  const totals = new Map<string, { mw: number; count: number }>();

  for (const proyecto of proyectos) {
    const canonical = canonicalTechnologyName(proyecto.tecnologia);
    if (!canonical) {
      continue;
    }

    const current = totals.get(canonical) ?? { mw: 0, count: 0 };
    current.mw += proyecto.potenciaNetaMw ?? 0;
    current.count += 1;
    totals.set(canonical, current);
  }

  return totals;
}

export function buildRegionProfiles(
  plantas: PlantaOperacional[],
  pipeline: ProyectoPipeline[],
  nb: NetBillingRecord[],
  totalErncMw: number,
): RegionProfile[] {
  const ernc = filtrarErnc(plantas).map((planta) => ({
    ...planta,
    region: canonicalRegionName(planta.region ?? "Sin region"),
  }));
  const nbByRegion = new Map(
    netBillingPorRegion(
      nb.map((record) => ({ ...record, region: canonicalRegionName(record.region) })),
    ).map((entry) => [nombreRegion(entry.region), entry.kw / 1000]),
  );
  const pipeByRegion = aggregatePipelineByRegion(pipeline);
  const nationalAverageShare = REGION_ENTRIES.length > 0 ? 100 / REGION_ENTRIES.length : 0;

  return REGION_ENTRIES.map((regionEntry) => {
    const regionPlantas = ernc.filter((planta) => planta.region === regionEntry.nombre);
    const erncMw = totalNetaMw(regionPlantas);
    const tecnologias = aggregateTechnologyMw(regionPlantas).map((entry) => ({
      ...entry,
      sharePct: erncMw > 0 ? (entry.mw / erncMw) * 100 : 0,
    }));
    const pipelineData = pipeByRegion.get(regionEntry.nombre);
    const nationalSharePct = totalErncMw > 0 ? (erncMw / totalErncMw) * 100 : 0;

    return {
      slug: regionSlug(regionEntry.nombre),
      nombre: regionEntry.nombre,
      erncMw,
      nationalSharePct,
      comparisonToNationalPct: nationalSharePct - nationalAverageShare,
      mainTecnologia: tecnologias[0]?.nombre ?? null,
      tecnologias,
      nbMw: nbByRegion.get(regionEntry.nombre) ?? null,
      pipelineMw: pipelineData?.mw ?? null,
      pipelineProjects: pipelineData?.count ?? null,
    };
  })
    .filter((profile) => profile.erncMw > 0 || profile.nbMw !== null || profile.pipelineMw !== null)
    .sort((a, b) => b.erncMw - a.erncMw);
}

export function buildTechnologyProfiles(
  plantas: PlantaOperacional[],
  pipeline: ProyectoPipeline[],
  totalErncMw: number,
): TechnologyProfile[] {
  const ernc = filtrarErnc(plantas).map((planta) => ({
    ...planta,
    region: canonicalRegionName(planta.region ?? "Sin region"),
  }));
  const pipelineByTechnology = aggregatePipelineByTechnology(pipeline);

  const profiles: Array<TechnologyProfile | null> = TECNOLOGIAS.map((technology) => {
    const techPlants = ernc.filter(
      (planta) => canonicalTechnologyName(planta.tecnologia) === technology.nombre,
    );
    const totalMw = totalNetaMw(techPlants);

    if (totalMw <= 0) {
      return null;
    }

    const regions = new Map<string, number>();
    for (const planta of techPlants) {
      const region = canonicalRegionName(planta.region ?? "Sin region");
      regions.set(region, (regions.get(region) ?? 0) + (planta.potenciaNetaMw ?? 0));
    }

    const regionRows = [...regions.entries()]
      .map(([nombre, mw]) => ({
        nombre,
        slug: regionSlug(nombre),
        mw,
        sharePct: totalMw > 0 ? (mw / totalMw) * 100 : 0,
      }))
      .sort((a, b) => b.mw - a.mw);

    const growthRows = capacidadPorAnio(
      techPlants.map((planta) => ({
        ...planta,
        anioServicio: planta.anioServicio ?? null,
      })),
    );
    const pipelineData = pipelineByTechnology.get(technology.nombre) ?? null;

    return {
      slug: technology.slug,
      nombre: technology.nombre,
      descripcion: technology.descripcion,
      erncMw: totalMw,
      nationalSharePct: totalErncMw > 0 ? (totalMw / totalErncMw) * 100 : 0,
      regiones: regionRows,
      porAnio: growthRows,
      pipelineMw: pipelineData?.mw ?? null,
      pipelineProjects: pipelineData?.count ?? 0,
      topRegion: regionRows[0]?.nombre ?? null,
      topRegionSharePct: regionRows[0]?.sharePct ?? null,
    };
  });

  return profiles
    .filter((profile): profile is TechnologyProfile => profile !== null)
    .sort((a, b) => b.erncMw - a.erncMw);
}
