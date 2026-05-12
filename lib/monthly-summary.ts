import type { SnapshotDelta } from "@/lib/snapshot-compare";

const SIGNIFICANT_THRESHOLD_MW = 100;

export function buildMonthlySummary(delta: SnapshotDelta): string {
  const { currMonth, national } = delta;
  const parts: string[] = [];

  if (Math.abs(national.totalErncMwDelta) < SIGNIFICANT_THRESHOLD_MW) {
    parts.push(
      `En ${currMonth}, la capacidad ERNC instalada registro sin cambios significativos respecto al mes anterior.`,
    );
  } else {
    const direction = national.totalErncMwDelta > 0 ? "aumento" : "disminuyo";
    parts.push(
      `En ${currMonth}, la capacidad ERNC instalada ${direction} en ${Math.abs(national.totalErncMwDelta).toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW respecto al mes anterior.`,
    );
  }

  if (Math.abs(national.totalNbMwDelta) >= 10) {
    const direction = national.totalNbMwDelta > 0 ? "aumento" : "disminuyo";
    parts.push(
      `La capacidad de generacion distribuida (net billing) ${direction} en ${Math.abs(national.totalNbMwDelta).toFixed(1)} MW.`,
    );
  }

  parts.push("Los valores reflejan capacidad instalada, no generacion real.");
  return parts.join(" ");
}
