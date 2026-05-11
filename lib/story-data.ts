import { fetchCapacidadRaw, fetchNetBillingRaw, fetchPipelineRaw } from "@/lib/cne-client";
import type { DataMetadata } from "@/lib/data-types";
import {
  capacidadPorAnio,
  capacidadPorRegion,
  capacidadPorTecnologia,
  filtrarErnc,
  netBillingPorMes,
  netBillingPorRegion,
  pipelinePorAnio,
  totalNetaMw,
} from "@/lib/aggregates";
import { normalizePlanta, normalizePipeline } from "@/lib/normalize-ernc";
import { normalizeNetBilling } from "@/lib/normalize-netbilling";
import { nombreRegion, nombreRegionCorto } from "@/lib/regions";
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

  if (!capParsed.success || !pipeParsed.success || !nbParsed.success) {
    throw new Error("CNE API validation failed while generating static story data");
  }

  const todasPlantas = capParsed.data.map(normalizePlanta);
  const ernc = filtrarErnc(todasPlantas);
  const pipeline = pipeParsed.data.map(normalizePipeline);
  const nb = nbParsed.data.map(normalizeNetBilling);
  const currentYear = new Date().getFullYear();

  const totalErncMw = totalNetaMw(ernc);
  const totalMwGeneral = totalNetaMw(todasPlantas);
  const porcentajeErnc = (totalErncMw / totalMwGeneral) * 100;
  const porAnioPipe = pipelinePorAnio(pipeline).filter((d) => d.anio >= currentYear);
  const nbPorRegion = netBillingPorRegion(nb)
    .slice(0, 12)
    .map((r) => ({ region: nombreRegion(r.region), kw: r.kw }));

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

  return {
    totalErncMw,
    porcentajeErnc,
    totalNbMw: nb.reduce((s, r) => s + r.potenciaKw, 0) / 1000,
    pipelineMwTotal: porAnioPipe.reduce((s, d) => s + d.mw, 0),
    erncCount: ernc.length,
    regiones: capacidadPorRegion(ernc)
      .slice(0, 12)
      .map((r) => ({ label: nombreRegionCorto(r.region ?? ""), value: r.mw })),
    tecnologias: capacidadPorTecnologia(ernc)
      .map((t) => ({ label: t.tecnologia, value: t.mw })),
    porAnioOp: capacidadPorAnio(ernc)
      .filter((d) => d.anio >= 2000 && d.anio <= currentYear),
    porAnioPipe,
    nbPorMes: netBillingPorMes(nb),
    nbPorRegion,
    generadoEl: new Date(capResult.fetchedAt).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "America/Santiago",
    }),
    metadata,
  };
}
