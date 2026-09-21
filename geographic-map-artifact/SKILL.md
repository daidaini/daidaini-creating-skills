---
name: geographic-map-artifact
description: Build a verified local HTML geographic-map artifact. Supports route maps with markers and optional Google My Maps KML export, offline D3 choropleth maps from GeoJSON/TopoJSON, and offline composite maps that overlay routes or points on colored regions. Use when the user asks for a route/travel/logistics map, a region-colored map, an offline self-drawn map, geographic data visualization, or a static map combining boundaries with routes. Do NOT use for live navigation, traffic, geocoding, POI search, tile-service hosting, production GIS systems, sub-county precision without supplied authoritative data, or regulated public map publication.
license: MIT
---

# Geographic Map Artifact

Create a local, browser-verifiable map artifact. Select one mode before building:

| Requested visual layer | Mode | Default renderer |
|---|---|---|
| Route line, stops, distance/duration, Google My Maps export | `route` | Leaflet |
| Region boundaries colored by values | `choropleth` | D3 + SVG |
| Colored regions plus routes and/or point markers | `composite` | D3 + SVG |

Read [routing and data contract](references/routing-and-data-contract.md) before implementation. Read [verification and boundaries](references/verification-and-boundaries.md) before claiming completion.

## Default decisions

- Preserve source geographic coordinates as GeoJSON order: `[longitude, latitude]`.
- Convert to Leaflet `[latitude, longitude]` only at the Leaflet rendering boundary.
- For `file://` artifacts, load data through a local JavaScript file (`window.MAP_DATA` or `window.MAPS`), never runtime `fetch()`.
- Treat a map as fully offline only if its libraries, geographic data, and basemap are all local. Vendored Leaflet with OSM tiles is **not** fully offline.
- Save a `README.md` stating data sources, renderer, files that must remain together, and the actual network requirement.

## Mode workflows

### `route`

Use the local `leaflet-route-map` workflow and assets:

1. Vendor Leaflet locally and create `data/route-data.js`.
2. Render an online OSM tile layer by default, a polyline, start/end/waypoint markers, and route statistics.
3. Convert GeoJSON/OSRM `[lon, lat]` coordinate arrays to Leaflet `[lat, lon]` immediately before drawing.
4. Optionally use `leaflet-route-map/scripts/convert-kml.py` to create a Google My Maps KML export.
5. Verify Leaflet, route-coordinate count, path, markers, and map pane in a real browser.

### `choropleth`

Use the local `d3-offline-map` workflow and assets:

1. Place GeoJSON/TopoJSON input under `data/`; inspect object and property names.
2. Vendor D3 and topojson-client; package data into a browser-loadable JS payload with `d3-offline-map/scripts/build-data.js`.
3. Use an appropriate projection, render SVG region paths, bind values to a color scale, and include a legend.
4. Verify expected path count, non-zero map-sized geometry, differing high/low fills, no console errors, and no network requests.

### `composite`

Use D3/SVG when a static/offline artifact is required:

1. Build a `window.MAP_DATA` payload containing `regions`, `values`, optional `routes`, and optional `points`; use the contract in the routing reference.
2. Render regions and fills first. Render route `LineString` paths next, then point markers and labels above them.
3. Use one D3 geographic projection for every layer, keeping all source coordinates in `[lon, lat]` order.
4. Include a legend for region values and a compact route/point legend when applicable.
5. Verify both region and overlay evidence: region path count and color scale, route path count/geometry, marker count, projection bounds, console errors, and a screenshot.

## Output contract

Required for every HTML artifact:

- `index.html`
- local data payload (`data.js`, `route-data.js`, or equivalent)
- all required local libraries/assets
- `README.md`
- browser verification notes; include `screenshot.png` when browser tooling is available

Additionally for `route` when requested:

- Google My Maps-compatible `route.kml`, with one `LineString` and the requested point placemarks

## Hard boundaries

- Do not claim a Leaflet map with remote tiles is offline.
- Do not silently invent routes, values, or boundaries; label supplied test/synthetic data.
- Do not use Natural Earth or other de facto boundary sources as an official public map base in China.
- Escalate rather than improvising for live routing, navigation, traffic, geocoding, high-precision administrative boundaries, or regulated publication.
