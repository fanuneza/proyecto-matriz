import * as fs from "node:fs";
import * as path from "node:path";

const REQUIRED_FILES = [
  "out/index.html",
  "out/data/current/summary.json",
  "out/data/current/metadata.json",
  "out/data/downloads/regiones-current.csv",
  "out/data/downloads/tecnologias-current.csv",
  "out/data/downloads/matriz-current.csv",
];

const REQUIRED_ROUTE_VARIANTS = [["out/datos.html", "out/datos/index.html"]];

const FORBIDDEN_STRINGS = ["CNE_API_EMAIL", "CNE_API_PASSWORD", "Bearer ey"];

let errors = 0;

for (const file of REQUIRED_FILES) {
  if (!fs.existsSync(file)) {
    console.error(`MISSING: ${file}`);
    errors += 1;
  }
}

for (const variants of REQUIRED_ROUTE_VARIANTS) {
  if (!variants.some((file) => fs.existsSync(file))) {
    console.error(`MISSING: expected one of ${variants.join(" or ")}`);
    errors += 1;
  }
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }
    files.push(fullPath);
  }

  return files;
}

for (const file of walk("out/data")) {
  const content = fs.readFileSync(file, "utf-8");
  for (const forbidden of FORBIDDEN_STRINGS) {
    if (content.includes(forbidden)) {
      console.error(`SENSITIVE STRING "${forbidden}" found in ${file}`);
      errors += 1;
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} validation error(s). Fix before deploying.`);
  process.exit(1);
}

console.log("Output validation passed.");
