import * as fs from "node:fs";
import * as path from "node:path";
import { MonthlySnapshotSchema } from "@/lib/snapshot-schema";
import type { MonthlySnapshot } from "@/lib/snapshot-types";

const SNAPSHOTS_DIR = path.join(process.cwd(), "data/snapshots");

export function listSnapshots(): string[] {
  if (!fs.existsSync(SNAPSHOTS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(SNAPSHOTS_DIR)
    .filter((file) => /^\d{4}-\d{2}\.json$/.test(file))
    .map((file) => file.replace(".json", ""))
    .sort();
}

export function readSnapshot(month: string): MonthlySnapshot | null {
  const file = path.join(SNAPSHOTS_DIR, `${month}.json`);
  if (!fs.existsSync(file)) {
    return null;
  }

  const raw = JSON.parse(fs.readFileSync(file, "utf-8"));
  const parsed = MonthlySnapshotSchema.safeParse(raw);

  if (!parsed.success) {
    console.warn(`Snapshot ${month} failed validation: ${parsed.error.message}`);
    return null;
  }

  return parsed.data;
}

export function getPreviousSnapshot(currentMonth: string): MonthlySnapshot | null {
  const all = listSnapshots().filter((month) => month < currentMonth);
  if (all.length === 0) {
    return null;
  }

  return readSnapshot(all[all.length - 1]);
}
