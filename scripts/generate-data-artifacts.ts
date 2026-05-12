import * as fs from "node:fs";
import * as path from "node:path";
import "./load-next-env";
import { toCsv } from "../lib/export-csv";

async function main() {
  const { getStoryData } = await import("../lib/story-data");
  const data = await getStoryData();

  for (const dir of [
    "public/data/current",
    "public/data/downloads",
    "public/data/snapshots",
  ]) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const summary = {
    totalErncMw: data.totalErncMw,
    porcentajeErnc: data.porcentajeErnc,
    totalNbMw: data.totalNbMw,
    pipelineMwTotal: data.pipelineMwTotal,
    erncCount: data.erncCount,
  };

  fs.writeFileSync("public/data/current/summary.json", JSON.stringify(summary, null, 2));
  fs.writeFileSync(
    "public/data/current/metadata.json",
    JSON.stringify(data.metadata, null, 2),
  );
  fs.writeFileSync(
    "public/data/downloads/regiones-current.csv",
    toCsv(
      ["region", "mw"],
      data.regiones.map((region) => ({ region: region.label, mw: region.value })),
    ),
  );
  fs.writeFileSync(
    "public/data/downloads/tecnologias-current.csv",
    toCsv(
      ["tecnologia", "mw"],
      data.tecnologias.map((technology) => ({
        tecnologia: technology.label,
        mw: technology.value,
      })),
    ),
  );
  fs.writeFileSync(
    "public/data/downloads/matriz-current.csv",
    toCsv(
      ["campo", "valor"],
      [
        { campo: "total_ernc_mw", valor: data.totalErncMw },
        { campo: "porcentaje_ernc", valor: data.porcentajeErnc.toFixed(2) },
        { campo: "total_nb_mw", valor: data.totalNbMw },
        { campo: "pipeline_mw_total", valor: data.pipelineMwTotal },
        { campo: "ernc_count", valor: data.erncCount },
      ],
    ),
  );

  const snapshotsDir = path.join(process.cwd(), "data/snapshots");
  if (fs.existsSync(snapshotsDir)) {
    for (const file of fs.readdirSync(snapshotsDir)) {
      if (!/^\d{4}-\d{2}\.json$/.test(file)) {
        continue;
      }
      fs.copyFileSync(
        path.join(snapshotsDir, file),
        path.join(process.cwd(), "public/data/snapshots", file),
      );
    }
  }

  console.log("Data artifacts generated successfully.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
