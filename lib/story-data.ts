import {
  fetchCapacidadRaw,
  fetchNetBillingRaw,
  fetchPipelineRaw,
} from "@/lib/cne-client";
import {
  capacidadPorAnio,
  filtrarErnc,
  netBillingPorMes,
  netBillingPorRegion,
  pipelinePorAnio,
  totalNetaMw,
} from "@/lib/aggregates";
import type { DataMetadata } from "@/lib/data-types";
import { normalizeNetBilling } from "@/lib/normalize-netbilling";
import { normalizePlanta, normalizePipeline } from "@/lib/normalize-ernc";
import { buildRegionProfiles, buildTechnologyProfiles } from "@/lib/region-profiles";
import { canonicalRegionName, nombreRegion } from "@/lib/regions";
import {
  CapacidadArraySchema,
  NetBillingArraySchema,
  PipelineArraySchema,
  unwrapCneData,
} from "@/lib/validators";

export async function getStoryData() {
  const [capResult, pipeResult, nbResult] = await Promise.all([
    fetchCapacidadRaw(),
    fetchPipelineRaw(),
    fetchNetBillingRaw(),
  ]);

  const capParsed = CapacidadArraySchema.safeParse(unwrapCneData(capResult.data));
  const pipeParsed = PipelineArraySchema.safeParse(unwrapCneData(pipeResult.data));
  const nbParsed = NetBillingArraySchema.safeParse(unwrapCneData(nbResult.data));

  if (!capParsed.success) {
    throw new Error(
      `CNE validation failed for dataset "capacidad":\n${capParsed.error.toString()}`,
    );
  }
  if (!pipeParsed.success) {
    throw new Error(
      `CNE validation failed for dataset "pipeline":\n${pipeParsed.error.toString()}`,
    );
  }
  if (!nbParsed.success) {
    throw new Error(
      `CNE validation failed for dataset "netBilling":\n${nbParsed.error.toString()}`,
    );
  }

  const operationalPlants = capParsed.data.map(normalizePlanta);
  const ernc = filtrarErnc(operationalPlants);
  const pipelineProjects = pipeParsed.data.map(normalizePipeline);
  const netBillingRecords = nbParsed.data.map(normalizeNetBilling);
  const currentYear = new Date().getFullYear();

  const totalErncMw = totalNetaMw(ernc);
  const totalMwGeneral = totalNetaMw(operationalPlants);
  const porcentajeErnc = totalMwGeneral > 0 ? (totalErncMw / totalMwGeneral) * 100 : 0;
  const porAnioPipe = pipelinePorAnio(pipelineProjects).filter(
    (entry) => entry.anio >= currentYear,
  );
  const nbPorRegion = netBillingPorRegion(netBillingRecords)
    .slice(0, 12)
    .map((entry) => ({ region: nombreRegion(entry.region), kw: entry.kw }));

  const metadata: DataMetadata = {
    generatedAt: new Date().toISOString(),
    schemaVersion: 1,
    endpoints: {
      capacidad: {
        name: "capacidad",
        path: "/api/ea/capacidad/instaladagx",
        fetchedAt: new Date(capResult.fetchedAt).toISOString(),
        recordCount: capParsed.data.length,
      },
      pipeline: {
        name: "pipeline",
        path: "/api/ea/proyectosenconstrucciongx",
        fetchedAt: new Date(pipeResult.fetchedAt).toISOString(),
        recordCount: pipeParsed.data.length,
      },
      netBilling: {
        name: "netBilling",
        path: "/api/ea/netbilling",
        fetchedAt: new Date(nbResult.fetchedAt).toISOString(),
        recordCount: nbParsed.data.length,
      },
    },
  };

  const regionProfiles = buildRegionProfiles(
    operationalPlants,
    pipelineProjects,
    netBillingRecords,
    totalErncMw,
  );
  const technologyProfiles = buildTechnologyProfiles(
    operationalPlants,
    pipelineProjects,
    totalErncMw,
  );

  return {
    totalErncMw,
    porcentajeErnc,
    totalNbMw: netBillingRecords.reduce((sum, entry) => sum + entry.potenciaKw, 0) / 1000,
    pipelineMwTotal: porAnioPipe.reduce((sum, entry) => sum + entry.mw, 0),
    erncCount: ernc.length,
    regiones: regionProfiles
      .slice(0, 12)
      .map((region) => ({ label: region.nombre, value: region.erncMw })),
    tecnologias: technologyProfiles.map((technology) => ({
      label: technology.nombre,
      value: technology.erncMw,
    })),
    porAnioOp: capacidadPorAnio(ernc).filter(
      (entry) => entry.anio >= 2000 && entry.anio <= currentYear,
    ),
    porAnioPipe,
    nbPorMes: netBillingPorMes(netBillingRecords),
    nbPorRegion: nbPorRegion.map((entry) => ({
      region: canonicalRegionName(entry.region),
      kw: entry.kw,
    })),
    regionProfiles,
    technologyProfiles,
    generadoEl: new Date(capResult.fetchedAt).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "America/Santiago",
    }),
    metadata,
    operationalPlants,
    pipelineProjects,
    netBillingRecords,
  };
}
