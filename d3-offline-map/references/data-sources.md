# Data Sources

All free and usable offline once downloaded. Pick the smallest source that meets the precision needed.

| What | Source | Format | Notes |
|------|--------|--------|-------|
| Global countries / provinces | Natural Earth 1:10m Cultural Vectors | SHP | `ne_10m_admin_0_countries_lakes`, `ne_10m_admin_1_states_provinces_lakes`; needs GDAL or mapshaper to convert |
| China pack (mainland + Taiwan + HK/Macao), preprocessed | `github.com/clemsos/d3-china-map`, `maps/` dir | TopoJSON | No GDAL needed |
| China province / city / county | DataV.GeoAtlas (`datav.aliyun.com/tools/atlas/`) | GeoJSON | Online tool; save the result locally |
| China 1:100万 vector (government) | `webmap.cn` (自然资源部) | GDB/SHP | Authoritative; needs GDAL |
| OSM China | Geofabrik `download.geofabrik.de/asia/china.html` | .osm.pbf / .gpkg | 1.5 GB, county/road detail, overkill for most choropleths |
| China admin names (省/市/县/乡镇) | `github.com/xiangyuecn/AreaCity-JsSpider-StatsGov` | CSV/GeoJSON | Names + boundaries |

## China pack (matches the template)

Copy `zh-mainland-provinces.topo.json`, `zh-chn-twn.topo.json`, and `zh-hkg-mac.topo.json` from the clemsos `maps/` dir into `data/`, then:

```bash
node <skill-dir>/scripts/build-data.js \
  data/zh-mainland-provinces.topo.json:mainland \
  data/zh-chn-twn.topo.json:chnTwn \
  data/zh-hkg-mac.topo.json:hkMac -o data.js
```

Known values:

- `zh-mainland-provinces.topo.json`: object `provinces`, 31 geometries, name field `properties.name`.
- `zh-chn-twn.topo.json`: object `layer1`, 2 geometries; Taiwan is `properties.GU_A3 === "TWN"`.
- `zh-hkg-mac.topo.json`: object `layer1`, 2 geometries; `properties.NAME` is `"Hong Kong"` / `"Macao"`.
