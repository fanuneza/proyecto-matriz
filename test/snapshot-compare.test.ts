import { describe, expect, it } from "vitest";
import { compareSnapshots } from "@/lib/snapshot-compare";
import type { MonthlySnapshot } from "@/lib/snapshot-types";

function makeSnap(month: string, erncMw: number): MonthlySnapshot {
  return {
    schemaVersion: 1,
    snapshotMonth: month,
    generatedAt: new Date().toISOString(),
    national: {
      totalErncMw: erncMw,
      porcentajeErnc: 50,
      totalNbMw: 100,
      pipelineMwTotal: 500,
      erncCount: 200,
    },
    regiones: [{ nombre: "Antofagasta", slug: "antofagasta", erncMw: erncMw * 0.4 }],
    tecnologias: [{ nombre: "Solar", slug: "solar", mw: erncMw * 0.6 }],
    sourceMetadata: {
      capacidad: { fetchedAt: new Date().toISOString(), recordCount: 200 },
      pipeline: { fetchedAt: new Date().toISOString(), recordCount: 50 },
      netBilling: { fetchedAt: new Date().toISOString(), recordCount: 100 },
    },
  };
}

describe("compareSnapshots", () => {
  it("calculates national ERNC MW delta", () => {
    const prev = makeSnap("2026-03", 20000);
    const curr = makeSnap("2026-04", 20500);
    expect(compareSnapshots(prev, curr).national.totalErncMwDelta).toBeCloseTo(500);
  });

  it("returns positive delta when current exceeds previous", () => {
    const result = compareSnapshots(
      makeSnap("2026-03", 10000),
      makeSnap("2026-04", 11000),
    );
    expect(result.national.totalErncMwDelta).toBeGreaterThan(0);
  });

  it("handles zero previous gracefully", () => {
    const result = compareSnapshots(makeSnap("2026-03", 0), makeSnap("2026-04", 500));
    expect(result.national.totalErncMwDelta).toBe(500);
  });
});
