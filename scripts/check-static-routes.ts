import * as fs from "node:fs";
import { listSnapshots } from "../lib/snapshots";

const EXPECTED_FILES = ["out/index.html", "out/robots.txt", "out/sitemap.xml"];
const EXPECTED_ROUTE_VARIANTS = [
  ["out/datos.html", "out/datos/index.html"],
  ["out/regiones.html", "out/regiones/index.html"],
  ["out/regiones/antofagasta.html", "out/regiones/antofagasta/index.html"],
  ["out/regiones/metropolitana.html", "out/regiones/metropolitana/index.html"],
  ["out/tecnologias.html", "out/tecnologias/index.html"],
  ["out/tecnologias/solar.html", "out/tecnologias/solar/index.html"],
  ["out/comparar.html", "out/comparar/index.html"],
  ["out/archivo.html", "out/archivo/index.html"],
];

let errors = 0;

for (const route of EXPECTED_FILES) {
  if (!fs.existsSync(route)) {
    console.error(`MISSING ROUTE: ${route}`);
    errors += 1;
  }
}

for (const variants of EXPECTED_ROUTE_VARIANTS) {
  if (!variants.some((route) => fs.existsSync(route))) {
    console.error(`MISSING ROUTE: expected one of ${variants.join(" or ")}`);
    errors += 1;
  }
}

for (const month of listSnapshots()) {
  const variants = [`out/archivo/${month}.html`, `out/archivo/${month}/index.html`];
  if (!variants.some((route) => fs.existsSync(route))) {
    console.error(`MISSING ROUTE: expected one of ${variants.join(" or ")}`);
    errors += 1;
  }
}

if (errors > 0) {
  console.error(`\n${errors} missing route(s).`);
  process.exit(1);
}

console.log("Static route check passed.");
