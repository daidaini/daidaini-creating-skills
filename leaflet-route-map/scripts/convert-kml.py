#!/usr/bin/env python3
"""
Convert OSRM route JSON to Google My Maps‑compatible KML.

Usage:
    python3 scripts/convert-kml.py <input.json> <output.kml> \\
        [--waypoints wp.json] [--route-color AABBGGRR] [--route-width 6]

Input:
  OSRM route JSON from router.project-osrm.org (geometries=geojson).
  The first route in the response is used.

Output:
  KML file importable into Google My Maps.

Options:
  --waypoints wp.json   JSON array of waypoint objects:
                          [{"name":"...","desc":"...","lon":...,"lat":...}, ...]
                        If omitted, waypoints are extracted from the OSRM response.
  --route-color AABBGGRR  KML hex color (AABBGGRR), default ff3b82f6 (blue).
  --route-width N         Line width in pixels, default 6.

Coordinate order:
  OSRM/GeoJSON → [lon, lat]
  KML          → lon,lat (same order, no conversion needed)
"""

import json, sys, os, math
from xml.sax.saxutils import escape

# ── Google Maps marker icon URLs ──
ICON_START   = "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
ICON_WAYPT   = "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
ICON_FINISH  = "https://maps.google.com/mapfiles/ms/icons/red-dot.png"


def build_kml(coords, dist_km, dur_min, waypoints, route_color, route_width):
    """Return KML document string."""
    lines = []
    lines.append('<?xml version="1.0" encoding="UTF-8"?>')
    lines.append('<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">')
    lines.append('  <Document>')
    lines.append('    <name>Route Map</name>')
    lines.append(f'    <description>Total {dist_km:.1f} km · Driving ~{int(dur_min//60)}h{int(dur_min%60)}m</description>')

    # ── Route line style ──
    lines.append('    <Style id="routeStyle">')
    lines.append('      <LineStyle>')
    lines.append(f'        <color>{route_color}</color>')
    lines.append(f'        <width>{route_width}</width>')
    lines.append('      </LineStyle>')
    lines.append('      <PolyStyle><fill>0</fill></PolyStyle>')
    lines.append('    </Style>')

    # ── Route LineString ──
    lines.append('    <Placemark>')
    lines.append('      <name>Driving Route</name>')
    lines.append(f'      <description>{dist_km:.1f} km · {int(dur_min//60)}h{int(dur_min%60)}m</description>')
    lines.append('      <styleUrl>#routeStyle</styleUrl>')
    lines.append('      <LineString>')
    lines.append('        <tessellate>1</tessellate>')
    lines.append('        <coordinates>')

    # Write coordinates in chunks of 100 for readability
    chunk = []
    for c in coords:
        chunk.append(f'{c[0]:.7f},{c[1]:.7f}')
        if len(chunk) >= 100:
            lines.append('          ' + ' '.join(chunk))
            chunk = []
    if chunk:
        lines.append('          ' + ' '.join(chunk))

    lines.append('        </coordinates>')
    lines.append('      </LineString>')
    lines.append('    </Placemark>')

    # ── Waypoint markers ──
    for i, wp in enumerate(waypoints):
        icon = ICON_START if i == 0 else (ICON_FINISH if i == len(waypoints) - 1 else ICON_WAYPT)
        name = escape(wp.get('name', f'Waypoint {i+1}'))
        desc = escape(wp.get('desc', ''))
        lon  = wp['lon']
        lat  = wp['lat']

        lines.append('    <Placemark>')
        lines.append(f'      <name>{name}</name>')
        lines.append(f'      <description>{desc}</description>')
        lines.append('      <Style><IconStyle><href>' + icon + '</href></IconStyle></Style>')
        lines.append('      <Point>')
        lines.append(f'        <coordinates>{lon:.7f},{lat:.7f}</coordinates>')
        lines.append('      </Point>')
        lines.append('    </Placemark>')

    lines.append('  </Document>')
    lines.append('</kml>')
    return '\n'.join(lines)


def extract_waypoints_from_osrm(data):
    """Extract waypoint list from OSRM response."""
    wps = []
    for i, wp in enumerate(data.get('waypoints', [])):
        name = wp.get('name', '') or f'Waypoint {i+1}'
        lon, lat = wp['location']
        wps.append({'name': name, 'desc': '', 'lon': lon, 'lat': lat})
    return wps


def main():
    if len(sys.argv) < 3:
        print(__doc__, file=sys.stderr)
        sys.exit(1)

    input_path  = sys.argv[1]
    output_path = sys.argv[2]

    # Parse optional flags
    wp_path      = None
    route_color  = 'ff3b82f6'
    route_width  = 6

    i = 3
    while i < len(sys.argv):
        if sys.argv[i] == '--waypoints' and i + 1 < len(sys.argv):
            wp_path = sys.argv[i + 1]
            i += 2
        elif sys.argv[i] == '--route-color' and i + 1 < len(sys.argv):
            route_color = sys.argv[i + 1]
            i += 2
        elif sys.argv[i] == '--route-width' and i + 1 < len(sys.argv):
            route_width = int(sys.argv[i + 1])
            i += 2
        else:
            print(f'Unknown option: {sys.argv[i]}', file=sys.stderr)
            sys.exit(1)

    # ── Read OSRM JSON ──
    with open(input_path, encoding='utf-8') as f:
        data = json.load(f)

    route = data['routes'][0]
    coords = route['geometry']['coordinates']
    dist_km = route['distance'] / 1000
    dur_min = route['duration'] / 60

    # ── Waypoints ──
    if wp_path:
        with open(wp_path, encoding='utf-8') as f:
            waypoints = json.load(f)
    else:
        waypoints = extract_waypoints_from_osrm(data)

    # ── Build KML ──
    kml = build_kml(coords, dist_km, dur_min, waypoints, route_color, route_width)

    os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(kml)

    size_kb = len(kml.encode('utf-8')) / 1024
    print(f'KML written: {output_path}')
    print(f'  Coordinates: {len(coords):,}')
    print(f'  Waypoints:   {len(waypoints)}')
    print(f'  Distance:    {dist_km:.1f} km')
    print(f'  Duration:    {int(dur_min//60)}h{int(dur_min%60)}m')
    print(f'  Size:        {size_kb:.0f} KB')


if __name__ == '__main__':
    main()
