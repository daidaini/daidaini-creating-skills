# Verification and Boundaries

## Verify data, rendering, then appearance

1. Run `node scripts/preflight.js input.json --report preflight.json --out data.js` before rendering. Preserve source JSON; see the routing contract for supported geometry.
2. Capture browser console errors, page errors, and remote requests **before navigation**. Compare geometry, layer counts, fills, and tile loading with the input. An absent error collector is unavailable evidence, never zero errors.
3. Inspect alignment, legends, popups/tooltips, and desktop/mobile fit; save a screenshot. For the responsive templates, assert no horizontal overflow at 390 px. Check anchors/collapse only when those controls exist.

Keep checks and screenshots in the same live browser session. Use the active tool API; single-line evaluation is needed only when its argument transport requires it. If browser tooling is unavailable, deliver static checks and explicitly mark visual/network evidence unavailable.

## Layer checks

Use `.map-region`, `.map-route`, `.map-point` in both renderers. Do not count all SVG paths (legend axes create paths), or count `.leaflet-interactive` as markers (routes carry it too).

- Counts equal the selected input feature/route/point counts; skip absent layers.
- Copy `getBBox().x/y/width/height` into a plain object when serializing. Check finite visible geometry and overall bounds. Tiny regions need not occupy hundreds of pixels.
- Routes need two distinct positions. Two-point illustrative segments are valid when labeled. Check finite path geometry/length and viewport intersection; a horizontal route need not have positive height.
- Verify known point locations and route alignment, not merely element presence.
- Zero values use the scale; missing/null values use a neutral fill. Compare expected scale output. Equal values or a shared classification bin may legitimately share a fill.
- Online tiles must be visibly loaded: `complete && naturalWidth > 0`, not merely present. Canvas renderers require equivalent layer-level evidence.
- The generic templates expose `window.MAP_RENDER` for projection/path/color or Leaflet map/bounds checks.

## Diagnose giant or identical region bounds

A globe-sized rectangle is a symptom, not proof of a D3 defect. Check:

1. Coordinate system, lon/lat order, finite values, and expected envelope.
2. Closed rings, holes, winding, and antimeridian crossings. Polygon nesting is `[ring][position][lon,lat]`; MultiPolygon adds a polygon level.
3. Spherical area (`d3.geoArea`) and bounds. D3 expects clockwise exterior rings for polygons smaller than a hemisphere, opposite RFC 7946; holes use the opposite direction. A small region with area near `4?` suggests its complement is being interpreted.
4. Projection binding, clipping, and `fitExtent` on adapted geometry.
5. Only then investigate a library defect with a reproducible valid-input case.

Adapt winding on a **rendering copy**. Never blindly reverse all polygons: already-correct TopoJSON, holes, antimeridian crossings, and polygons larger than a hemisphere require different treatment. The preflight adapts ordinary regional rings; unsupported spherical cases require geospatial preparation and an explicit D3-convention declaration.

Retain `d3.geoPath` and automatic fitting for valid geometry. Manual vertex projection bypasses spherical clipping and adaptive sampling; use it only for a deliberately planar local dataset with verified hole filling, not as a general repair.

References: [D3 winding](https://d3js.org/d3-geo), [projection fitting](https://d3js.org/d3-geo/projection), [RFC 7946](https://www.rfc-editor.org/rfc/rfc7946.txt).

## Offline evidence

Observe requests before load through interactions and a fresh reload with HTTP(S) blocked. Require no attempted remote library/data/font/image/tile requests. Cache hits and `meta.offline` are not proof. A local tile server may be offline but is not server-free. Mark unavailable instrumentation honestly.

## KML verification

Parse XML, then check namespace, route/point counts, finite lon/lat coordinates, expected endpoints, `IconStyle/Icon/href`, and `AABBGGRR` colors. XML parsing is not schema validation. Run `scripts/verify-kml.py`; My Maps import remains a separate compatibility check. The converter accepts OSRM or route-data JSON and exports one LineString. Its Google icon URLs are remote; the KML export is not fully offline.

## Data and publication boundaries

- Label synthetic/illustrative lines; do not imply road-routing accuracy. Record source/date, omit unsupplied distance/duration.
- Number ranges cannot reliably identify a coordinate system. Require declared WGS84 provenance or transform another known system first.
- Prefer stable region IDs. Name aliases require explicit mapping plus collision/unmatched checks; do not silently strip suffixes.
- Demos/internal analysis only. Natural Earth/de facto borders are not official PRC public map bases; regulated publication is outside scope.
- Country/province-scale data cannot substantiate county precision.
