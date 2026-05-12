import type { RegionProfile } from "@/lib/region-profiles";

export function buildComparisonText(a: RegionProfile, b: RegionProfile): string {
  const parts: string[] = [];

  if (a.erncMw !== b.erncMw) {
    const larger = a.erncMw > b.erncMw ? a : b;
    const smaller = a.erncMw > b.erncMw ? b : a;
    const ratio =
      larger.erncMw > 0 && smaller.erncMw > 0
        ? ` (${(larger.erncMw / smaller.erncMw).toFixed(1)}x)`
        : "";
    parts.push(
      `${larger.nombre} tiene mayor capacidad ERNC instalada que ${smaller.nombre}${ratio}.`,
    );
  } else {
    parts.push("Ambas regiones tienen una capacidad ERNC similar.");
  }

  if (
    a.mainTecnologia &&
    b.mainTecnologia &&
    a.mainTecnologia !== b.mainTecnologia
  ) {
    parts.push(
      `La tecnología principal en ${a.nombre} es ${a.mainTecnologia}, mientras que en ${b.nombre} es ${b.mainTecnologia}.`,
    );
  }

  if (a.nbMw !== null && b.nbMw !== null) {
    const largerNb = a.nbMw >= b.nbMw ? a : b;
    parts.push(
      `${largerNb.nombre} tiene más capacidad de generación distribuida (net billing).`,
    );
  }

  if (a.pipelineMw !== null && b.pipelineMw !== null && a.pipelineMw !== b.pipelineMw) {
    const largerPipeline = a.pipelineMw >= b.pipelineMw ? a : b;
    parts.push(
      `${largerPipeline.nombre} muestra una cartera en construcción mayor que la de la otra region.`,
    );
  }

  return parts.join(" ");
}
