# Workflow Detail & Data Sources

Expands SKILL.md with the exact commands, data sources, and pitfalls proven in the reference run.

## Data sources (all free, all offline-usable)

| What | Source | Format | Notes |
|------|--------|--------|-------|
| Global country/province vectors | Natural Earth 1:10m Cultural Vectors | SHP | `ne_10m_admin_0_countries_lakes`, `ne_10m_admin_1_states_provinces_lakes` |
| China pack (mainland + TW + HK/Macao) preprocessed to TopoJSON | `github.com/clemsos/d3-china-map` `maps/` dir | TopoJSON | Skips ogr2ogr entirely if you have no GDAL |
| China province/city/county GeoJSON | DataV.GeoAtlas (`datav.aliyun.com/tools/atlas/`) | GeoJSON | Online tool, save result locally |
| China 1:100万 vector (gov) | `webmap.cn` (自然资源部) | GDB/SHP | Needs GDAL to convert; coarser province set but authoritative |
| OSM China (very detailed) | Geofabrik `download.geofabrik.de/asia/china.html` | .osm.pbf / .gpkg | 1.5 GB, road-level detail, overkill for choropleth |
| China admin names (省/市/县/乡镇) | `github.com/xiangyuecn/AreaCity-JsSpider-StatsGov` | CSV/GeoJSON | Names + boundaries |

Pick the smallest source that meets your precision need. Natural Earth 1:10m → province/country. webmap.cn 1:25万 → province, slightly better. OSM → county/road.

## Step commands (reference run)

```bash
# 1. Data: copy community preprocessed China TopoJSON into ./data/
mkdir -p data
cp <clone>/clemsos/d3-china-map/maps/zh-mainland-provinces.topo.json data/
cp <clone>/clemsos/d3-china-map/maps/zh-chn-twn.topo.json        data/
cp <clone>/clemsos/d3-china-map/maps/zh-hkg-mac.topo.json       data/

# 2. Vendor libs (so the page is truly offline)
mkdir -p vendor
curl -sS -L -o vendor/d3.v5.min.js            https://cdn.jsdelivr.net/npm/d3@5.16.0/dist/d3.min.js
curl -sS -L -o vendor/topojson-client.min.js  https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js
# sanity: head -c 80 each; d3 file starts with "// https://d3js.org v5.16.0"

# 3. Pack into data.js (run from skill parent dir)
node .agents/skills/d3-offline-map/scripts/build-data.js \
  data/zh-mainland-provinces.topo.json:mainland \
  data/zh-chn-twn.topo.json:chnTwn \
  data/zh-hkg-mac.topo.json:hkMac \
  -o data.js
# expect: packed mainland <- ... | type=Topology objects=provinces
#         packed chnTwn  <- ... | objects=layer1
#         packed hkMac   <- ... | objects=layer1

# 4. Copy template
cp .agents/skills/d3-offline-map/template/index.html ./index.html

# 5. Open in a browser (file:// double-click works)
```

## Inspecting data before touching the template

Before writing render code, dump each TopoJSON's object name and a sample geometry's properties so the template's filters/field lookups are correct:

```bash
node -e '
const fs=require("fs");
const t=JSON.parse(fs.readFileSync("data/zh-mainland-provinces.topo.json","utf8"));
for(const [k,v] of Object.entries(t.objects)){
  const g=(v.geometries||[])[0];
  console.log(k, "geoms="+((v.geometries||[]).length), "fields=", g?Object.keys(g.properties).join(","):"-");
}
'
```

Known good values for the China pack:
- `zh-mainland-provinces.topo.json` → object `provinces`, 31 geometries, name field `properties.name`.
- `zh-chn-twn.topo.json` → object `layer1`, 2 geometries; filter Taiwan by `properties.GU_A3 === "TWN"`.
- `zh-hkg-mac.topo.json` → object `layer1`, 2 geometries; names `properties.NAME` = `"Hong Kong"` / `"Macao"`.

## Projection tuning

China fills nicely with Mercator centered on its centroid:

```js
d3.geoMercator().center([107, 31]).scale(850).translate([width/2, height/2]);
```

For other regions, set `center` to the region's `[lon, lat]` centroid and tune `scale` until it fits. A safe first guess: `scale ≈ 200 / (max longitude span in degrees) * width`.

## Tiny-region inset pattern

Hong Kong + Macao are invisible at country scale. Render a framed sub-map with its own projection:

```js
const proj2 = d3.geoMercator().center([114.15, 22.35]).scale(6000)
  .translate([insetW/2, insetH/2]);
const path2 = d3.geoPath().projection(proj2);
// draw rect frame, label, then the HK/Macao paths with path2
```

## Verification checklist (run in browser DevTools console)

```js
JSON.stringify({
  pathCount: document.querySelectorAll("svg path").length,        // expect region count
  bboxSpan:  (()=>{const r=document.querySelector("svg g path");return r?r.getBBox():null})(),
  d3: typeof d3, topojson: typeof topojson,
  MAPS: window.MAPS ? Object.keys(window.MAPS).join(",") : "undefined",
  errors: (window.__caught||[]).length
})
```

Then screenshot and eyeball: high-value region dark, low-value region light, no console errors.

## Compliance reminder

Natural Earth uses de facto boundaries (Taiwan shown as separate admin-0, Kashmir split). For public-facing maps in mainland China you must follow 《地图管理条例》 and submit for 地图审核. Use authoritative state sources (webmap.cn / 天地图) and their reviewed boundaries for anything published. This skill is fine for learning, internal tools, and prototypes.