import { describe, expect, it } from "vitest";
import { buildMonthlySummary } from "@/lib/monthly-summary";
import type { SnapshotDelta } from "@/lib/snapshot-compare";

function makeDelta(erncDelta: number): SnapshotDelta {
  return {
    prevMonth: "2026-03",
    currMonth: "2026-04",
    national: { totalErncMwDelta: erncDelta, totalNbMwDelta: 5, pipelineMwDelta: -50 },
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

  it("notes a large positive increase", () => {
    expect(buildMonthlySummary(makeDelta(1000))).toMatch(/aument|increm/i);
  });
});
