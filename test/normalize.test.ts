/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { normalizePlanta, normalizePipeline } from "@/lib/normalize-ernc";
import { normalizeNetBilling } from "@/lib/normalize-netbilling";

/* ── normalizePlanta ───────────────────────────────────────────────── */

describe("normalizePlanta", () => {
  it("maps raw capacidad fields to PlantaOperacional", () => {
    const raw = {
      central: "Solar Norte",
      propietario: "EnerSol",
      tipo_de_energia: "Solar",
      clasificacion: "ERNC",
      estado: "Operación",
      potencia_neta_mw: "150,5",
      region_nombre: "Antofagasta",
      anio_servicio_central: "2022",
    };
    const result = normalizePlanta(raw as any);
    expect(result.nombre).toBe("Solar Norte");
    expect(result.propietario).toBe("EnerSol");
    expect(result.tecnologia).toBe("Solar");
    expect(result.clasificacion).toBe("ERNC");
    expect(result.estado).toBe("Operación");
    expect(result.potenciaNetaMw).toBeCloseTo(150.5);
    expect(result.region).toBe("Antofagasta");
    expect(result.anioServicio).toBe(2022);
  });

  it("handles missing optional fields gracefully", () => {
    const raw = {
      central: "X",
      propietario: "Y",
      tipo_de_energia: "Solar",
      estado: "Op",
    };
    const result = normalizePlanta(raw as any);
    expect(result.potenciaNetaMw).toBeUndefined();
    expect(result.potenciaBrutaMw).toBeUndefined();
    expect(result.region).toBeUndefined();
    expect(result.comuna).toBeUndefined();
    expect(result.anioServicio).toBeNull();
    expect(result.fechaServicio).toBeUndefined();
    expect(result.puntoConexion).toBeUndefined();
    expect(result.sistema).toBeUndefined();
    expect(result.leyErnc).toBeUndefined();
    expect(result.clasificacion).toBe("");
  });

  it("parses comma-decimal string for potencia_neta_mw", () => {
    const raw = {
      central: "X",
      propietario: "Y",
      tipo_de_energia: "Solar",
      estado: "Op",
      potencia_neta_mw: "50,75",
    };
    const result = normalizePlanta(raw as any);
    expect(result.potenciaNetaMw).toBeCloseTo(50.75);
  });

  it("parses comma-decimal string for potencia_bruta_mw", () => {
    const raw = {
      central: "X",
      propietario: "Y",
      tipo_de_energia: "Solar",
      estado: "Op",
      potencia_bruta_mw: "200,0",
    };
    const result = normalizePlanta(raw as any);
    expect(result.potenciaBrutaMw).toBeCloseTo(200.0);
  });

  it("returns null anioServicio for non-numeric string", () => {
    const raw = {
      central: "X",
      propietario: "Y",
      tipo_de_energia: "Solar",
      estado: "Op",
      anio_servicio_central: "N/A",
    };
    const result = normalizePlanta(raw as any);
    expect(result.anioServicio).toBeNull();
  });

  it("maps optional fields when present", () => {
    const raw = {
      central: "X",
      propietario: "Y",
      tipo_de_energia: "Solar",
      estado: "Op",
      clasificacion: "ERNC",
      ley_ernc: "20936",
      comuna_nombre: "Calama",
      anio_servicio_central: "2020",
      fecha_puesta_servicio_central: "01/01/2020",
      punto_conexion: "Barra Norte",
      sistema: "SING",
    };
    const result = normalizePlanta(raw as any);
    expect(result.leyErnc).toBe("20936");
    expect(result.comuna).toBe("Calama");
    expect(result.fechaServicio).toBe("01/01/2020");
    expect(result.puntoConexion).toBe("Barra Norte");
    expect(result.sistema).toBe("SING");
  });
});

/* ── normalizePipeline ─────────────────────────────────────────────── */

