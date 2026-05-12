import { describe, expect, it } from "vitest";
import { toCsv } from "@/lib/export-csv";

describe("toCsv", () => {
  it("generates a header row and data rows", () => {
    const rows = [
      { label: "Solar", value: 5000 },
      { label: "Eolica", value: 3000 },
    ];
    const csv = toCsv(["label", "value"], rows);
    const lines = csv.split("\n");

    expect(lines[0]).toBe("label,value");
    expect(lines[1]).toBe("Solar,5000");
    expect(lines[2]).toBe("Eolica,3000");
  });

  it("wraps values containing commas in quotes", () => {
    const rows = [{ label: "Los Lagos, Chile", value: 100 }];
    const csv = toCsv(["label", "value"], rows);

    expect(csv).toContain('"Los Lagos, Chile"');
  });
});
