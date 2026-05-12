import { describe, expect, it } from "vitest";
import { compareSnapshots } from "@/lib/snapshot-compare";
import type { MonthlySnapshot } from "@/lib/snapshot-types";

function makeSnap(month: string, erncMw: number, nbMw: number, pipelineMw: number): MonthlySnapshot {
  return {
    schemaVersion: 2,
    snapshotMonth: month,
    generatedAt: new Date().toISOString(),
    national: {
      totalErncMw: erncMw,
      porcentajeErnc: 50,
      totalNbMw: nbMw,
      pipelineMwTotal: pipelineMw,
      erncCount: 200,
    },
    regiones: [
      {
        nombre: "Antofagasta",
        slug: "antofagasta",
        erncMw: erncMw * 0.4,
        nationalSharePct: 40,
        nbMw: nbMw * 0.2,
        pipelineMw: pipelineMw * 0.5,
        mainTecnologia: "Solar",
      },
      {
        nombre: "Metropolitana",
        slug: "metropolitana",
        erncMw: erncMw * 0.2,
        nationalSharePct: 20,
        nbMw: nbMw * 0.4,
        pipelineMw: pipelineMw * 0.1,
        mainTecnologia: "Solar",
      },
    ],
    tecnologias: [
      {
        nombre: "Solar",
        slug: "solar",
        erncMw: erncMw * 0.6,
        nationalSharePct: 60,
        pipelineMw: pipelineMw * 0.5,
        regiones: [{ nombre: "Antofagasta", slug: "antofagasta", mw: erncMw * 0.3 }],
      },
      {
        nombre: "Eolica",
        slug: "eolica",
        erncMw: erncMw * 0.2,
        nationalSharePct: 20,
        pipelineMw: pipelineMw * 0.2,
        regiones: [{ nombre: "Biobio", slug: "biobio", mw: erncMw * 0.1 }],
      },
    ],
    netBilling: {
      totalMw: nbMw,
      regiones: [
        { nombre: "Metropolitana", slug: "metropolitana", mw: nbMw * 0.4 },
        { nombre: "Valparaiso", slug: "valparaiso", mw: nbMw * 0.2 },
      ],
    },
    pipeline: {
      totalMw: pipelineMw,
      regiones: [
        { nombre: "Antofagasta", slug: "antofagasta", mw: pipelineMw * 0.5 },
        { nombre: "Atacama", slug: "atacama", mw: pipelineMw * 0.2 },
      ],
      tecnologias: [
        { nombre: "Solar", slug: "solar", mw: pipelineMw * 0.5 },
        { nombre: "Eolica", slug: "eolica", mw: pipelineMw * 0.2 },
      ],
    },
    sourceMetadata: {
      capacidad: { fetchedAt: new Date().toISOString(), recordCount: 200 },
      pipeline: { fetchedAt: new Date().toISOString(), recordCount: 50 },
      netBilling: { fetchedAt: new Date().toISOString(), recordCount: 100 },
    },
  };
}

describe("compareSnapshots", () => {
  it("calculates national deltas", () => {
    const prev = makeSnap("2026-03", 20000, 100, 500);
    const curr = makeSnap("2026-04", 20500, 120, 450);
    const result = compareSnapshots(prev, curr);

    expect(result.national.totalErncMwDelta).toBeCloseTo(500);
    expect(result.national.totalNbMwDelta).toBeCloseTo(20);
    expect(result.national.pipelineMwDelta).toBeCloseTo(-50);
  });

  it("compares regions and technologies by slug", () => {
    const result = compareSnapshots(
      makeSnap("2026-03", 10000, 50, 300),
      makeSnap("2026-04", 11000, 80, 320),
    );

    expect(result.regiones.find((entry) => entry.slug === "antofagasta")?.deltaMw).toBeGreaterThan(0);
    expect(result.tecnologias.find((entry) => entry.slug === "solar")?.deltaMw).toBeGreaterThan(0);
  });

  it("compares net billing and pipeline collections", () => {
    const result = compareSnapshots(
      makeSnap("2026-03", 10000, 40, 300),
      makeSnap("2026-04", 10000, 75, 260),
    );

    expect(result.netBilling.totalMwDelta).toBeCloseTo(35);
    expect(result.pipeline.totalMwDelta).toBeCloseTo(-40);
    expect(result.pipeline.regiones[0]).toHaveProperty("slug");
  });
});
