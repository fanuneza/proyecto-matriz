import { describe, expect, it } from "vitest";
import {
  regionSlug,
  slugToRegion,
  slugToTecnologia,
  tecnologiaSlug,
} from "@/lib/slugs";

describe("regionSlug", () => {
  it("converts Antofagasta to antofagasta", () => {
    expect(regionSlug("Antofagasta")).toBe("antofagasta");
  });

  it("handles O'Higgins", () => {
    expect(regionSlug("O'Higgins")).toBe("ohiggins");
  });

  it("handles Nuble", () => {
    expect(regionSlug("Nuble")).toBe("nuble");
  });

  it("handles Arica y Parinacota", () => {
    expect(regionSlug("Arica y Parinacota")).toBe("arica-y-parinacota");
  });
});

describe("slugToRegion", () => {
  it("resolves antofagasta to Antofagasta", () => {
    expect(slugToRegion("antofagasta")).toBe("Antofagasta");
  });

  it("returns undefined for unknown slug", () => {
    expect(slugToRegion("nonexistent")).toBeUndefined();
  });
});

describe("tecnologiaSlug", () => {
  it("converts Solar to solar", () => {
    expect(tecnologiaSlug("Solar")).toBe("solar");
  });

  it("maps solar variants to the canonical solar slug", () => {
    expect(tecnologiaSlug("Solar Fotovoltaica")).toBe("solar");
    expect(tecnologiaSlug("Solar-CSP")).toBe("solar");
  });

  it("converts Hidraulica de Pasada to hidraulica-de-pasada", () => {
    expect(tecnologiaSlug("Hidraulica de Pasada")).toBe("hidraulica-de-pasada");
  });

  it("maps mini hydro variants to the canonical hydraulic slug", () => {
    expect(tecnologiaSlug("Mini Hidraulica Pasada")).toBe(
      "hidraulica-de-pasada",
    );
  });

  it("converts Eolica to eolica", () => {
    expect(tecnologiaSlug("Eolica")).toBe("eolica");
  });
});

describe("slugToTecnologia", () => {
  it("resolves solar to Solar", () => {
    expect(slugToTecnologia("solar")).toBe("Solar");
  });

  it("returns undefined for unknown slug", () => {
    expect(slugToTecnologia("coal")).toBeUndefined();
  });
});
