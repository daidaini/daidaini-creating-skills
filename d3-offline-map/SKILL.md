---
name: d3-offline-map
description: Build an offline, zero-dependency, custom-drawn geographic map (choropleth / self-drawn regions) as a single double-clickable HTML using Natural Earth TopoJSON/GeoJSON + D3.js. Use when the user wants to render region boundary data offline without online map APIs, without a server, or wants to color/shade regions by per-region values. Triggers include "自绘地图", "免费地图数据 自绘", "offline map D3", "省份着色地图", "行政区划 离线绘制", "Natural Earth D3", "standalone map without API key". Do NOT use when the user needs online tile basemaps, live POI/geocoding APIs, sub-county/sub-province precision, or a backend GIS/PostGIS pipeline.
license: MIT
---

# D3 Offline Map

Render a custom-drawn geographic map as one offline HTML file: no API key, no server, no network. Data comes from preprocessed TopoJSON/GeoJSON (Natural Earth scale); D3.js renders SVG; everything is vendored locally so the result opens by double-clicking.

## When to use

- User wants a self-drawn / choropleth map that must work offline or without a third-party key.
- Boundary data already exists as TopoJSON/GeoJSON (or can be fetched from Natural Earth / community preprocessed packs).
- Precision down to province/country level is enough (Natural Earth 1:10m ceiling).

## When NOT to use

- Need live online basemaps, POI search, geocoding, routing → use 高德/天地图/腾讯 JS API instead.
- Need county/township precision → Natural Earth 1:10m is too coarse; use OSM (Geofabrik) or webmap.cn 1:25万.
- Need a backend / spatial database → use the PostGIS route (china-1m-geodata-postgis-mcp) instead.

## Core flow (5 steps)

1. **Get boundary data** → put `*.topo.json` / `*.geo.json` in `./data/`. China province pack (mainland + Taiwan + HK/Macao) is already proven: see [Workflow](references/workflow.md) for sources.
2. **Vendor the libs** → `curl` D3 v5 + topojson-client into `./vendor/` so no CDN at runtime. Snippet in [Workflow](references/workflow.md).
3. **Pack data into `data.js`** → run `node scripts/build-data.js [file:alias ...] -o data.js` to emit `window.MAPS = {...}`. The alias form keeps template keys stable: `node scripts/build-data.js data/zh-mainland-provinces.topo.json:mainland data/zh-chn-twn.topo.json:chnTwn data/zh-hkg-mac.topo.json:hkMac -o data.js`.
4. **Copy template** → `cp template/index.html ./index.html`. Inspect property field names your data exposes (e.g. `provinces` object, `name` field, `GU_A3` filter for Taiwan, `NAME` for HK/Macao) and adjust the few data-specific lines flagged by `// DATA-SPECIFIC:` comments in the template.
5. **Verify in a real browser** → open the file via `file://`, check: `<svg>` has N region paths, fills differ by value, console has 0 errors, take a screenshot. Do not trust "the code looks right" — projection params, object names, and property field names all silently produce a blank page.

## Success criteria (must all pass)

- `document.querySelectorAll('svg path').length` === expected region count (e.g. 34 for China).
- A known high-value region fill ≠ a known low-value region fill (color scale actually bound).
- Path geometric bbox is map-sized (hundreds of px), not 0×0.
- `d3`, `topojson`, `window.MAPS` all defined; console 0 errors.
- Page renders with no network requests (offline test).

## Key pitfalls

- **`file://` CORS trap**: `d3.json()` (fetch) is blocked on `file://`. Always inline data as a JS variable (`window.MAPS=...`) loaded via `<script src>`, which is not subject to same-origin policy.
- **Vendor, don't CDN**: if D3/topojson load from a CDN, the page is not offline. Download to `vendor/` and reference relatively.
- **Tiny regions vanish**: Hong Kong / Macao are a few pixels at country scale — render an inset with its own projection, same as the template does.
- **Taiwan is a separate admin-0 object** in Natural Earth, not a province feature; filter `zh-chn-twn` by `GU_A3 === 'TWN'`.
- **Compliance**: Natural Earth draws de facto boundaries and diverges from PRC official depiction (Taiwan, Kashmir). Public-facing maps in China must go through 地图审核 — this is law, not preference. Fine for learning/internal use.

## Adapting to other regions

The template is a China-province reference implementation. For any other region:
1. Swap the `./data/*.json` files (any Natural Earth / community TopoJSON works the same).
2. Read each file's `objects.<name>` and the geometry `properties` fields, then update the `// DATA-SPECIFIC:` lines (projection center/scale, object key, name field, value lookup object).
3. Drop the Taiwan / HK-Macao blocks if your region does not need them.
4. Re-run the verification block above.

## References

- [Detailed workflow, data sources, and compliance notes](references/workflow.md)
- [Data packer script usage](scripts/build-data.js) (header comment)
- [Verified template](template/index.html) — China province choropleth, 2020 census population