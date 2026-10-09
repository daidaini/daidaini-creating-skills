#!/usr/bin/env node
// Validate a map payload; normalize regional winding on a copy, never the source.
"use strict";
const fs = require("fs");

function prepare(input) {
  const data = structuredClone(input);
  const errors = [], warnings = [];
  const meta = data.meta || {};
  if (meta.coordinateSystem !== "WGS84") errors.push("Declare meta.coordinateSystem=WGS84 and verify its source; numeric ranges cannot prove CRS");
  if (!meta.source || !meta.date) errors.push("Declare meta.source and meta.date");
  if (typeof meta.synthetic !== "boolean") errors.push("Declare meta.synthetic true/false");
  if (meta.ringConvention && !["regional", "d3"].includes(meta.ringConvention)) errors.push("ringConvention must be regional or d3");
  const features = data.regions?.features || [];
  if (data.regions && (data.regions.type !== "FeatureCollection" || !Array.isArray(data.regions.features))) errors.push("regions must be a GeoJSON FeatureCollection");
  const routes = data.routes || [], points = data.points || [];
  if (!Array.isArray(routes) || !Array.isArray(points)) throw new Error("routes/points must be arrays");
  if (!features.length && !routes.length && !points.length) errors.push("No map layers supplied");
  const values = data.values || {};
  if (typeof values !== "object" || Array.isArray(values) || values === null) throw new Error("values must be an object");
  const extent = [Infinity, Infinity, -Infinity, -Infinity];
  const coordinate = (p, label) => {
    if (!Array.isArray(p) || p.length < 2 || !p.slice(0, 2).every(Number.isFinite) || Math.abs(p[0]) > 180 || Math.abs(p[1]) > 90) {
      errors.push(label + ": invalid [lon,lat]"); return false;
    }
    extent[0] = Math.min(extent[0], p[0]); extent[1] = Math.min(extent[1], p[1]);
    extent[2] = Math.max(extent[2], p[0]); extent[3] = Math.max(extent[3], p[1]);
    return true;
  };
  const same = (a, b) => a[0] === b[0] && a[1] === b[1];
  let reversedRings = 0;
  const keys = new Set();
  let matched = 0, missing = 0;
  for (const [i, feature] of features.entries()) {
    const key = feature.properties?.[data.valueProperty];
    if (key == null || !["string", "number"].includes(typeof key) || String(key) === "") errors.push(`region ${i}: missing stable valueProperty key`);
    else if (keys.has(String(key))) errors.push(`region ${i}: duplicate key ${key}`);
    else keys.add(String(key));
    const value = Object.hasOwn(values, key) ? values[key] : null;
    if (value == null) missing++;
    else if (!Number.isFinite(value)) errors.push(`region ${key}: non-finite numeric value`);
    else matched++;
    const g = feature.geometry;
    if (feature.type !== "Feature" || !g || !["Polygon", "MultiPolygon"].includes(g.type)) { errors.push(`region ${i}: expected Polygon/MultiPolygon feature`); continue; }
    const polygons = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
    if (!Array.isArray(polygons) || !polygons.length) { errors.push(`region ${i}: empty polygon`); continue; }
    for (const polygon of polygons) {
      if (!Array.isArray(polygon) || !polygon.length) { errors.push(`region ${i}: empty rings`); continue; }
      for (const [hole, ring] of polygon.entries()) {
        const label = `region ${i} ring ${hole}`;
        if (!Array.isArray(ring) || ring.length < 4) { errors.push(label + ": need four closed positions"); continue; }
        if (!ring.map(p => coordinate(p, label)).every(Boolean)) continue;
        if (!same(ring[0], ring[ring.length - 1])) { errors.push(label + ": ring not closed"); continue; }
        if (meta.ringConvention === "d3") continue; // Explicitly preprocessed spherical data.
        const bounds = ring.reduce((b,p) => [Math.min(b[0],p[0]),Math.min(b[1],p[1]),Math.max(b[2],p[0]),Math.max(b[3],p[1])], [Infinity,Infinity,-Infinity,-Infinity]);
        if (bounds[2] - bounds[0] >= 180 || bounds[3] - bounds[1] >= 90 || ring.some(p => Math.abs(p[1]) === 90)) {
          errors.push(label + ": unsupported spherical extent; preprocess and declare ringConvention=d3"); continue;
        }
        let area = 0;
        for (let j = 1; j < ring.length; j++) area += ring[j - 1][0] * ring[j][1] - ring[j][0] * ring[j - 1][1];
        if (Math.abs(area) < 1e-12) { errors.push(label + ": degenerate ring"); continue; }
        if ((hole === 0 && area > 0) || (hole > 0 && area < 0)) { ring.reverse(); reversedRings++; }
      }
    }
  }
  const unusedValues = Object.keys(values).filter(k => !keys.has(k));
  if (unusedValues.length) errors.push("Unmatched value keys: " + unusedValues.join(", "));
  if (missing) warnings.push(`${missing} regions have no data; render neutral fill`);
  for (const [i, route] of routes.entries()) {
    const g = route.geometry;
    if (!g || !["LineString", "MultiLineString"].includes(g.type)) { errors.push(`route ${i}: expected LineString/MultiLineString`); continue; }
    const lines = g.type === "LineString" ? [g.coordinates] : g.coordinates;
    if (!Array.isArray(lines) || !lines.length) { errors.push(`route ${i}: empty geometry`); continue; }
    for (const line of lines) {
      if (!Array.isArray(line) || line.length < 2) { errors.push(`route ${i}: need two positions`); continue; }
      if (line.map(p => coordinate(p, `route ${i}`)).every(Boolean) && !line.some(p => !same(p, line[0]))) errors.push(`route ${i}: identical positions`);
    }
    for (const field of ["distanceMeters", "durationSeconds"]) {
      if (route[field] != null && (!Number.isFinite(route[field]) || route[field] < 0)) errors.push(`route ${i}: invalid ${field}`);
    }
  }
  for (const [i, point] of points.entries()) coordinate(point.coordinates, `point ${i}`);
  data.regions = {type: "FeatureCollection", features};
  data.routes = routes; data.points = points; data.values = values;
  data.meta = {...meta, ringConvention: "d3"};
  const report = {passed: !errors.length, counts: {regions: features.length, routes: routes.length, points: points.length}, matched, missing, unusedValues, reversedRings, extent: extent.every(Number.isFinite) ? extent : null, errors, warnings};
  return {data, report};
}

if (require.main === module) {
  const args = process.argv.slice(2), file = args.shift();
  let out, reportPath;
  while (args.length) {
    const flag = args.shift(), value = args.shift();
    if (!value || !["--out", "--report"].includes(flag)) throw new Error("Usage: preflight.js input.json [--out data.js] [--report preflight.json]");
    if (flag === "--out") out = value; else reportPath = value;
  }
  if (!file) throw new Error("Supply a map-payload JSON file");
  for (const target of [out, reportPath].filter(Boolean)) if (require("path").resolve(target) === require("path").resolve(file)) throw new Error("Never overwrite source JSON");
  const result = prepare(JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "")));
  const text = JSON.stringify(result.report, null, 2) + "\n";
  if (reportPath) fs.writeFileSync(reportPath, text);
  console.log(text);
  if (!result.report.passed) process.exitCode = 1;
  else if (out) fs.writeFileSync(out, "window.MAP_DATA=" + JSON.stringify(result.data) + ";\n");
}
module.exports = {prepare};
