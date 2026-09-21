# Routing and Data Contract

## Choose one rendering mode

| Signal in the request | Use | Do not use |
|---|---|---|
| Route, itinerary, delivery path, stops, distance, KML/My Maps | `route` | D3 choropleth unless region analysis is also required |
| Province/country/administrative areas colored by a metric; must open offline | `choropleth` | Leaflet tile map |
| Colored regions plus routes, lines, stops, branches, or facilities | `composite` | Leaflet by default; choose it only when an online tile-map experience is more important than full offline operation |
| Address search, traffic, live navigation, real-time route calculation | out of scope | all three modes |

For `route`, follow the sibling package `../../leaflet-route-map/`. For `choropleth`, follow `../../d3-offline-map/`. This package owns selection, the shared contract, and the composite workflow; it deliberately does not duplicate their scripts or templates.

## Shared coordinate rule

All source and packed geography uses standard GeoJSON order:

```text
[longitude, latitude]
```

This applies to GeoJSON, OSRM geometry, KML coordinates, D3 input, and `window.MAP_DATA`.

Only Leaflet rendering accepts the reversed order:

```js
const toLeafletLatLng = ([lon, lat]) => [lat, lon];
```

Never mutate stored route or point coordinates to Leaflet order. Convert at rendering time only.

## Composite payload

For a D3 composite map, create a local JavaScript file loaded before the rendering script:

```js
window.MAP_DATA = {
  meta: {
    title: "Regional coverage and delivery route",
    source: "Supplied internal data",
    offline: true
  },
  regions: {
    type: "FeatureCollection",
    features: []
  },
  valueProperty: "name",
  values: {
    "Region A": 92,
    "Region B": 47
  },
  routes: [
    {
      id: "delivery-01",
      name: "Delivery route",
      color: "#2563eb",
      geometry: {
        type: "LineString",
        coordinates: [[121.47, 31.23], [120.15, 30.28]]
      }
    }
  ],
  points: [
    {
      id: "shanghai",
      name: "Shanghai depot",
      kind: "start",
      coordinates: [121.47, 31.23]
    }
  ]
};
```

Requirements:

- `regions` must be a GeoJSON `FeatureCollection` by the time rendering begins. Convert TopoJSON with `topojson.feature(...)` during preprocessing or at the top of the page.
- `valueProperty` names the region feature property used as a `values` key.
- `routes[].geometry` must be GeoJSON `LineString` or `MultiLineString`.
- `points[].coordinates` is `[lon, lat]`.
- A region with no value must use an explicit neutral fill and appear in the legend or README as “no data”.

## Composite render order

1. Determine the projection from `regions` using `projection.fitExtent(...)` when possible.
2. Draw base region paths and bind values to a color scale.
3. Draw boundaries/strokes for readability.
4. Draw each route with `d3.geoPath(projection)` using its GeoJSON geometry.
5. Project each point with `projection(point.coordinates)` and draw markers/labels.
6. Add metric and overlay legends without obscuring dense geography.

Do not separately project routes and regions: a route and its intended region must share one projection.

## Offline classification

| Classification | Libraries | Data | Basemap |
|---|---|---|---|
| Fully offline D3 | local | local JS payload | custom SVG boundary paths |
| Leaflet with online OSM tiles | local | local | network required |
| Fully offline Leaflet | local | local | supplied local tiles or local tile server |

State the actual classification in the README and UI. “No API key” does not mean “offline”.
