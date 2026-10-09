#!/usr/bin/env node
// Real Chromium fixture runs; no model-executed quality or token benchmark claims.
"use strict";
const fs = require("fs"), path = require("path"), assert = require("assert/strict");
const {pathToFileURL} = require("url"), {execFileSync} = require("child_process");
const {performance} = require("perf_hooks");
const {prepare} = require("../scripts/preflight.js"), {bundle} = require("../scripts/bundle-html.js");
async function main() {
  const [output, playwrightPath, browserPath] = process.argv.slice(2);
  if (!output || !playwrightPath || !browserPath) throw new Error("Usage: run_browser_eval.js output-dir playwright-module-path chrome-or-chromium-path");
  const {chromium} = require(path.resolve(playwrightPath));
  fs.mkdirSync(output, {recursive: true});
  const root = path.resolve(__dirname, ".."), cache = path.join(output, "cache");
  const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/regional.json"), "utf8"));
  const browser = await chromium.launch({executablePath: browserPath, headless: true});
  const report = {kind: "real-browser-synthetic-fixtures", browser: browser.version(), cases: [], assetCache: [], baseline: "missing evidence: no end-to-end model baseline/token measurements"};
  try {
    const variants = [
      ["route-leaflet", "leaflet", d => {delete d.regions;delete d.values;delete d.valueProperty;}],
      ["choropleth-d3", "d3", d => {d.routes=[];d.points=[];}],
      ["composite-d3", "d3", () => {}],
      ["points-with-regions-d3", "d3", d => {d.routes=[];}],
      ["same-values-d3", "d3", d => {d.values={A:5,B:5,C:5};}],
      ["point-only-d3", "d3", d => {delete d.regions;delete d.values;delete d.valueProperty;d.routes=[];d.points=[d.points[0]];}],
      ["composite-leaflet", "leaflet", () => {}]
    ];
    for (const [name, renderer, change] of variants) {
      const started = performance.now(), dir = path.join(output, name);
      fs.mkdirSync(dir, {recursive: true});
      const input = structuredClone(fixture);change(input);
      const {data, report: preflight} = prepare(input);assert.equal(preflight.passed,true);
      fs.writeFileSync(path.join(dir,"input.json"),JSON.stringify(input,null,2));
      fs.writeFileSync(path.join(dir,"preflight.json"),JSON.stringify(preflight,null,2));
      fs.writeFileSync(path.join(dir,"data.js"),"window.MAP_DATA="+JSON.stringify(data)+";\n");
      const vendorStarted=performance.now();
      const vendor=JSON.parse(execFileSync(process.execPath,[path.join(root,"scripts/vendor-assets.js"),dir,"--renderer",renderer,"--cache",cache],{encoding:"utf8"}));
      report.assetCache.push({name,...vendor,milliseconds:Math.round(performance.now()-vendorStarted)});
      fs.copyFileSync(path.join(root,"assets",renderer+"-map.html"),path.join(dir,"index.html"));
      fs.writeFileSync(path.join(dir,"standalone.html"),bundle(path.join(dir,"index.html")));
      const isolated = path.join(dir,"isolated");fs.mkdirSync(isolated,{recursive:true});fs.copyFileSync(path.join(dir,"standalone.html"),path.join(isolated,"standalone.html"));
      fs.writeFileSync(path.join(dir,"README.md"),"# "+name+"\nSynthetic fixture; WGS84; source date 2026-10-09.\nOpen index.html with its vendor/data files or standalone.html alone. Fully offline vector map.\nBrowser results are recorded in browser-eval-report.json in the run root.\n");
      for (const file of ["index.html","standalone.html"]) {
        const context=await browser.newContext({viewport:{width:1100,height:800}}),page=await context.newPage();
        const errors=[],remote=[];
        page.on("pageerror",e=>errors.push(e.message));
        page.on("console",m=>{if(m.type()==="error")errors.push(m.text());});
        await context.route(/^https?:\/\//,route=>{remote.push(route.request().url());return route.abort();});
        await page.goto(pathToFileURL(path.resolve(file==="standalone.html"?isolated:dir,file)).href);
        await page.waitForFunction(()=>!!window.MAP_RENDER);
        const actual=await page.evaluate(()=>{
          const count=className=>document.querySelectorAll('.'+className).length;
          const geometry=[...document.querySelectorAll('.map-region,.map-route,.map-point')].map(el=>{const b=el.getBBox();return {x:b.x,y:b.y,width:b.width,height:b.height,d:el.getAttribute('d')};});
          const fills=[...document.querySelectorAll('.map-region')].map(el=>getComputedStyle(el).fill);
          const spherical=window.d3&&window.MAP_DATA.regions.features.length?{area:d3.geoArea(MAP_DATA.regions.features[0]),hole:d3.geoContains(MAP_DATA.regions.features[0],[120.3,30.3]),inside:d3.geoContains(MAP_DATA.regions.features[0],[120.5,30.5])}:null;
          return {counts:{regions:count('map-region'),routes:count('map-route'),points:count('map-point')},geometry,fills,spherical,alert:document.querySelector('#error').textContent};
        });
        assert.deepEqual(actual.counts,preflight.counts);assert.equal(actual.alert,"");
        for(const g of actual.geometry){assert.ok([g.x,g.y,g.width,g.height].every(Number.isFinite));if(g.d)assert.ok(!/NaN|Infinity/.test(g.d));}
        if(actual.spherical){assert.ok(actual.spherical.area<1);assert.equal(actual.spherical.hole,false);assert.equal(actual.spherical.inside,true);}
        if(data.regions.features.length&&name!=="same-values-d3") {assert.notEqual(actual.fills[0],actual.fills[1]);assert.notEqual(actual.fills[0],actual.fills[2]);assert.equal(actual.fills[2],"rgb(209, 213, 219)");}
        if(name==="same-values-d3")assert.equal(new Set(actual.fills).size,1);
        if(renderer==="leaflet") {
          if(actual.counts.routes){await page.locator('.map-route').first().click({force:true});await page.waitForSelector('.leaflet-popup');await page.locator('.leaflet-popup-close-button').click();await page.waitForSelector('.leaflet-popup',{state:'detached'});}
          if(actual.counts.points){await page.locator('.map-point').first().click({force:true});await page.waitForSelector('.leaflet-popup');await page.locator('.leaflet-popup-close-button').click();await page.waitForSelector('.leaflet-popup',{state:'detached'});}
          await page.evaluate(()=>{window.MAP_ZOOM_DONE=false;MAP_RENDER.map.once('zoomend',()=>{window.MAP_ZOOM_DONE=true;});});
          await page.locator('.leaflet-control-zoom-in').click();
          await page.waitForFunction(()=>window.MAP_ZOOM_DONE);
          await page.evaluate(()=>MAP_RENDER.map.fitBounds(MAP_RENDER.bounds,{padding:[24,24],animate:false}));
        } else if(actual.counts.regions) assert.ok(await page.locator('.map-region title').first().textContent());
        await page.screenshot({path:path.join(dir,file.replace('.html','')+'-desktop.png'),fullPage:true});
        await page.setViewportSize({width:390,height:844});
        if(renderer==="leaflet") {
          await page.evaluate(()=>MAP_RENDER.map.invalidateSize());
          await page.waitForFunction(()=>MAP_RENDER.map.getBounds().contains(MAP_RENDER.bounds));
        }
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),"Mobile overflow");
        await page.screenshot({path:path.join(dir,file.replace('.html','')+'-mobile.png'),fullPage:true});
        await page.reload();await page.waitForFunction(()=>!!window.MAP_RENDER);
        assert.deepEqual(errors,[]);assert.deepEqual(remote,[]);
        report.cases.push({name,file,passed:true,counts:actual.counts,consoleErrors:errors,remoteRequests:remote,mobileWidth:390,screenshot:path.join(dir,file.replace('.html','')+'-desktop.png')});
        await context.close();
      }
      console.log("PASS "+name+" (folder + standalone); "+Math.round(performance.now()-started)+" ms");
    }
    report.passed=true;
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(output,"browser-eval-report.json"),JSON.stringify(report,null,2)+"\n");
  }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
