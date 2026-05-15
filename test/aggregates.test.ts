import { describe, it, expect } from "vitest";
import {
  filtrarErnc,
  totalNetaMw,
  capacidadPorRegion,
  capacidadPorTecnologia,
  capacidadPorAnio,
  pipelinePorAnio,
  netBillingPorMes,
  netBillingPorRegion,
} from "@/lib/aggregates";
import type { PlantaOperacional, ProyectoPipeline } from "@/lib/normalize-ernc";
import type { NetBillingRecord } from "@/lib/normalize-netbilling";

/* ── Fixtures ──────────────────────────────────────────────────────── */

const solar: PlantaOperacional = {
  nombre: "Solar A", propietario: "X", tecnologia: "Solar",
  clasificacion: "ERNC", estado: "Operación",
  potenciaNetaMw: 100, region: "Antofagasta", anioServicio: 2022,
};
const hidro: PlantaOperacional = {
  nombre: "Hidro B", propietario: "Y", tecnologia: "Hidráulica de pasada",
  clasificacion: "ERNC", estado: "Operación",
  potenciaNetaMw: 50, region: "Los Ríos", anioServicio: 2015,
};
const carbon: PlantaOperacional = {
  nombre: "Carbon C", propietario: "Z", tecnologia: "Carbón",
  clasificacion: "Convencional", estado: "Operación",
  potenciaNetaMw: 200, region: "Biobío", anioServicio: 2000,
};

const pipe1: ProyectoPipeline = {
  nombre: "Pipe A", propietario: "X", tecnologia: "Solar",
  potenciaNetaMw: 300, region: "Atacama", anioServicio: 2026,
};
const pipe2: ProyectoPipeline = {
  nombre: "Pipe B", propietario: "Y", tecnologia: "Eólica",
  potenciaNetaMw: 150, region: "Antofagasta", anioServicio: 2026,
};
const pipe3: ProyectoPipeline = {
  nombre: "Pipe C", propietario: "Z", tecnologia: "Solar",
  potenciaNetaMw: 80, region: "Coquimbo", anioServicio: 2027,
};

const nb1: NetBillingRecord = { anio: 2024, mes: 1, potenciaKw: 5000, tecnologia: "Solar", region: "RM" };
const nb2: NetBillingRecord = { anio: 2024, mes: 1, potenciaKw: 3000, tecnologia: "Solar", region: "RM" };
const nb3: NetBillingRecord = { anio: 2024, mes: 2, potenciaKw: 4000, tecnologia: "Solar", region: "V" };

/* ── filtrarErnc ───────────────────────────────────────────────────── */

describe("filtrarErnc", () => {
  it("returns only ERNC plants", () => {
    const result = filtrarErnc([solar, hidro, carbon]);
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.clasificacion === "ERNC")).toBe(true);
  });

  it("returns empty array when no ERNC plants", () => {
    expect(filtrarErnc([carbon])).toHaveLength(0);
  });

  it("returns empty array for empty input", () => {
    expect(filtrarErnc([])).toHaveLength(0);
  });
});

/* ── totalNetaMw ───────────────────────────────────────────────────── */

describe("totalNetaMw", () => {
  it("sums potenciaNetaMw", () => {
    expect(totalNetaMw([solar, hidro])).toBe(150);
  });

  it("treats undefined potenciaNetaMw as zero", () => {
    const noMw: PlantaOperacional = {
      nombre: "X", propietario: "Y", tecnologia: "Z",
      clasificacion: "ERNC", estado: "Op",
    };
    expect(totalNetaMw([noMw])).toBe(0);
  });

  it("returns 0 for empty array", () => {
    expect(totalNetaMw([])).toBe(0);
  });

  it("includes plants with any clasificacion", () => {
    expect(totalNetaMw([solar, carbon])).toBe(300);
  });
});

/* ── capacidadPorRegion ────────────────────────────────────────────── */

describe("capacidadPorRegion", () => {
  it("groups by region, sums MW, sorts descending", () => {
    const result = capacidadPorRegion([solar, hidro]);
    expect(result[0].region).toBe("Antofagasta");
    expect(result[0].mw).toBe(100);
    expect(result[1].region).toBe("Los Ríos");
    expect(result[1].mw).toBe(50);
  });

  it("uses 'Sin región' for undefined region", () => {
    const noRegion: PlantaOperacional = {
      nombre: "X", propietario: "Y", tecnologia: "Solar",
      clasificacion: "ERNC", estado: "Op", potenciaNetaMw: 10,
    };
    const result = capacidadPorRegion([noRegion]);
    expect(result[0].region).toBe("Sin región");
    expect(result[0].mw).toBe(10);
  });

  it("includes count of plants per region", () => {
    const solar2: PlantaOperacional = { ...solar, nombre: "Solar A2" };
    const result = capacidadPorRegion([solar, solar2, hidro]);
    const antof = result.find((r) => r.region === "Antofagasta")!;
    expect(antof.count).toBe(2);
  });

  it("returns empty array for empty input", () => {
    expect(capacidadPorRegion([])).toHaveLength(0);
  });
});

