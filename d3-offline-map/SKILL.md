---
name: d3-offline-map
description: Build offline custom-drawn geographic choropleths from GeoJSON/TopoJSON with local D3, as a double-clickable folder or explicitly requested single HTML. Triggers include 自绘地图, 免费地图数据 自绘, offline map D3, 省份着色地图, 行政区划 离线绘制, Natural Earth D3, and standalone map without API key. Do NOT use for route-only maps, live navigation/traffic/geocoding/POI, online tile basemaps, skill audits, precision unsupported by supplied data, or backend GIS/PostGIS.
license: MIT
---

# D3 Offline Map

Render a custom-drawn geographic map as an offline folder by default: no API key, no server, no runtime network. An explicit single-HTML request uses the sibling `geographic-map-artifact/scripts/bundle-html.js`; verify that output separately.

## When to use

- User wants a self-drawn / choropleth map that must work offline or without a third-party key.
- Boundary data already exists as TopoJSON/GeoJSON (or can be fetched from Natural Earth / community preprocessed packs).
- Precision down to province/country level is enough (Natural Earth 1:10m ceiling).

## When NOT to use

- Need live online basemaps, POI search, geocoding, routing → use 高德/天地图/腾讯 JS API instead.
- Need county/township precision → Natural Earth 1:10m is too coarse; use OSM (Geofabrik) or webmap.cn 1:25万.
- Need a backend / spatial database (PostGIS etc.) → out of scope for this skill.

## Core flow (5 steps)

For generic geography, prefer `../geographic-map-artifact/assets/d3-map.html` and its preflight workflow. The template below remains a China-specific reference example. Reuse cached fixed-version assets with the sibling `scripts/vendor-assets.js`; download only missing dependencies. See the sibling routing/data contract for coordinate-system, ring-direction, join and missing-value checks before rendering.

1. **Get boundary data** → put `*.topo.json` / `*.geo.json` in `./data/`. China province pack (mainland + Taiwan + HK/Macao) is already proven: see [Workflow](references/workflow.md) for sources.
2. **Vendor the libs** → `curl` D3 v5 + topojson-client into `./vendor/` so no CDN at runtime. Snippet in [Workflow](references/workflow.md).
3. **Pack data into `data.js`** → from the output directory, run `node <skill-dir>/scripts/build-data.js [file:alias ...] -o data.js` (`<skill-dir>` is the "Base directory for this skill" stated when the skill loads) to emit `window.MAPS = {...}`. The alias form keeps template keys stable: `node <skill-dir>/scripts/build-data.js data/zh-mainland-provinces.topo.json:mainland data/zh-chn-twn.topo.json:chnTwn data/zh-hkg-mac.topo.json:hkMac -o data.js`.
4. **Copy template** → `cp template/index.html ./index.html`. Inspect property field names your data exposes (e.g. `provinces` object, `name` field, `GU_A3` filter for Taiwan, `NAME` for HK/Macao) and adjust the few data-specific lines flagged by `// DATA-SPECIFIC:` comments in the template.
5. **Verify in a real browser** → if a browser-automation tool (chrome-devtools / playwright MCP) is available, drive it yourself: navigate to the `file://` URL of `index.html`, run the console checklist in [Workflow](references/workflow.md), take a screenshot. If not, hand the file to the user and ask them to open it and paste the checklist result. Do not trust "the code looks right" — projection params, object names, and property field names all silently produce a blank page.

## Success criteria (must all pass)

- `document.querySelectorAll('.map-region').length` === selected input region count; exclude axis/legend paths.
- Fills match the configured scale; equal/bin-sharing values may have equal fills. Missing values use a neutral color, distinct from numeric zero.
- Overall geometry is finite and visible; tiny regions need not have map-sized individual bboxes.
- `d3` and the selected data payload defined; require `topojson` only when runtime conversion is used. Collect console/page errors before navigation.
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
