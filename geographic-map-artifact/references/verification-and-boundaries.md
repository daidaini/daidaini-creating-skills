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
