import { describe, expect, it } from "vitest";
import { buildMonthlySummary } from "@/lib/monthly-summary";
import type { SnapshotDelta } from "@/lib/snapshot-compare";

function makeDelta(erncDelta: number): SnapshotDelta {
  return {
    prevMonth: "2026-03",
    currMonth: "2026-04",
    national: {
      totalErncMwDelta: erncDelta,
      totalNbMwDelta: 35,
      pipelineMwDelta: -120,
    },
    regiones: [
      {
        nombre: "Antofagasta",
        slug: "antofagasta",
        previousMw: 4000,
        currentMw: 4300,
        deltaMw: 300,
      },
    ],
    tecnologias: [
      {
        nombre: "Solar",
        slug: "solar",
        previousMw: 6000,
        currentMw: 6300,
        deltaMw: 300,
      },
    ],
    netBilling: {
      totalMwDelta: 35,
      regiones: [
        {
          nombre: "Metropolitana",
          slug: "metropolitana",
          previousMw: 100,
          currentMw: 130,
          deltaMw: 30,
        },
      ],
    },
    pipeline: {
      totalMwDelta: -120,
      regiones: [
        {
          nombre: "Atacama",
          slug: "atacama",
          previousMw: 300,
          currentMw: 180,
          deltaMw: -120,
        },
      ],
      tecnologias: [
        {
          nombre: "Solar",
          slug: "solar",
          previousMw: 200,
          currentMw: 120,
          deltaMw: -80,
        },
      ],
    },
  };
}

describe("buildMonthlySummary", () => {
  it("returns a non-empty string", () => {
    expect(buildMonthlySummary(makeDelta(200)).length).toBeGreaterThan(10);
  });

  it("mentions the month", () => {
    expect(buildMonthlySummary(makeDelta(200))).toContain("2026-04");
  });

  it("says 'sin cambios significativos' for near-zero delta", () => {
    expect(buildMonthlySummary(makeDelta(0))).toMatch(/sin cambios/i);
  });

  it("mentions the top region and technology movers", () => {
    const summary = buildMonthlySummary(makeDelta(1000));
    expect(summary).toMatch(/Antofagasta/);
    expect(summary).toMatch(/Solar/);
  });
});
