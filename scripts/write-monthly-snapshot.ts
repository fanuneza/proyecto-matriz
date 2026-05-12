import * as fs from "node:fs";
import * as path from "node:path";
import "./load-next-env";
import { MonthlySnapshotSchema } from "../lib/snapshot-schema";
import { SNAPSHOT_SCHEMA_VERSION, type MonthlySnapshot } from "../lib/snapshot-types";

async function main() {
  const force = process.argv.includes("--force");
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const outPath = path.join(process.cwd(), "data/snapshots", `${month}.json`);

  if (fs.existsSync(outPath) && !force) {
    console.log(`Snapshot ${month} already exists. Use --force to overwrite.`);
    process.exit(0);
  }

  const { getStoryData } = await import("../lib/story-data");
  const data = await getStoryData();

  const snapshot: MonthlySnapshot = {
    schemaVersion: SNAPSHOT_SCHEMA_VERSION,
    snapshotMonth: month,
    generatedAt: now.toISOString(),
    national: {
      totalErncMw: data.totalErncMw,
      porcentajeErnc: data.porcentajeErnc,
      totalNbMw: data.totalNbMw,
      pipelineMwTotal: data.pipelineMwTotal,
      erncCount: data.erncCount,
    },
    regiones: data.regionProfiles.map((region) => ({
      nombre: region.nombre,
      slug: region.slug,
      erncMw: region.erncMw,
    })),
    tecnologias: data.technologyProfiles.map((technology) => ({
      nombre: technology.nombre,
      slug: technology.slug,
      mw: technology.erncMw,
    })),
    sourceMetadata: {
      capacidad: {
        fetchedAt: data.metadata.endpoints.capacidad.fetchedAt,
        recordCount: data.metadata.endpoints.capacidad.recordCount,
      },
      pipeline: {
        fetchedAt: data.metadata.endpoints.pipeline.fetchedAt,
        recordCount: data.metadata.endpoints.pipeline.recordCount,
      },
      netBilling: {
        fetchedAt: data.metadata.endpoints.netBilling.fetchedAt,
        recordCount: data.metadata.endpoints.netBilling.recordCount,
      },
    },
  };

  const validated = MonthlySnapshotSchema.safeParse(snapshot);
  if (!validated.success) {
    throw new Error(`Snapshot validation failed:\n${validated.error.toString()}`);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(validated.data, null, 2));
  console.log(`Snapshot written: ${outPath}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
