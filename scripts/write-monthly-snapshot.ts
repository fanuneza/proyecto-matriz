import * as fs from "node:fs";
import * as path from "node:path";
import "./load-next-env";
import { MonthlySnapshotSchema } from "../lib/snapshot-schema";
import {
  SNAPSHOT_SCHEMA_VERSION,
  type MonthlySnapshot,
} from "../lib/snapshot-types";

async function main() {
  const force = process.argv.includes("--force");
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const monthArg = process.argv.find((arg) => arg.startsWith("--month="));
  const month = monthArg ? monthArg.slice("--month=".length) : currentMonth;
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new Error(
      `Invalid --month value: ${month}. Expected format YYYY-MM.`,
    );
  }
  const backfilled = month !== currentMonth;

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
    ...(backfilled ? { backfilled: true } : {}),
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
      nationalSharePct: region.nationalSharePct,
      nbMw: region.nbMw,
      pipelineMw: region.pipelineMw,
      mainTecnologia: region.mainTecnologia,
    })),
    tecnologias: data.technologyProfiles.map((technology) => ({
      nombre: technology.nombre,
      slug: technology.slug,
      erncMw: technology.erncMw,
      nationalSharePct: technology.nationalSharePct,
      pipelineMw: technology.pipelineMw,
      regiones: technology.regiones.map((region) => ({
        nombre: region.nombre,
        slug: region.slug,
        mw: region.mw,
      })),
    })),
    netBilling: {
      totalMw: data.totalNbMw,
      regiones: data.regionProfiles
        .filter((region) => region.nbMw !== null)
        .map((region) => ({
          nombre: region.nombre,
          slug: region.slug,
          mw: region.nbMw ?? 0,
        })),
    },
    pipeline: {
      totalMw: data.pipelineMwTotal,
      regiones: data.regionProfiles
        .filter((region) => region.pipelineMw !== null)
        .map((region) => ({
          nombre: region.nombre,
          slug: region.slug,
          mw: region.pipelineMw ?? 0,
        })),
      tecnologias: data.technologyProfiles
        .filter((technology) => technology.pipelineMw !== null)
        .map((technology) => ({
          nombre: technology.nombre,
          slug: technology.slug,
          mw: technology.pipelineMw ?? 0,
        })),
    },
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
    throw new Error(
      `Snapshot validation failed:\n${validated.error.toString()}`,
    );
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(validated.data, null, 2));
  console.log(
    backfilled
      ? `Snapshot written: ${outPath} (backfilled — reflects data fetched on ${now.toISOString()}, not true ${month} state)`
      : `Snapshot written: ${outPath}`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
