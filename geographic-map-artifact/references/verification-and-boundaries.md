# Verification and Boundaries

## Browser verification

Open the generated `index.html` in a real browser. Run checks appropriate to the selected mode and save `screenshot.png` if browser tooling is available.

Session rule: perform open, checks, and screenshot inside one browser session/script. Isolated script sessions may close between calls and reset the page to `about:blank`, silently invalidating later checks. Keep `eval` expressions single-line and self-contained; multi-line snippets can be truncated by argument tokenization.

### Route checks

```js
(() => ({
  leafletLoaded: !!window.L,
  routeCoordinateCount: window.ROUTE_DATA?.geometry?.coordinates?.length,
  mapPane: !!document.querySelector('.leaflet-map-pane'),
  svgPaths: document.querySelectorAll('svg path').length,
  markers: document.querySelectorAll('.leaflet-interactive').length,
  tiles: document.querySelectorAll('.leaflet-tile').length
}))()
```

Pass condition: Leaflet is loaded, the route has more than two coordinates, the map pane exists, and visible path/marker evidence is present. Require tiles only for an intentionally online-tile map.

### Choropleth checks

```js
(() => {
  const paths = [...document.querySelectorAll('svg path')];
  const first = paths.find(path => path.getBBox().width > 0 && path.getBBox().height > 0);
  return {
    d3: typeof window.d3,
    topojson: typeof window.topojson,
    mapsLoaded: !!window.MAPS,
    pathCount: paths.length,
    representativeBBox: first && first.getBBox()
  };
})()
```

Pass condition: D3/data are loaded, the expected region paths exist, a representative path has a map-sized non-zero bounding box, and at least two data-bearing regions visibly use different fills.

### Composite checks

Give generated region, route, and point elements stable classes such as `.map-region`, `.map-route`, and `.map-point`, then run:

```js
(() => ({
  d3: typeof window.d3,
  dataLoaded: !!window.MAP_DATA,
  regions: document.querySelectorAll('.map-region').length,
  routes: document.querySelectorAll('.map-route').length,
  points: document.querySelectorAll('.map-point').length,
  visibleRegionBBox: document.querySelector('.map-region')?.getBBox(),
  visibleRouteBBox: document.querySelector('.map-route')?.getBBox()
}))()
```

Pass condition: data is loaded; every requested layer is represented; region and route bboxes are non-zero; and route/point overlays visually align with the region map. Verify a high-value and low-value region have different fill colors.

### Common failure: identical bboxes across all regions

Symptom: every region path reports the **same** `getBBox()`, the value is far outside the viewBox (e.g. `{x: -21627, w: 26389}`), `fitExtent` computes an absurdly small `scale` (tens instead of thousands), and the map renders as one undifferentiated rectangle.

Diagnose in this order — the first four are usually **red herrings**:

1. Coordinate nesting depth — a `MultiPolygon` reaching a number at depth 3 is **correct** (`[poly][ring][point][lon,lat]`), not a bug. Do not "fix" it.
2. Out-of-range or non-finite source coordinates — scan all points; if they sit inside the expected lon/lat envelope, the data is fine.
3. Corrupted library file — check byte size and presence of `geoPath`/`geoMercator` symbols before blaming D3.
4. `geoPath.projection()` binding — read it back (`gp.projection() === proj`); it is almost always bound correctly.
5. **Real cause**: sample the rendered path with `element.getPointAtLength()` at 0 %, 10 %, … 100 %. If points past the first 10 % jump to `±20000`, the bug is in `d3.geoPath`'s spherical stream handling: it projects the ring's closing edge to the ±180° antimeridian, producing a segment spanning the globe. A telltale constant is the mercator x at longitude ±180° (`≈ ±21626` at scale 4200, i.e. `π × scale`).

**Fix**: stop using `d3.geoPath()` for this dataset and project the rings manually, concatenating the SVG path string:

```js
function geoToPath(geometry, projection) {
  var polys = geometry.type === "MultiPolygon" ? geometry.coordinates : [geometry.coordinates];
  var d = "";
  polys.forEach(function (poly) {
    poly.forEach(function (ring) {
      ring.forEach(function (pt, i) {
        var xy = projection(pt);
        d += (i === 0 ? "M" : "L") + xy[0].toFixed(2) + "," + xy[1].toFixed(2);
      });
      d += "Z";
    });
  });
  return d;
}
```

Verify the fix by re-running the choropleth checks: bboxes must now be map-sized, non-zero, and **different per region**.

Related traps found alongside this bug:

- **Name mismatch between datasets**: boundary data may use `杭州市` while a scoring dataset uses `杭州`. Normalize (`.replace(/市$/, "")`) on both sides before joining, or every region silently falls back to the "no data" fill and the whole map renders grey while path counts still pass.
- **`getBBox()` returns an `SVGRect`**, whose properties are non-enumerable — `JSON.stringify` yields `{}`. Copy `.x/.y/.width/.height` into a plain object before serializing.
- **`fitExtent`/`fitSize` untrustworthy when the stream is broken**: pick `scale` by measuring the projected extent of all rings and dividing by the target box, then hand-tune `center`/`translate`. A ~4.8°-wide province landing in 780×620 took `scale ≈ 6900`.

### Network check for offline claims

For `choropleth` and offline `composite`, inspect browser network activity after load. There must be no remote requests for libraries, data, fonts, tiles, or image assets. If network instrumentation is unavailable, do not claim the check passed; state it as unavailable.

## KML verification

When route KML is requested, parse the result as XML and confirm:

- exactly one route `LineString` unless multiple routes were requested;
- expected point placemarks;
- coordinate text in `lon,lat` order;
- no XML parse errors.

## Data and publication boundaries

- A static demo, internal analysis, and regulated public map are different products. This skill covers the first two only.
- Natural Earth and similar datasets can show de facto borders; do not use them as an official PRC public-facing base map. Public publishing in China can require authoritative data and map review.
- Do not imply routing accuracy from a hand-authored or sparse polyline. Label it synthetic or illustrative.
- Do not accept a “county-level” request with country/province-scale source data. Obtain an appropriate authoritative dataset or decline the precision claim.
- Keep source attribution and date in the README. If values are estimates, say so.