/* ── capacidadPorTecnologia ────────────────────────────────────────── */

describe("capacidadPorTecnologia", () => {
  it("groups by tecnologia, sums MW, sorts descending", () => {
    const result = capacidadPorTecnologia([solar, hidro]);
    expect(result[0].tecnologia).toBe("Solar");
    expect(result[0].mw).toBe(100);
    expect(result[1].tecnologia).toBe("Hidráulica de pasada");
    expect(result[1].mw).toBe(50);
  });

  it("aggregates multiple plants of same tecnologia", () => {
    const solar2: PlantaOperacional = { ...solar, nombre: "Solar A2", potenciaNetaMw: 200 };
    const result = capacidadPorTecnologia([solar, solar2]);
    expect(result).toHaveLength(1);
    expect(result[0].mw).toBe(300);
    expect(result[0].count).toBe(2);
  });

  it("returns empty array for empty input", () => {
    expect(capacidadPorTecnologia([])).toHaveLength(0);
  });
});

/* ── capacidadPorAnio ──────────────────────────────────────────────── */

describe("capacidadPorAnio", () => {
  it("groups by anioServicio, sorts ascending", () => {
    const result = capacidadPorAnio([solar, hidro]);
    expect(result[0].anio).toBe(2015);
    expect(result[1].anio).toBe(2022);
  });

  it("excludes plants with null anioServicio", () => {
    const noYear: PlantaOperacional = {
      nombre: "X", propietario: "Y", tecnologia: "Solar",
      clasificacion: "ERNC", estado: "Op",
      potenciaNetaMw: 10, anioServicio: null,
    };
    const result = capacidadPorAnio([noYear, solar]);
    expect(result).toHaveLength(1);
    expect(result[0].anio).toBe(2022);
  });

  it("excludes plants with undefined anioServicio", () => {
    const noYear: PlantaOperacional = {
      nombre: "X", propietario: "Y", tecnologia: "Solar",
      clasificacion: "ERNC", estado: "Op", potenciaNetaMw: 10,
    };
    const result = capacidadPorAnio([noYear, solar]);
    expect(result).toHaveLength(1);
  });

  it("returns empty array for empty input", () => {
    expect(capacidadPorAnio([])).toHaveLength(0);
  });
});

/* ── pipelinePorAnio ───────────────────────────────────────────────── */

describe("pipelinePorAnio", () => {
  it("groups by anioServicio, sums MW", () => {
    const result = pipelinePorAnio([pipe1, pipe2, pipe3]);
    const yr2026 = result.find((r) => r.anio === 2026)!;
    expect(yr2026.mw).toBe(450);
    expect(yr2026.count).toBe(2);
  });

  it("sorts ascending by year", () => {
    const result = pipelinePorAnio([pipe3, pipe1, pipe2]);
    expect(result[0].anio).toBe(2026);
    expect(result[1].anio).toBe(2027);
  });

  it("handles single project", () => {
    const result = pipelinePorAnio([pipe1]);
    expect(result).toHaveLength(1);
    expect(result[0].anio).toBe(2026);
    expect(result[0].mw).toBe(300);
  });

  it("returns empty array for empty input", () => {
    expect(pipelinePorAnio([])).toHaveLength(0);
  });
});

/* ── netBillingPorMes ──────────────────────────────────────────────── */

describe("netBillingPorMes", () => {
  it("groups by YYYY-MM, sums kW", () => {
    const result = netBillingPorMes([nb1, nb2, nb3]);
    const jan = result.find((r) => r.periodo === "2024-01")!;
    expect(jan.kw).toBe(8000);
  });

  it("sorts chronologically", () => {
    const result = netBillingPorMes([nb3, nb1, nb2]);
    expect(result[0].periodo).toBe("2024-01");
    expect(result[1].periodo).toBe("2024-02");
  });

  it("pads single-digit months to two digits", () => {
    const result = netBillingPorMes([nb1]);
    expect(result[0].periodo).toBe("2024-01");
  });

  it("returns empty array for empty input", () => {
    expect(netBillingPorMes([])).toHaveLength(0);
  });
});

/* ── netBillingPorRegion ───────────────────────────────────────────── */

describe("netBillingPorRegion", () => {
  it("groups by region, sums kW, sorts descending", () => {
    const result = netBillingPorRegion([nb1, nb2, nb3]);
    expect(result[0].region).toBe("RM");
    expect(result[0].kw).toBe(8000);
    expect(result[1].region).toBe("V");
    expect(result[1].kw).toBe(4000);
  });

  it("returns empty array for empty input", () => {
    expect(netBillingPorRegion([])).toHaveLength(0);
  });
});
