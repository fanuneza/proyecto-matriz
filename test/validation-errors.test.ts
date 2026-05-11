import { describe, it, expect } from "vitest";
import {
  CapacidadArraySchema,
  PipelineArraySchema,
  NetBillingArraySchema,
  unwrapCneData,
} from "@/lib/validators";

describe("CNE validation error reporting", () => {
  describe("capacidad validation", () => {
    it("identifies an invalid capacidad record", () => {
      // Missing required `central` field
      const bad = [{ propietario: "X", tipo_de_energia: "Solar", estado: "Op" }];
      const result = CapacidadArraySchema.safeParse(bad);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBeTruthy();
        expect(result.error.message).toContain("central");
      }
    });

    it("accepts valid capacidad record", () => {
      const good = [
        {
          central: "Test Plant",
          propietario: "Owner",
          tipo_de_energia: "Solar",
          estado: "Op",
        },
      ];
      const result = CapacidadArraySchema.safeParse(good);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
      }
    });
  });

  describe("pipeline validation", () => {
    it("identifies an invalid pipeline record", () => {
      // Missing required `proyecto` field
      const bad = [{ propietario: "X", tipo_tecnologia: "Solar" }];
      const result = PipelineArraySchema.safeParse(bad);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBeTruthy();
      }
    });

    it("accepts valid pipeline record", () => {
      const good = [
        {
          proyecto: "Test Project",
          propietario: "Owner",
          tipo_tecnologia: "Solar",
          potencia_neta_mw: "100",
          region: "Atacama",
          anio_puesta_en_servicio: 2026,
        },
      ];
      const result = PipelineArraySchema.safeParse(good);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
      }
    });
  });

  describe("netBilling validation", () => {
    it("identifies an invalid netBilling record", () => {
      // Missing required `anio` field
      const bad = [
        { mes: 1, potencia_kw: "100", tecnologia: "Solar", region: "Metro" },
      ];
      const result = NetBillingArraySchema.safeParse(bad);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBeTruthy();
      }
    });

    it("accepts valid netBilling record", () => {
      const good = [
        {
          anio: 2026,
          mes: 5,
          potencia_kw: "100",
          tecnologia: "Solar",
          region: "Metro",
        },
      ];
      const result = NetBillingArraySchema.safeParse(good);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
      }
    });
  });

  describe("unwrapCneData", () => {
    it("unwraps CNE wrapper structure", () => {
      const wrapped = { success: true, data: [1, 2, 3] };
      expect(unwrapCneData(wrapped)).toEqual([1, 2, 3]);
    });

    it("passes through array data unchanged", () => {
      const array = [1, 2, 3];
      expect(unwrapCneData(array)).toEqual(array);
    });

    it("throws on unsuccessful wrapper response", () => {
      const badWrapper = { success: false, data: null };
      expect(() => unwrapCneData(badWrapper)).toThrow(
        "CNE API returned an unsuccessful response envelope"
      );
    });
  });
});
