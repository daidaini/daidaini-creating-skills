#!/usr/bin/env node
/*
 * build-data.js — pack TopoJSON/GeoJSON files into one `window.MAPS = {...}` JS file.
 *
 * Why: D3's d3.json() uses fetch(), which is blocked by CORS on file://.
 * Inlining data as a JS variable loaded via <script src> sidesteps that,
 * so the resulting index.html opens by double-click with no server.
 *
 * Usage (run from the directory that will hold data.js):
 *   node build-data.js [file[:alias] ...] [-o out.js]
 *
 *   - file[:alias] : a .json path, optionally renamed in the MAPS object via :alias.
 *                   e.g. data/zh-mainland-provinces.topo.json:mainland
 *   - -o out.js    : output file (default: data.js)
 *
 * If no positional args are given, scans ./data/*.json and uses each filename
 * (minus extension, non-word chars -> _) as its key.
 *
 * Each packed value is the parsed JSON as-is. For TopoJSON the template will call
 * topojson.feature(topo, topo.objects.<OBJECT_NAME>); figure out <OBJECT_NAME>
 * by inspecting the file (see references/workflow.md "Inspecting data").
 */
"use strict";
const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const files = [];
  let out = "data.js";
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-o" || a === "--out") out = argv[++i];
    else if (a === "-h" || a === "--help") { files.push("__help__"); }
    else files.push(a);
  }
  return { files, out };
}

function defaultFiles() {
  const dir = "data";
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => /\.json$/i.test(f))
    .map(f => path.join(dir, f));
}

function splitAlias(fileArg) {
  const idx = fileArg.indexOf(":");
  if (idx <= 0) return { file: fileArg, alias: null };          // no ':' or starts with ':'
  // allow Windows drive letters (e.g. "E:/x.json:alias") — only treat last ':' after a path sep
  const lastSep = Math.max(fileArg.lastIndexOf("/"), fileArg.lastIndexOf("\\"));
  const colonAfterSep = fileArg.indexOf(":", lastSep + 1);
  if (colonAfterSep === -1) return { file: fileArg, alias: null };
  return { file: fileArg.slice(0, colonAfterSep), alias: fileArg.slice(colonAfterSep + 1) };
}

function keyFor(fileArg, fallbackBasename) {
  const { alias } = splitAlias(fileArg);
  if (alias) return alias;
  return fallbackBasename
    .replace(/\.(topo|geo)?\.json$/i, "")
    .replace(/[^A-Za-z0-9]/g, "_");
}

const { files: fileArgs, out } = parseArgs(process.argv.slice(2));
if (fileArgs.includes("__help__")) {
  console.error(fs.readFileSync(__filename, "utf8").split("\n").slice(1, 28).join("\n"));
  process.exit(0);
}
const files = fileArgs.length ? fileArgs : defaultFiles();
if (!files.length) {
  console.error("No input files. Put *.json in ./data/ or pass file[:alias] args.");
  console.error("See header: node build-data.js --help");
  process.exit(1);
}

const maps = {};
for (const fa of files) {
  const { file } = splitAlias(fa);
  if (!fs.existsSync(file)) { console.error("missing:", file); process.exit(1); }
  const key = keyFor(fa, path.basename(file));
  const obj = JSON.parse(fs.readFileSync(file, "utf8"));
  maps[key] = obj;
  const objs = Object.keys(obj.objects || {});
  const geomInfo = objs.length
    ? objs.map(o => `${o}(${(obj.objects[o].geometries || []).length})`).join(",")
    : "geojson";
  console.error(`packed ${key} <- ${file} | type=${obj.type} ${geomInfo}`);
}
fs.writeFileSync(out, "window.MAPS=" + JSON.stringify(maps) + ";\n");
console.error(`wrote ${out} (${fs.statSync(out).size} bytes)`);