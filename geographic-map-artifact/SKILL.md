---
name: geographic-map-artifact
description: Build verified local route/point, choropleth, or composite maps as a double-clickable folder or explicit single HTML, with optional KML. Use for 绘制路线图, 路线地图, 省份着色地图, 自绘地图, 离线地图, 合成地图, route map, travel/logistics map, choropleth, offline geographic map, or colored regions with routes/points. Do NOT use for live navigation/traffic/routing, geocoding/POI, production GIS/tile hosting, skill audits, unsupported boundary precision, or regulated public maps.
license: MIT
---

# Geographic Map Artifact

Choose layers/delivery, then renderer.

| Need | Default |
|---|---|
| Routes/stops with online basemap | Leaflet |
| Offline choropleth/custom projection | D3/SVG |
| Regions plus routes/points | D3 offline; Leaflet for map browsing |

Leaflet can work offline without tiles. KML-only needs no HTML. Siblings: `../leaflet-route-map/` for routes/KML; `../d3-offline-map/` for boundaries.

## Execute

1. Resolve folder/single HTML, network, source/date and synthetic status. Ask only for consequential missing inputs.
2. Read [contract](references/routing-and-data-contract.md); reuse local data/cached libraries.
3. Convert selected TopoJSON features to GeoJSON, then run `node <skill-dir>/scripts/preflight.js input.json --report preflight.json --out data.js`. Preserve source; resolve errors before rendering.
4. Copy [D3](assets/d3-map.html) or [Leaflet](assets/leaflet-map.html) template to `index.html`. Run `node <skill-dir>/scripts/vendor-assets.js <output-dir> --renderer d3|leaflet`. Both consume prepared `window.MAP_DATA`.
5. Follow [verification](references/verification-and-boundaries.md): data/render/browser checks, desktop/mobile, screenshot. Label unavailable evidence.
6. Deliver README with opening instructions, sources and network classification. For explicit single HTML, run `node <skill-dir>/scripts/bundle-html.js index.html standalone.html`; verify it separately.

## Invariants and output

- Store known WGS84 `[lon,lat]`; Leaflet GeoJSON handles this order. Raw polyline/marker calls need conversion.
- Use local JS data, not file-URL JSON fetch. Bundling does not make remote tiles offline.
- Folder: HTML, data, vendor/manifest, preflight, README, browser notes/screenshot. Single HTML embeds runtime dependencies.
- Label synthetic inputs, omit unknown statistics. Resolve unknown CRS, unsuitable precision and excluded live GIS/publication requirements before proceeding.

[Regression guide](evals/README.md) · [Boundary and evidence](reports/boundary-and-gates.md)
