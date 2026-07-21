import { describe, expect, it } from "vitest";
import { buildComparisonText } from "@/lib/compare-copy";
import type { RegionProfile } from "@/lib/region-profiles";

function makeProfile(
  slug: string,
  erncMw: number,
  mainTec: string,
): RegionProfile {
  return {
    slug,
    nombre: slug,
    erncMw,
    nationalSharePct: (erncMw / 30000) * 100,
    comparisonToNationalPct: 0,
    mainTecnologia: mainTec,
    tecnologias: [
      {
        nombre: mainTec,
        slug: mainTec.toLowerCase(),
        mw: erncMw,
        sharePct: 100,
      },
    ],
    nbMw: 50,
    pipelineMw: 200,
    pipelineProjects: null,
  };
}

describe("buildComparisonText", () => {
  it("identifies the larger-capacity region", () => {
    const a = makeProfile("antofagasta", 10000, "Solar");
    const b = makeProfile("metropolitana", 500, "Eolica");
    const text = buildComparisonText(a, b);
    expect(text).toContain("antofagasta");
    expect(text.toLowerCase()).toContain("mayor");
  });

  it("notes when main technologies differ", () => {
    const a = makeProfile("atacama", 8000, "Solar");
    const b = makeProfile("los-lagos", 1000, "Eolica");
    const text = buildComparisonText(a, b);
    expect(text.toLowerCase()).toMatch(/solar|eolica/);
  });

  it("returns a non-empty string for equal profiles", () => {
    const a = makeProfile("coquimbo", 2000, "Solar");
    const b = makeProfile("valparaiso", 2000, "Solar");
    expect(buildComparisonText(a, b).length).toBeGreaterThan(10);
  });
});
