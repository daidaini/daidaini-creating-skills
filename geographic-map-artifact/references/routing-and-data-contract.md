# Routing and Data Contract

## Layers and renderer are separate decisions

- `route`: lines/stops, or standalone point locations; optional distance/duration and KML.
- `choropleth`: boundaries colored by a metric.
- `composite`: regions plus routes and/or points.
- D3 defaults for offline reports/custom projections; Leaflet defaults for interactive route browsing. Leaflet also supports choropleths/composites with GeoJSON. Offline Leaflet needs no tiles when a vector-only view meets the request.
- Live navigation/traffic, address search, POI and production GIS are outside scope.

Consult `../../leaflet-route-map/references/workflow.md` for route sources/KML, or `../../d3-offline-map/references/workflow.md` for boundary sources/TopoJSON. Prefer the generic templates over adapting the China-specific example.

## Shared payload (input.json)

```json
{
  "meta": {
    "title": "Regional coverage",
    "source": "User-supplied data",
    "date": "2026-10-09",
    "coordinateSystem": "WGS84",
    "synthetic": false,
    "ringConvention": "regional",
    "metric": "Coverage"
  },
  "valueProperty": "code",
  "regions": {
    "type": "FeatureCollection",
    "features": []
  },
  "values": {"A": 0, "B": 47, "C": null},
  "routes": [{
    "id": "r1", "name": "Delivery", "color": "#e76f51",
    "geometry": {"type": "LineString", "coordinates": [[120,30],[121,31]]}
  }],
  "points": [{"id": "p1", "name": "Depot", "coordinates": [120,30]}]
}
```

Replace empty features with real Polygon/MultiPolygon features if regions are requested. Routes/points/regions are optional, but at least one nonempty layer is required. A pure route/point payload can omit regions/values/valueProperty.

- All coordinates are `[lon,lat]`. Require known WGS84 provenance; the declaration is not automatic CRS verification. Transform GCJ-02/projected data beforehand.
- Convert TopoJSON using `topojson.feature` before preflight. Select requested features and inspect object/property names.
- `valueProperty` names a stable, unique region property. `values` keys match it exactly; missing/null is no-data, numeric zero is valid. Extra unmatched keys fail rather than silently disappearing. Aliases require an explicit collision-checked mapping.
- Routes are LineString/MultiLineString with at least two distinct positions per line. Supplied distanceMeters/durationSeconds must be finite and nonnegative; omit unknown statistics. These fields do not establish road-routing accuracy.
- `ringConvention=regional` (default): adapt ordinary, nonpolar local rings to D3 clockwise exteriors/counterclockwise holes on a copy. Rings spanning 180? longitude, 90? latitude, or touching poles are rejected for specialist preparation. This is not a topology/self-intersection validator.
- `ringConvention=d3`: explicitly preprocessed spherical geometry; preserve winding. The agent must verify spherical area, holes and clipping, particularly for antimeridian/hemisphere-scale data. Do not use the flag merely to suppress an error.
- `meta.basemap="osm"` enables online tiles in the Leaflet template. Without it, Leaflet is a local vector view. D3 does not add tiles.

## Render and package

Draw region fill/strokes, then routes, then points and labels. Share one projection across D3 layers. Fit the union of requested layers so an outlying stop is not accidentally excluded. Check source extent for accidental far-away coordinates before fitting.

Use `vendor-assets.js` with Node 18+; fixed D3 5.16.0 / Leaflet 1.9.4 files are reused from an OS temporary cache, or an explicit `--cache directory`. Cached bytes are checked against recorded SHA-256; this detects cache corruption, not independent supply-chain authenticity. No network is needed on a valid cache hit. No CDN is referenced at runtime.

Default delivery is a **folder**, not a single file. `bundle-html.js` inlines local script/style dependencies of the supplied templates only; online tile calls remain online. A local tile server requires a running service and cannot be described as server-free. Do not bulk-download OSM public tiles; use an offline-permitted source when tiles are actually needed.
