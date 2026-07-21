import type { AggregateDelta, SnapshotDelta } from "@/lib/snapshot-compare";

const SIGNIFICANT_MW = 100;
const SECONDARY_MW = 25;

function describeSignedChange(value: number): string {
  const magnitude = Math.abs(value).toLocaleString("es-CL", {
    maximumFractionDigits: value % 1 === 0 ? 0 : 1,
  });
  return `${value > 0 ? "aumento" : "disminuyo"} en ${magnitude} MW`;
}

function firstMeaningfulChange(entries: AggregateDelta[], threshold: number) {
  return entries.find((entry) => Math.abs(entry.deltaMw) >= threshold) ?? null;
}

export function buildMonthlySummary(delta: SnapshotDelta): string {
  const parts: string[] = [];
  const nationalDelta = delta.national.totalErncMwDelta;
  const topRegion = firstMeaningfulChange(delta.regiones, SIGNIFICANT_MW);
  const topTechnology = firstMeaningfulChange(
    delta.tecnologias,
    SIGNIFICANT_MW,
  );
  const topPipeline = firstMeaningfulChange(
    delta.pipeline.regiones,
    SIGNIFICANT_MW,
  );
  const topNetBilling = firstMeaningfulChange(
    delta.netBilling.regiones,
    SECONDARY_MW,
  );

  if (Math.abs(nationalDelta) < SIGNIFICANT_MW) {
    parts.push(
      `En ${delta.currMonth}, la capacidad ERNC instalada se mantuvo sin cambios significativos frente a ${delta.prevMonth}.`,
    );
  } else {
    parts.push(
      `En ${delta.currMonth}, la capacidad ERNC instalada ${describeSignedChange(nationalDelta)} frente a ${delta.prevMonth}.`,
    );
  }

  if (topRegion) {
    parts.push(
      `${topRegion.nombre} concentró el mayor cambio regional, con una variacion de ${Math.abs(
        topRegion.deltaMw,
      ).toLocaleString("es-CL", {
        maximumFractionDigits: 0,
      })} MW.`,
    );
  }

  if (topTechnology) {
    parts.push(
      `${topTechnology.nombre} fue la tecnología con mayor movimiento mensual, con ${Math.abs(
        topTechnology.deltaMw,
      ).toLocaleString("es-CL", {
        maximumFractionDigits: 0,
      })} MW de diferencia.`,
    );
  }

  if (Math.abs(delta.pipeline.totalMwDelta) >= SIGNIFICANT_MW) {
    const pipelineText = topPipeline
      ? ` El mayor ajuste del pipeline aparecio en ${topPipeline.nombre}.`
      : "";
    parts.push(
      `La cartera en construcción ${describeSignedChange(delta.pipeline.totalMwDelta)}.${pipelineText}`.trim(),
    );
  }

  if (Math.abs(delta.netBilling.totalMwDelta) >= SECONDARY_MW) {
    const netBillingTail = topNetBilling
      ? ` ${topNetBilling.nombre} registró la variación regional mas visible.`
      : "";
    parts.push(
      `La generación distribuida bajo net billing ${describeSignedChange(delta.netBilling.totalMwDelta)}.${netBillingTail}`.trim(),
    );
  }

  parts.push(
    "Los valores reflejan capacidad instalada y proyectos declarados, no generación real.",
  );
  return parts.join(" ");
}
