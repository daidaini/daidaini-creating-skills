---
name: d3-offline-map
description: Build an offline choropleth (区域填色地图) from GeoJSON/TopoJSON with local D3; no API key, no server, no runtime network.
disable-model-invocation: true
license: MIT
---

# D3 Offline Map

Deliver a folder that opens by double-click over `file://`:

```
index.html  data.js  vendor/d3.v5.min.js  vendor/topojson-client.min.js  data/
```

Online tile basemaps, routing, geocoding, POI, and backend GIS are out of scope; route maps belong to `leaflet-route-map`.

## Steps

1. **Boundaries.** Use the user's files, or fetch from [data sources](references/data-sources.md). The data sets the precision ceiling: Natural Earth 1:10m reaches province level, not county. Before writing render code, inspect each file: TopoJSON object names, property fields, and coordinate range (must be WGS84 lon/lat).
2. **Vendor the libraries** at fixed versions (the template uses the D3 v5 API):
   ```bash
   mkdir -p vendor
   curl -sSL -o vendor/d3.v5.min.js https://cdn.jsdelivr.net/npm/d3@5.16.0/dist/d3.min.js
   curl -sSL -o vendor/topojson-client.min.js https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js
   ```
3. **Pack the data** into `data.js` as `window.MAPS = {...}`. From the output folder run `node <skill-dir>/scripts/build-data.js data/a.topo.json:alias ... -o data.js`. This is required because `fetch`/`d3.json` is blocked on `file://` while `<script src>` is not.
4. **Render.** Start from [template/index.html](template/index.html), a verified China-province population map, and change the lines marked `// DATA-SPECIFIC:` (MAPS key, object name, name field, values, projection). For a new region, fit with `projection.fitSize` instead of hand-tuning center and scale, and drop the Taiwan and Hong Kong/Macao blocks if unneeded. Join values on a stable key, report unmatched regions, and give missing values a neutral "no data" fill distinct from zero. Keep `class="map-region"` on region paths.
5. **Verify in a real browser** over `file://`. Projection, object-name, and field-name mistakes look fine in code and render a blank map. Done when:
   - the `.map-region` count equals the selected region count;
   - fills match the scale and no-data regions use the neutral fill;
   - the console has no errors and the page makes no network requests;
   - a screenshot looks right.

   Without a browser tool, say these checks were not run and ask the user to open the file.

## Gotchas

- **Winding order**: D3 expects clockwise exterior rings, the opposite of RFC 7946 GeoJSON. A small region that fills the whole canvas has reversed rings; reverse them on a rendering copy (a regional feature with `d3.geoArea` > 2π is reversed).
- **Tiny regions** such as Hong Kong and Macao vanish at country scale; draw an inset with its own projection, as the template does.
- **Taiwan** is a separate admin-0 object in Natural Earth; the template filters `zh-chn-twn` by `GU_A3 === 'TWN'`.
- **Compliance**: Natural Earth draws de facto borders that differ from the PRC official depiction. Public maps in China must pass 地图审核; these maps suit learning, internal use, and prototypes.

## Optional: single HTML

Only when the user asks for one file. Copy `index.html` to `standalone.html` and replace each `<script src>` with that file's contents inline, escaping `</script` as `<\/script`. Verify it again, alone in an empty folder.
