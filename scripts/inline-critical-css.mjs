import Critters from "critters";
import { readFileSync, writeFileSync } from "node:fs";
import { glob } from "glob";

const critters = new Critters({
  path: "out",
  publicPath: "/",
  logLevel: "warn",
  preload: "swap",
  pruneSource: true,
});

const htmlFiles = await glob("out/**/*.html");
let count = 0;

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const inlined = await critters.process(html);
  writeFileSync(file, inlined);
  count++;
}

console.log(`Inlined critical CSS into ${count} HTML files.`);
