#!/usr/bin/env node
// Bundle local script/style dependencies; runtime online tiles remain online.
"use strict";
const fs = require("fs"), path = require("path");
function bundle(input) {
  const base = path.dirname(path.resolve(input));
  const local = file => {
    if (/^(?:[a-z]+:|\/\/)/i.test(file)) throw new Error("Cannot inline remote asset: " + file);
    const resolved = path.resolve(base, file);
    if (!resolved.startsWith(base + path.sep)) throw new Error("Asset outside artifact folder: " + file);
    return resolved;
  };
  let html = fs.readFileSync(input, "utf8");
  html = html.replace(/<script\s+src=["']([^"']+)["']\s*><\/script>/gi, (_, file) => {
    const js = fs.readFileSync(local(file), "utf8").replace(/<\/script/gi, "<\\/script");
    return "<script>" + js + "</script>";
  });
  html = html.replace(/<link\s+rel=["']stylesheet["']\s+href=["']([^"']+)["']\s*\/?\s*>/gi, (_, file) => {
    const cssPath = local(file);
    const css = fs.readFileSync(cssPath, "utf8").replace(/url\(\s*["']?([^"')]+)["']?\s*\)/gi, (match, asset) => {
      if (asset.startsWith("data:") || asset.startsWith("#")) return match;
      const imagePath = local(path.relative(base, path.resolve(path.dirname(cssPath), asset)));
      const mime = path.extname(imagePath) === ".png" ? "image/png" : "image/svg+xml";
      return "url(data:" + mime + ";base64," + fs.readFileSync(imagePath).toString("base64") + ")";
    });
    return "<style>" + css.replace(/<\/style/gi, "<\\/style") + "</style>";
  });
  if (/<script[^>]+src=|<link[^>]+(?:rel=["']stylesheet|href=)/i.test(html)) throw new Error("Unresolved external script/style tags; use supplied templates");
  return html;
}
if (require.main === module) {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) throw new Error("Usage: bundle-html.js index.html standalone.html");
  if (path.resolve(input) === path.resolve(output)) throw new Error("Keep the folder entry; choose a separate output file");
  fs.writeFileSync(output, bundle(input));
  console.log("Bundled " + output + "; network classification is unchanged");
}
module.exports = {bundle};
