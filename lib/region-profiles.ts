import {
  capacidadPorTecnologia,
  filtrarErnc,
  netBillingPorRegion,
  pipelinePorRegion,
  totalNetaMw,
} from "@/lib/aggregates";
import type { NetBillingRecord } from "@/lib/normalize-netbilling";
import type { PlantaOperacional, ProyectoPipeline } from "@/lib/normalize-ernc";
import { nombreRegion, REGION_SLUGS } from "@/lib/regions";
import { regionSlug, tecnologiaSlug } from "@/lib/slugs";
import { TEC_BY_NOMBRE } from "@/lib/technologies";

export type RegionProfile = {
  slug: string;
  nombre: string;
  erncMw: number;
  nationalSharePct: number;
  mainTecnologia: string | null;
  tecnologias: { nombre: string; mw: number }[];
  nbMw: number | null;
  pipelineMw: number | null;
};

export type TechnologyProfile = {
  slug: string;
  nombre: string;
  descripcion: string;
  erncMw: number;
  nationalSharePct: number;
  regiones: { nombre: string; mw: number }[];
};

export function buildRegionProfiles(
  plantas: PlantaOperacional[],
  pipeline: ProyectoPipeline[],
  nb: NetBillingRecord[],
  totalErncMw: number,
): RegionProfile[] {
  const ernc = filtrarErnc(plantas);
  const nbByRegion = new Map(
    netBillingPorRegion(nb).map((entry) => [nombreRegion(entry.region), entry.kw / 1000]),
  );
  const pipeByRegion = new Map(
    pipelinePorRegion(pipeline).map((entry) => [entry.region, entry.mw]),
  );

  return Object.keys(REGION_SLUGS)
    .map((nombre) => {
      const regionPlantas = ernc.filter(
        (planta) => nombreRegion(planta.region ?? "") === nombre,
      );
      const erncMw = totalNetaMw(regionPlantas);
      const tecnologias = capacidadPorTecnologia(regionPlantas).map((entry) => ({
        nombre: entry.tecnologia,
        mw: entry.mw,
      }));

      return {
        slug: regionSlug(nombre),
        nombre,
        erncMw,
        nationalSharePct: totalErncMw > 0 ? (erncMw / totalErncMw) * 100 : 0,
        mainTecnologia: tecnologias[0]?.nombre ?? null,
        tecnologias,
        nbMw: nbByRegion.get(nombre) ?? null,
        pipelineMw: pipeByRegion.get(nombre) ?? null,
      };
    })
    .filter((profile) => profile.erncMw > 0 || profile.nbMw !== null || profile.pipelineMw !== null)
    .sort((a, b) => b.erncMw - a.erncMw);
}

export function buildTechnologyProfiles(
  plantas: PlantaOperacional[],
  totalErncMw: number,
): TechnologyProfile[] {
  const ernc = filtrarErnc(plantas);
  const techRows = capacidadPorTecnologia(ernc);

  return techRows.map((row) => {
    const techPlants = ernc.filter((planta) => planta.tecnologia === row.tecnologia);
    const regions = new Map<string, number>();

    for (const planta of techPlants) {
      const region = nombreRegion(planta.region ?? "Sin region");
      regions.set(region, (regions.get(region) ?? 0) + (planta.potenciaNetaMw ?? 0));
    }

    return {
      slug: tecnologiaSlug(row.tecnologia),
      nombre: row.tecnologia,
      descripcion:
        TEC_BY_NOMBRE.get(row.tecnologia)?.descripcion ??
        "Tecnologia presente en la matriz renovable chilena.",
      erncMw: row.mw,
      nationalSharePct: totalErncMw > 0 ? (row.mw / totalErncMw) * 100 : 0,
      regiones: [...regions.entries()]
        .map(([nombre, mw]) => ({ nombre, mw }))
        .sort((a, b) => b.mw - a.mw),
    };
  });
}