describe("normalizePipeline", () => {
  it("maps raw pipeline fields", () => {
    const raw = {
      proyecto: "Eólico Sur",
      propietario: "WindCo",
      tipo_tecnologia: "Eólica",
      tipo_tecnologia_final: "Eólica",
      potencia_neta_mw: "200",
      region: "Los Lagos",
      anio_puesta_en_servicio: 2027,
    };
    const result = normalizePipeline(raw as any);
    expect(result.nombre).toBe("Eólico Sur");
    expect(result.propietario).toBe("WindCo");
    expect(result.potenciaNetaMw).toBe(200);
    expect(result.region).toBe("Los Lagos");
    expect(result.anioServicio).toBe(2027);
  });

  it("prefers tipo_tecnologia_final over tipo_tecnologia", () => {
    const raw = {
      proyecto: "X",
      propietario: "Y",
      tipo_tecnologia: "Hidro",
      tipo_tecnologia_final: "Hidráulica de pasada",
      potencia_neta_mw: "10",
      region: "Aysén",
      anio_puesta_en_servicio: 2026,
    };
    expect(normalizePipeline(raw as any).tecnologia).toBe(
      "Hidráulica de pasada",
    );
  });

  it("falls back to tipo_tecnologia when tipo_tecnologia_final is absent", () => {
    const raw = {
      proyecto: "X",
      propietario: "Y",
      tipo_tecnologia: "Solar",
      potencia_neta_mw: "10",
      region: "Atacama",
      anio_puesta_en_servicio: 2025,
    };
    expect(normalizePipeline(raw as any).tecnologia).toBe("Solar");
  });

  it("parses comma-decimal potencia_neta_mw", () => {
    const raw = {
      proyecto: "X",
      propietario: "Y",
      tipo_tecnologia: "Solar",
      potencia_neta_mw: "123,4",
      region: "Atacama",
      anio_puesta_en_servicio: 2025,
    };
    expect(normalizePipeline(raw as any).potenciaNetaMw).toBeCloseTo(123.4);
  });

  it("maps optional fields when present", () => {
    const raw = {
      proyecto: "X",
      propietario: "Y",
      tipo_tecnologia: "Solar",
      potencia_neta_mw: "10",
      region: "Atacama",
      barra_conexion: "Barra A",
      sistema: "SIC",
      categoria: "PMG",
      anio_puesta_en_servicio: 2025,
    };
    const result = normalizePipeline(raw as any);
    expect(result.barraConexion).toBe("Barra A");
    expect(result.sistema).toBe("SIC");
    expect(result.categoria).toBe("PMG");
  });
});

/* ── normalizeNetBilling ───────────────────────────────────────────── */

describe("normalizeNetBilling", () => {
  it("parses comma-decimal potencia_kw", () => {
    const raw = {
      anio: 2024,
      mes: 3,
      potencia_kw: "1234,5",
      tecnologia: "Solar",
      region: "RM",
    };
    const result = normalizeNetBilling(raw as any);
    expect(result.potenciaKw).toBeCloseTo(1234.5);
    expect(result.anio).toBe(2024);
    expect(result.mes).toBe(3);
    expect(result.tecnologia).toBe("Solar");
    expect(result.region).toBe("RM");
  });

  it("returns 0 for malformed potencia_kw", () => {
    const raw = {
      anio: 2024,
      mes: 1,
      potencia_kw: "N/A",
      tecnologia: "Solar",
      region: "V",
    };
    expect(normalizeNetBilling(raw as any).potenciaKw).toBe(0);
  });

  it("parses integer string potencia_kw", () => {
    const raw = {
      anio: 2023,
      mes: 6,
      potencia_kw: "5000",
      tecnologia: "Solar",
      region: "V",
    };
    expect(normalizeNetBilling(raw as any).potenciaKw).toBe(5000);
  });

  it("maps optional comuna when present", () => {
    const raw = {
      anio: 2024,
      mes: 1,
      potencia_kw: "100",
      tecnologia: "Solar",
      region: "RM",
      comuna: "Santiago",
    };
    expect(normalizeNetBilling(raw as any).comuna).toBe("Santiago");
  });

  it("leaves comuna undefined when absent", () => {
    const raw = {
      anio: 2024,
      mes: 1,
      potencia_kw: "100",
      tecnologia: "Solar",
      region: "RM",
    };
    expect(normalizeNetBilling(raw as any).comuna).toBeUndefined();
  });
});
