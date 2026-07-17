# Leaflet Route Map Workflow

This workflow captures the route-map process proven in the `roadmap/` demo: Leaflet + local route data + OpenStreetMap basemap + browser verification.

## Output contract

A successful run produces a target folder like:

```text
target/
├─ index.html
├─ README.md
├─ screenshot.png                 # optional but strongly recommended
├─ data/
│  ├─ osrm-route.json              # optional raw fetched route response
│  ├─ route-data.js                # browser-loadable window.ROUTE_DATA payload
│  └─ route.kml                    # Google My Maps-compatible KML (optional)
├─ vendor/
│  └─ leaflet/
│     ├─ leaflet.css
│     ├─ leaflet.js
│     └─ images/
│        ├─ marker-icon.png
│        ├─ marker-icon-2x.png
│        └─ marker-shadow.png
└─ scripts/
   └─ convert-kml.py              # reusable KML generation script
```

Minimum user-facing artifact (Leaflet): `index.html` plus local Leaflet assets and local route data.
Minimum user-facing artifact (KML): `data/route.kml` importable into Google My Maps.

## Step 1: Confirm target and map assumptions

Use the lightest clarification only when needed:

- target folder name
- online basemap is acceptable, or fully offline tiles are required
- test route is acceptable, or the user has real coordinates

Default if unspecified:

- target folder: user-provided folder
- library: Leaflet 1.9.x vendored locally
- basemap: OpenStreetMap online tiles
- test data: public OSRM demo route fetched once, then saved locally

## Step 2: Create folders and vendor Leaflet

Example:

```bash
mkdir -p target/vendor/leaflet/images target/data
curl -L --fail -o target/vendor/leaflet/leaflet.css https://unpkg.com/leaflet@1.9.4/dist/leaflet.css
curl -L --fail -o target/vendor/leaflet/leaflet.js https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
curl -L --fail -o target/vendor/leaflet/images/marker-icon.png https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png
curl -L --fail -o target/vendor/leaflet/images/marker-icon-2x.png https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png
curl -L --fail -o target/vendor/leaflet/images/marker-shadow.png https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png
```

If network is unavailable, ask the user for existing Leaflet assets or copy from a known local vendor folder.

## Step 3: Get test route data

For a realistic road-following route, use OSRM public demo service once, then save the response. Example from the proven demo:

```bash
curl -L --fail -o target/data/osrm-route.json \
  'https://router.project-osrm.org/route/v1/driving/-73.98513,40.75890;-73.96536,40.78286;-73.96324,40.77944?overview=full&geometries=geojson&steps=true'
```

This route is:

```text
Times Square → Central Park → Metropolitan Museum of Art
```

Why OSRM works well for a demo:

- returns road-following route geometry
- supports `geometries=geojson`
- route geometry uses standard `[lon, lat]` coordinate order
- response includes distance and duration

Fallback when route API is unavailable:

- use a hand-written array of coordinates
- label it clearly as synthetic test data
- prefer at least 8-20 points so the line does not look like a trivial straight segment

## Step 4: Convert route response into browser data

Do not fetch JSON from `file://` pages at runtime. Save a JS payload:

```js
window.ROUTE_DATA = {
  title: "NYC sample route: Times Square → Central Park → The Met",
  source: "OSRM public demo server, fetched once for local test data",
  distanceMeters: 5567.4,
  durationSeconds: 606.8,
  geometry: {
    type: "LineString",
    coordinates: [[-73.984921, 40.758812], ...]
  },
  waypoints: [
    { label: "Start", name: "Times Square", location: [-73.98513, 40.75890] },
    { label: "Waypoint", name: "Central Park", location: [-73.96536, 40.78286] },
    { label: "Finish", name: "Metropolitan Museum of Art", location: [-73.96324, 40.77944] }
  ]
};
```

Important conversion rule in `index.html`:

```js
function lonLatToLatLng(coord) {
  return [coord[1], coord[0]];
}

const routeLatLngs = routeData.geometry.coordinates.map(lonLatToLatLng);
```

## Step 5: Render the map

Minimum Leaflet pieces:

```html
<link rel="stylesheet" href="./vendor/leaflet/leaflet.css" />
<div id="map"></div>
<script src="./vendor/leaflet/leaflet.js"></script>
<script src="./data/route-data.js"></script>
```

```js
const map = L.map('map');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const routeLine = L.polyline(routeLatLngs, {
  color: '#2563eb',
  weight: 6,
  opacity: 0.95,
  lineCap: 'round',
  lineJoin: 'round'
}).addTo(map);

routeData.waypoints.forEach((waypoint) => {
  L.circleMarker(lonLatToLatLng(waypoint.location), {
    radius: 9,
    color: '#ffffff',
    weight: 3,
    fillColor: waypoint.label === 'Finish' ? '#dc2626' : '#16a34a',
    fillOpacity: 1
  }).addTo(map).bindPopup(`<strong>${waypoint.label}</strong><br>${waypoint.name}`);
});

map.fitBounds(routeLine.getBounds(), { padding: [48, 48] });
```

Recommended polish:

- draw a white route outline below the colored route line for contrast
- add a compact stats panel with distance and duration
- use green for start, red for finish, amber/blue for waypoints
- bind popup to the route line and markers
- add a visible label near the route midpoint only if it does not clutter the map

