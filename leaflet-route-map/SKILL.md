---
name: leaflet-route-map
description: Build a complete Leaflet route map demo (HTML) or Google My Maps-compatible KML with test route data, markers, route polyline, local vendored Leaflet assets, and browser verification. Use when the user asks to 绘制路线图, draw routes on a map, make a Google-Maps-like route demo, Leaflet polyline map, OSRM test route map, a standalone HTML map with route lines, or export route to Google My Maps KML. Do NOT use for D3 choropleth/region coloring, full GIS routing engines, production navigation, legal/compliance map publishing, or fully offline basemaps unless offline tiles are explicitly provided.
license: MIT
disable-model-invocation: true
---

# Leaflet Route Map

Create a minimal, complete route-map artifact with Leaflet (HTML) or a KML file importable into Google My Maps: local library assets, test route data, route polyline, waypoint markers, stats panel, and verification screenshot.

## Use this skill when

- The user wants a route line drawn on a map, similar to Google Maps route visuals.
- Test data is acceptable or can be fetched once from a public routing demo service.
- A simple HTML artifact is preferred over a backend GIS stack.
- The expected output is a folder containing `index.html`, vendored Leaflet files, route data, and verification evidence. Optionally generates a `*.kml` file for Google My Maps import.

## Do not use this skill when

- The request is mainly region coloring / choropleth / administrative boundaries → use `d3-offline-map` instead.
- The user needs real production routing, turn-by-turn navigation, traffic, geocoding, or POI search.
- The user requires fully offline basemaps but has not supplied offline tiles or a tile packaging plan.
- The map is for regulated public release where map approval/compliance matters.
- The user needs only a quick map to share via Google My Maps link without local HTML files.

## Core workflow

For shared preflight data and a reusable vector/online map template, use the sibling `geographic-map-artifact` workflow. Its Leaflet template uses `L.geoJSON` (native GeoJSON lon/lat handling), explicit layer classes, and no tiles unless requested. Reuse fixed-version assets with its `scripts/vendor-assets.js`.

Follow the detailed process in [Workflow](references/workflow.md):

1. Create a clean target folder.
2. Vendor Leaflet JS/CSS and marker images locally.
3. Get or create test route data, preferably GeoJSON-like coordinates.
4. Convert route coordinates from `[lon, lat]` to Leaflet `[lat, lon]`.
5. Render with `L.tileLayer`, `L.polyline`, waypoint markers, stats, popups, and `fitBounds`.
6. Verify in a real browser and save a screenshot.

## Success criteria

- For Leaflet HTML output: `index.html` opens and shows a map.
- `window.L` and route data are defined.
- The route has two distinct positions at minimum; label illustrative lines. Coordinate count alone cannot prove road-routing accuracy.
- The map (Leaflet HTML or KML) contains visible route polyline and start/end markers.
- KML output: XML and structural checks pass via `scripts/verify-kml.py` (not full schema validation); verify lon/lat endpoints and IconStyle/Icon/href.
- Verification checks record separate route/point layer counts, finite visible geometry, loaded tile images when online, and screenshot path. Do not count `.leaflet-interactive` as markers.

## Key cautions

- Leaflet `L.polyline` expects `[lat, lon]`; OSRM/GeoJSON coordinates are `[lon, lat]`.
- Vendored Leaflet does not make the basemap offline. OpenStreetMap tile URLs still require network.
- Chinese basemap tile providers (Gaode/Tencent) render in GCJ-02. WGS84 route/marker data (OSRM, GPS) sits hundreds of meters off their roads when zoomed in. State this in the README and/or offer an OSM (WGS84) layer toggle.
- Do not claim “fully offline” unless tiles are local, e.g. `./tiles/{z}/{x}/{y}.png`.
- For `file://` friendliness, save route data as a JS file such as `window.ROUTE_DATA = ...` instead of fetching JSON at runtime.
- KML coordinates use `lon,lat` order (same as GeoJSON/OSRM, no conversion needed).
- The `scripts/convert-kml.py` script requires Python 3 with no extra dependencies.
- Google My Maps import limit: each layer supports up to 2,000 features; a single LineString with 20k+ coordinates is fine but large KMLs may take several seconds to render.
