#!/usr/bin/env node
// Fixed versions, reusable cache, no install-time code execution.
"use strict";
const fs = require("fs"), path = require("path"), os = require("os"), crypto = require("crypto");
const sources = {
  d3: [["d3.v5.min.js", "https://cdn.jsdelivr.net/npm/d3@5.16.0/dist/d3.min.js"]],
  leaflet: ["leaflet.js", "leaflet.css", "images/layers.png", "images/layers-2x.png", "images/marker-icon.png"].map(file => ["leaflet/" + file, "https://unpkg.com/leaflet@1.9.4/dist/" + file])
};
async function main() {
  const args = process.argv.slice(2), target = args.shift();
  let renderer = "d3", cache = path.join(os.tmpdir(), "geographic-map-assets");
  while (args.length) {
    const flag = args.shift(), value = args.shift();
    if (!value || !["--renderer", "--cache"].includes(flag)) throw new Error("Usage: vendor-assets.js target [--renderer d3|leaflet] [--cache directory]");
    if (flag === "--renderer") renderer = value; else cache = value;
  }
  if (!target || !sources[renderer]) throw new Error("Supply target folder and d3/leaflet renderer");
  fs.mkdirSync(cache, {recursive: true});
  const indexPath = path.join(cache, "manifest.json");
  const index = fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath, "utf8")) : {};
  const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
  let hits = 0, downloads = 0;
  const assets = [];
  for (const [file, url] of sources[renderer]) {
    const key = hash(Buffer.from(url)), cached = path.join(cache, key);
    let bytes = fs.existsSync(cached) ? fs.readFileSync(cached) : null;
    if (!bytes || !index[key] || hash(bytes) !== index[key].sha256) {
      const response = await fetch(url, {signal: AbortSignal.timeout(30000)});
      if (!response.ok) throw new Error(`Download failed ${response.status}: ${url}`);
      bytes = Buffer.from(await response.arrayBuffer());
      if (!bytes.length || (file.endsWith(".js") && !bytes.toString("utf8").includes(renderer === "d3" ? "geoPath" : "Leaflet"))) throw new Error("Unexpected library payload: " + url);
      fs.writeFileSync(cached, bytes);
      index[key] = {url, sha256: hash(bytes)};
      fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
      downloads++;
    } else hits++;
    const destination = path.join(target, "vendor", file);
    fs.mkdirSync(path.dirname(destination), {recursive: true});
    fs.writeFileSync(destination, bytes);
    assets.push({file: "vendor/" + file, ...index[key]});
  }
  fs.writeFileSync(path.join(target, "vendor-manifest.json"), JSON.stringify({renderer, hits, downloads, assets}, null, 2) + "\n");
  console.log(JSON.stringify({renderer, hits, downloads}));
}
main().catch(error => {console.error(error.message); process.exitCode = 1;});