## Step 6: Write a README

Include:

- what the route is
- how to open the page
- which files are local
- whether the basemap is online or offline
- how to run a local static server if desired

State clearly:

```text
Leaflet library files are local.
Route data is local.
The default OpenStreetMap basemap still requires network.
```

## Step 7: Verify in a real browser

Preferred browser checks:

```js
(() => ({
  title: document.title,
  bodyHasDemoText: document.body.innerText.includes('Leaflet 路线地图 Demo'),
  leafletLoaded: !!window.L,
  routeCoordCount: window.ROUTE_DATA?.geometry?.coordinates?.length,
  svgPathCount: document.querySelectorAll('svg path').length,
  markerCount: document.querySelectorAll('.leaflet-interactive').length,
  tileImgCount: document.querySelectorAll('.leaflet-tile').length,
  mapPaneExists: !!document.querySelector('.leaflet-map-pane')
}))()
```

Expected shape:

- `leafletLoaded: true`
- `routeCoordCount > 2`
- `svgPathCount > 0` or canvas equivalent if renderer differs
- `markerCount >= 2`
- `mapPaneExists: true`
- `tileImgCount > 0` when using online tiles and network is available

Save screenshot as `target/screenshot.png` when browser tooling is available.

## Step 8 (Optional): Generate KML for Google My Maps

When the user wants to export the route to Google My Maps, run the conversion script:

```bash
# Basic: use waypoints from OSRM response
python3 scripts/convert-kml.py data/osrm-route.json data/route.kml

# Custom waypoints with labels and descriptions
python3 scripts/convert-kml.py data/osrm-route.json data/route.kml \
  --waypoints data/waypoints.json

# Custom styling
python3 scripts/convert-kml.py data/osrm-route.json data/route.kml \
  --route-color ff2563eb --route-width 5
```

Waypoints JSON format:

```json
[
  {"name": "Kuala Lumpur", "desc": "Petronas Towers", "lon": 101.6869, "lat": 3.1390},
  {"name": "Malacca", "desc": "Historical city", "lon": 102.2406, "lat": 2.1894}
]
```

The script is in `scripts/convert-kml.py` (part of the skill package, copied to target).

To import into Google My Maps:

1. Open [mymaps.google.com](https://mymaps.google.com) → sign in
2. Create new map → click **Import**
3. Select the `.kml` file → route line and markers appear automatically
4. Optionally style further in the Google My Maps UI

### Step 8.1: Verify KML

Check the generated KML with a lightweight XML parse:

```python
import xml.etree.ElementTree as ET
ns = {'kml': 'http://www.opengis.net/kml/2.2'}
tree = ET.parse('data/route.kml')
root = tree.getroot()
places = root.findall('.//kml:Placemark', ns)
lines = [p for p in places if p.find('kml:LineString', ns) is not None]
points = [p for p in places if p.find('kml:Point', ns) is not None]
print(f'{len(lines)} route(s), {len(points)} marker(s) \u2014 OK')
```

Expected:
- 1 LineString with all route coordinates
- N Point placemarks (one per waypoint)
- Valid XML (no parse errors)

## Common pitfalls

### Coordinate order bug

Symptom: route appears in the ocean, off-map, or not visible.

Cause: GeoJSON/OSRM is `[lon, lat]`; Leaflet is `[lat, lon]`.

Fix: convert every route and waypoint coordinate.

### False offline claim

Vendoring Leaflet is not enough. The basemap remains online if using `https://{s}.tile.openstreetmap.org/...`.

Only claim fully offline when the tile layer points to local files or a local tile server:

```js
L.tileLayer('./tiles/{z}/{x}/{y}.png')
```

### `file://` JSON fetch issue

Avoid `fetch('./data/osrm-route.json')` for double-clickable pages. Some browsers block or vary behavior under `file://`.

Prefer:

```html
<script src="./data/route-data.js"></script>
```

### Too-simple test route

A two-point straight line proves only polyline drawing, not road-route rendering. Prefer OSRM or a richer coordinate list for credible route visuals.

### KML coordinate order

OSRM/GeoJSON uses `[lon, lat]`; KML also uses `lon,lat`. **No conversion needed** — both use the same order.

### KML file size

20k+ coordinates produce a ~400 KB KML. Google My Maps handles this, but rendering may take a few seconds. Simplify coordinates (sample every Nth point) if loading feels slow.

## Current-session evidence

The workflow was validated in multiple projects:

**Leaflet HTML demo** (`roadmap/`):
- vendored Leaflet 1.9.4
- OSRM test route response saved locally
- `312` route geometry coordinates
- `3` waypoints
- browser verification showing Leaflet loaded, route data present, rendered SVG paths, markers, and map tiles
- screenshot saved to `roadmap/screenshot.png`

**KML export** (`malaysia-7day/`):
- OSRM route: 19,404 coordinates, 1,093.7 km
- `scripts/convert-kml.py` converts OSRM JSON to Google My Maps-compatible KML
- KML validated: 1 LineString + 7 Point placemarks, well-formed XML (~423 KB)
- Imported into Google My Maps successfully
