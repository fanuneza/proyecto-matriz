import { describe, it, expect } from "vitest";
import type { DataMetadata } from "@/lib/data-types";

describe("DataMetadata type", () => {
  it("accepts a valid metadata object", () => {
    const meta: DataMetadata = {
      generatedAt: new Date().toISOString(),
      schemaVersion: 1,
      endpoints: {
        capacidad: {
          name: "capacidad",
          path: "/api/ea/capacidad/instaladagx",
          fetchedAt: new Date().toISOString(),
          recordCount: 100,
        },
        pipeline: {
          name: "pipeline",
          path: "/api/ea/proyectosenconstrucciongx",
          fetchedAt: new Date().toISOString(),
          recordCount: 50,
        },
        netBilling: {
          name: "netBilling",
          path: "/api/ea/netbilling",
          fetchedAt: new Date().toISOString(),
          recordCount: 200,
        },
      },
    };
    expect(meta.schemaVersion).toBe(1);
    expect(Object.keys(meta.endpoints)).toHaveLength(3);
  });
});
