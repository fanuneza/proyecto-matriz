import Critters from "critters";
import { readFileSync, writeFileSync } from "node:fs";
import { glob } from "glob";

const critters = new Critters({
  path: "out",
  publicPath: "/",
  logLevel: "warn",
  // "body" moves the pruned stylesheet links to the end of <body>.
  // "swap"/"media" add inline onload handlers, which our CSP
  // (script-src-attr 'none') blocks, logging console errors and
  // failing Lighthouse Best Practices.
  preload: "body",
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
