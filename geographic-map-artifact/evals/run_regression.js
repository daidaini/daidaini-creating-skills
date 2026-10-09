#!/usr/bin/env node
"use strict";
const fs = require("fs"), path = require("path"), assert = require("assert/strict");
const {prepare} = require("../scripts/preflight.js");
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/regional.json"), "utf8"));
let passed = 0;
function check(name, fn) {fn();passed++;console.log("PASS " + name);}
function changed(fn) {const data = structuredClone(fixture);fn(data);return prepare(data);}
check("zero/missing values and horizontal two-point route", () => {
  const {report} = prepare(fixture);assert.equal(report.passed,true);assert.equal(report.matched,2);assert.equal(report.missing,1);assert.deepEqual(report.counts,{regions:3,routes:1,points:2});
});
check("winding copy preserves source and polygon hole", () => {
  const before = JSON.stringify(fixture), {data,report} = prepare(fixture);
  assert.equal(report.reversedRings,4);assert.equal(JSON.stringify(fixture),before);
  const rings=data.regions.features[0].geometry.coordinates;
  const area=r=>r.slice(1).reduce((s,p,i)=>s+r[i][0]*p[1]-p[0]*r[i][1],0);
  assert.ok(area(rings[0])<0);assert.ok(area(rings[1])>0);
  assert.equal(prepare(data).report.reversedRings,0);
});
check("duplicate region key fails", () => assert.equal(changed(d=>d.regions.features[1].properties.code="A").report.passed,false));
check("unmatched metric key fails", () => assert.equal(changed(d=>d.values.Z=1).report.passed,false));
check("numeric strings fail", () => assert.equal(changed(d=>d.values.A="0").report.passed,false));
check("unknown coordinate system fails", () => assert.equal(changed(d=>d.meta.coordinateSystem="GCJ-02").report.passed,false));
check("unclosed ring fails", () => assert.equal(changed(d=>d.regions.features[0].geometry.coordinates[0].pop()).report.passed,false));
check("antimeridian requires specialist preparation", () => assert.equal(changed(d=>d.regions.features[1].geometry.coordinates=[[[179,30],[-179,30],[-179,31],[179,31],[179,30]]]).report.passed,false));
check("invalid coordinate fails", () => assert.equal(changed(d=>d.points[0].coordinates=[120,91]).report.passed,false));
check("identical route points fail", () => assert.equal(changed(d=>d.routes[0].geometry.coordinates=[[120,30],[120,30]]).report.passed,false));
check("equal values are valid", () => assert.equal(changed(d=>d.values={A:5,B:5,C:5}).report.passed,true));
check("regions with points but no routes are valid", () => assert.equal(changed(d=>d.routes=[]).report.passed,true));
check("route-only payload is valid", () => assert.equal(changed(d=>{delete d.regions;delete d.values;delete d.valueProperty;}).report.passed,true));
check("missing metrics are not invented", () => assert.equal(changed(d=>delete d.values).report.missing,3));
console.log(JSON.stringify({passed,total:passed,kind:"deterministic-regression"}));
